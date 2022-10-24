<template>
	<div>

		<el-tabs v-model="formSearch.tab" @tab-change="getData">
			<el-tab-pane :label="item.name" :name="item.key" v-for="(item,index) in tabbars" :key="index"></el-tab-pane>
		</el-tabs>

		<el-card shadow="never" class="border-0">

			<!-- 搜索 -->
			<search :model="formSearch" @search="getData" @reset="resetSearchForm">
				<search-item label="订单编号：">
					<el-input v-model=" formSearch.no" size="small" />
				</search-item>

				<template #show>
					<search-item label="收货人：">
						<el-input v-model=" formSearch.name" size="small" placeholder="收货人" />
					</search-item>
					<search-item label="手机号：">
						<el-input v-model=" formSearch.phone" size="small" placeholder="手机号" />
					</search-item>
					<search-item label="开始时间：">

						<el-date-picker v-model="formSearch.starttime" type="date" placeholder="开始时间" style="width: 90%;"
							value-format="YYYY-MM-DD" />

					</search-item>
					<search-item label="结束时间：">
						<el-date-picker v-model="formSearch.endtime" type="date" placeholder="结束时间" style="width: 90%;"
							value-format="YYYY-MM-DD" />
					</search-item>
				</template>
			</search>

			<!-- 头部 -->
			<!-- 新增/刷新组件 -->
			<new-flushed @update="update" layout="refresh,download" @download="exportOrders">
				<el-button type="danger" size="small" @click="handleMultiDelete">批量删除</el-button>
			</new-flushed>
			<!-- 表格部分· -->
			<el-table ref="multipleTableRef" :data="tableData" stripe v-loading="loading"
				@selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" />
				<!-- 商品 -->
				<el-table-column label="商品" width="380">
					<template #default="{ row }">
						<div class="flex items-center">
							<div class="text-gray-500 text-xs">
								<p>订单编号：</p>
								<p>{{ row.no }}</p>
							</div>
							<div class="ml-5 text-gray-500 text-xs">
								<p>下单时间：</p>
								<p>{{ row.create_time }}</p>
							</div>
						</div>
						<div class="flex mt-5" v-for="(item,index) in row.order_items" :key="index">
							<el-image :src="item.goods_item?.cover" fit="fill" :lazy="true" style="width:30px;height:30;"
								class="rounded" />
							<p class="ml-4">{{ item.goods_item?.title ?? '未找到详情信息' }}</p>
						</div>
					</template>
				</el-table-column>

				<el-table-column prop="total_price" label="实际付款" width="100" align="center" />

				<el-table-column label="买家信息" width="120" align="center">
					<template #default="{ row }">
						<p>{{ row.user.nickname ?? row.user.username }}</p>
						<p>(用户id: {{ row.user.id }})</p>
					</template>
				</el-table-column>
				<el-table-column label="交易状态" width="220">
					<template #default="{ row }">
						<div class="flex">
							<p class="mr-2"> 付款状态:</p>
							<el-tag v-if="row.payment_method == 'alipay'">支付宝支付</el-tag>
							<el-tag type="success" v-else-if="row.payment_method == 'wechat'">微信支付</el-tag>
							<el-tag type="info" v-else>未支付</el-tag>
						</div>

						<div class="flex mt-2">
							<p class="mr-2">发货状态:</p>
							<el-tag :type="row.ship_data ? 'success': 'info'">{{ row.ship_data ? "已发货" : '未发货' }}</el-tag>
						</div>
						<div class="flex mt-2">
							<p class="mr-2">收货状态:</p>
							<el-tag :type="!row.ship_status == 'pending' ? 'success': 'info'">{{ !row.ship_status == 'pending' ? "已收货"
							: '未收货' }}
							</el-tag>
						</div>

					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template #default="{ row }">
						<el-button class="px-1" type="primary" size="small" text @click="openInfoModal(row)">订单详情</el-button>
						<el-button v-if="formSearch.tab === 'noship'" class="px-1" type="primary" size="small" text>订单发货</el-button>
						<el-button v-if="formSearch.tab === 'refunding'" class="px-1" type="primary" size="small" text
							@click="onHandleRefund(row.id,1)">同意退款
						</el-button>
						<el-button v-if="formSearch.tab === 'refunding'" class="px-1" type="primary" size="small" text
							@click="onHandleRefund(row.id,0)">拒绝退款
						</el-button>
					</template>
				</el-table-column>

			</el-table>

			<!-- 分页部分 -->
			<div class="flex justify-center items-center mt-5">
				<el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page="currentPage"
					@current-change="getData" />
			</div>

		</el-card>
		<!-- 下载模块 -->
		<ExportExcel ref="ExportExcelRef" :tabbars="tabbars" />
		<!-- 订单详情模块 -->
		<infoModals ref="infoModalsRef" :info="info" />
	</div>
