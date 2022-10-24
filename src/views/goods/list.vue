<template>
  <div>

    <el-tabs v-model="formSearch.tab" @tab-change="getData">
      <el-tab-pane :label="item.name" :name="item.key" v-for="(item,index) in tabbars" :key="index"></el-tab-pane>
    </el-tabs>

    <el-card shadow="never" class="border-0">

      <!-- 搜索 -->
      <search :model="formSearch" @search="getData" @reset="resetSearchForm">
        <search-item label="商品名称：">
          <el-input v-model=" formSearch.title" size="small" />
        </search-item>

        <template #show>
          <search-item label="商品分类：">
            <el-select v-model="formSearch.category_id" size="small">
              <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </search-item>
        </template>
      </search>

      <!-- 头部 -->
      <!-- 新增/刷新组件 -->
      <new-flushed @NewNotice="NewNotice" @update="update" layout="create,refresh">
        <el-button v-if="formSearch.tab != 'delete'" type="danger" size="small" @click="handleMultiDelete">批量删除
        </el-button>


        <el-button v-if="formSearch.tab == 'delete'" size="small" @click="handleMultiRestore">回复商品</el-button>
        <el-button v-if="formSearch.tab == 'delete'" type="danger" @click="handleMultiDestroy" size="small">永久删除
        </el-button>

        <el-button text type="info" size="small" @click="handleMultiStatusChange(1)"
          v-if="formSearch.tab == 'all' ||  formSearch.tab == 'off'">上架</el-button>
        <el-button text type="info" size="small" @click="handleMultiStatusChange(0)"
          v-if="formSearch.tab == 'all' ||  formSearch.tab == 'saling'">下架</el-button>
      </new-flushed>
      <!-- 表格部分· -->
      <el-table ref="multipleTableRef" :data="tableData" stripe v-loading="loading"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品" width="300">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-image :src="row.cover" style="width:50px;height:50px;" class="rounded mr-3" fit="cover"
                :lazy="true" />
              <div>
                <h5 class="text-gray-800">{{ row.title }}</h5>
                <div>
                  <span class="text-red-400">￥ {{ row.min_price }}</span>
                  <el-divider direction="vertical" />
                  <span class="text-xs text-gray-500 italic line-through">{{ row.min_oprice }}</span>
                </div>
                <div class="text-xs text-gray-400">
                  <!-- <div>分类：{{ row.category.name }}</div> -->
                  <!-- <div>上架时间：{{ row.category }}</div> -->
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="sale_count" label="实际销量" width="100" align="center" />

        <el-table-column label="商品状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'" size="small"> {{ row.status ? '上架' : '仓库' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="120">
          <template #default="{ row }">
            <div class="flex flex-col" v-if="row.ischeck == 0">
              <el-tag type="success" size="small">通过</el-tag>
              <el-tag class="mt-2 !ml-0" type="danger" size="small">拒绝</el-tag>
            </div>
            <span v-else class="flex justify-center"> {{ row.ischeck == 1 ? "通过" : "拒绝" }} </span>
          </template>
        </el-table-column>

        <el-table-column label="总库存" width="90" prop="stock" align="center" />

        <el-table-column label="操作" align="right">
          <template #default="scope">
            <el-button text type="primary" size="small" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button text :type="scope.row.goods_banner.length === 0 ? 'danger' : 'primary'" size="small"
              @click="handleSetGoodsBanners(scope.row)" :loading="scope.row.bannersLoading">轮播图</el-button>
            <el-button text
              :type="(scope.row.sku_type == 0 && !scope.row.sku_value) || (scope.row.sku_type == 1 && !scope.row.goods_skus.length) ? 'danger' : 'primary'"
              size="small" @click="handleSetGoodsSkus(scope.row)" :loading="scope.row.SkusLoading">规格</el-button>
            <el-button text :type="!scope.row.content ? 'danger' : 'primary'" size="small"
              @click="handleSetGoodsContent(scope.row)" :loading="scope.row.contentLoading">详情</el-button>

            <el-popconfirm title="是否要删除该商品?" confirm-button-text="确定" cancel-button-text="取消"
              @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button text type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>

      <!-- 分页部分 -->
      <div class="flex justify-center items-center mt-5">
        <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page="currentPage"
          @current-change="addList" />
      </div>


    </el-card>

    <!-- 抽屉组件 -->
    <form-drawer :title="noticeTitle + '商品'" ref="formDrawerRef">
      <template #form>
        <el-form :model="from" ref="formRef" label-width="120px" :inline="false">
          <el-form-item label="商品名：" prop="title">
            <el-input v-model="from.title" placeholder="请输入商品名称，不能超过60个字符"></el-input>
          </el-form-item>
          <el-form-item label="商品封面：" prop="cover">
            <choose-image v-model="from.cover" />
          </el-form-item>
          <el-form-item label="商品分类：" prop="category_id">
            <el-select v-model="from.category_id" placeholder="选择分类">
              <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input v-model="from.unit" placeholder="单位“件”" style="width:50%;">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="总库存" prop="stock">
            <el-input v-model="from.stock" type="number" style="width:40%;">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存预警" prop="min_stock">
            <el-input v-model="from.min_stock" type="number" style="width:40%;">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低销售价" prop="min_price">
            <el-input v-model="from.min_price" type="number" style="width:40%;">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低原价" prop="min_oprice">
            <el-input v-model="from.min_oprice" type="number" style="width:40%;">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存显示" prop="stock_display">
            <el-radio-group v-model="from.stock_display">
              <el-radio :label="0">隐藏</el-radio>
              <el-radio :label="1">显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架" prop="status">
            <el-radio-group v-model="from.status">
              <el-radio :label="0">放入仓库</el-radio>
              <el-radio :label="1">立即上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>

      <template #btn>
        <el-button type="primary" @click="onsubmit">提交</el-button>
      </template>

    </form-drawer>

    <banners ref="bannersRef" @reloadData="getData"></banners>
    <content ref="contentRef" @reloadData="getData"></content>
    <Skus ref="SkusRef" @reloadData="getData"></Skus>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 上传头像组件
import ChooseImage from '~/components/manager/ChooseImage.vue'

// 获取/新增/修改/删除
import {
  GetGoodsList,
  CreateGoods,
  DeleteGoodsList,
  UpdateGoods,
  ModifyGoods,
  RestoreGoodsList,
  DestroyGoodsList,
} from '~/api/goods'

// 商品分类
import { getCategoryList } from '~/api/category'

// 抽屉组件
import formDrawer from "~/components/common/formDrawer.vue"

// 新增/刷新组件
import NewFlushed from '~/components/common/NewFlushed.vue'

// 提示组件
import { toast } from '~/composables/util'

// 分页和搜索封装的函数 // 表单新增修改功能  // 修改状态和删除和刷新
import { useInitTable, useInitForm } from '~/composables/hook/useCommon'

// 搜索组件
import search from '~/components/common/search.vue'
import searchItem from '~/components/common/searchItem.vue'

// 抽屉组件
import banners from './children/banners.vue'
import content from './children/content.vue'
import Skus from './children/Skus.vue'

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
    title: null,
    category_id: null,
  },
  // 获取数据的请求
  GetData: GetGoodsList,
  // 获取的数据
  onGetListSuccess(res) {
    tableData.value = res.list.map((o) => {
      o.bannersLoading = false;
      o.contentLoading = false;
      o.SkusLoading = false
      return o;
    });
    total.value = res.totalCount;
    roles.value = res.roles;
  },

  remove: DeleteGoodsList,
  modify: ModifyGoods,
})


// 表单新增修改功能
const {
  noticeId,
  noticeTitle,
  formDrawerRef,
  formRef,
  rules,
  from,
  NewNotice,
  onsubmit,
  handleUpdate,
  resetForm,
} = useInitForm({
  from: {
    title: null, //商品名称
    category_id: null, //商品分类
    cover: null, //商品封面
    desc: null, //商品描述
    unit: "件", //商品单位
    stock: 100, //总库存
    min_stock: 10, //库存预警
    status: 1, //是否上架 0仓库1上架
    stock_display: 1, //库存显示 0隐藏1显示
    min_price: 0, //最低销售价
    min_oprice: 0 //最低原价
  },
  update: UpdateGoods,
  create: CreateGoods,
  rules: {},
  getData,
})

// console.log(tableData);

// 角色
const roles = ref([]);


// 页码变更事件
const addList = (e) => {
  getData(e)
}


// tab栏遍历
const tabbars = [
  {
    key: "all",
    name: "全部"
  },
  {
    key: "checking",
    name: "审核中"
  },
  {
    key: "saling",
    name: "出售中"
  },
  {
    key: "off",
    name: "已下架"
  },
  {
    key: "min_stock",
    name: "库存预警"
  },
  {
    key: "delete",
    name: "回收站"
  }
]

// 获取商品分类
const category_list = ref([])
getCategoryList().then(res => category_list.value = res)

// 设置轮播图
const bannersRef = ref(null)
const handleSetGoodsBanners = (row) => {
  bannersRef.value.open(row)
}

const contentRef = ref(null)
const handleSetGoodsContent = (row) => {
  contentRef.value.open(row)
}


const SkusRef = ref(null)
const handleSetGoodsSkus = (row) => {
  SkusRef.value.open(row)
}


// 批量回复
const handleMultiRestore = () => {
  fun(RestoreGoodsList, "回复")

};
// 永久删除
const handleMultiDestroy = () => {
  fun(DestroyGoodsList, "永久删除")
};

function fun(options, text) {
  loading.value = true;
  options(multiSelectionIds.value)
    .then((res) => {
      toast("" + text + "成功");
      getData();
      if (multipleTableRef.value) {
        multipleTableRef.value.clearSelection();
      }
    })
    .finally(() => (loading.value = false));
}
</script>

<style  scoped>

</style>