</template>

<script setup>
import { ref } from 'vue'

// 获取/新增/修改/删除
import {
	GetOrderList,
	DeleteOrderList,
	handleRefund,
} from '~/api/order'

// 新增/刷新组件
import NewFlushed from '~/components/common/NewFlushed.vue'

// 提示组件
import { showModal, showMessageBox, toast } from '~/composables/util'

// 分页和搜索封装的函数 // 表单新增修改功能  // 修改状态和删除和刷新
import { useInitTable } from '~/composables/hook/useCommon'

// 搜索组件
import search from '~/components/common/search.vue'
import searchItem from '~/components/common/searchItem.vue'

// 下载组件
import ExportExcel from "./children/ExportExcel.vue"
// 订单详情
import infoModals from "./children/infoModals.vue"

// 分页和搜索封装的函数
const {
	// 搜索
	formSearch,
	resetSearchForm,
	// 分页
	total,
	pageSize,
	currentPage,
	tableData,
	// 加载
	loading,
	// 获取数据
	getData,
	multiSelectionIds,

	handleDelete,
	update,

	handleMultiDelete,
	multipleTableRef,
	handleSelectionChange,

	handleMultiStatusChange,
} = useInitTable({
	// 搜索和重置  
	formSearch: {
		tab: 'all',
		no: '',
		starttime: '',
		endtime: '',
		name: '',
		phone: '',

	},
	// 获取数据的请求
	GetData: GetOrderList,
	// 获取的数据
	onGetListSuccess(res) {
		tableData.value = res.list.map((o) => {
			o.bannersLoading = false;
			o.contentLoading = false;
			o.SkusLoading = false
			return o;
		});
		total.value = res.totalCount;
	},

	remove: DeleteOrderList,
})



// tab栏遍历
const tabbars = [
	{
		key: "all",
		name: "全部"
	},
	{
		key: "nopay",
		name: "待支付"
	},
	{
		key: "noship",
		name: "待发货"
	},
	{
		key: "shiped",
		name: "待收货"
	},
	{
		key: "received",
		name: "已收货"
	},
	{
		key: "finish",
		name: "已完成"
	},
	{
		key: "closed",
		name: "已关闭"
	},
	{
		key: "refunding",
		name: "退款中"
	}
]

// 下载组件
const ExportExcelRef = ref(null)
const exportOrders = () => {
	ExportExcelRef.value.open()
}


// 订单详情
const infoModalsRef = ref(null)
const info = ref(null)
const openInfoModal = (row) => {
	row.order_items = row.order_items.map(o => {
		if (o.skus_type == 1 && o.goods_skus) {
			let s = []
			for (const key in o.goods_skus.skus) {
				s.push(o.goods_skus.skus[key].value)
			}
			o.skus = s.join(',')
		}
		return o
	})
	info.value = row
	infoModalsRef.value.open()
}

// 同意/拒绝退款
const onHandleRefund = (id, agree) => {
	(agree ? showModal("是否要同意该订单退款?") : showMessageBox('请输入拒绝的理由'))
		.then(res => {
			let data = { agree }
			if (!agree) {
				data.disagree_reason = res.value
			}
			handleRefund(id, data).then(res => {
				getData()
				toast("操作成功")
			})
		})
}
</script>

<style  scoped>

</style>