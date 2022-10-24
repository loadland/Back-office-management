<template>
  <div>
    <indexTitle />

    <div class="mt-5">
      <el-card shadow="never" class="border-0">

        <!-- 搜索 -->
        <search :model="formSearch" @search="getData" @reset="resetSearchForm">
          <search-item label="时间选择：">
            <el-radio-group v-model="formSearch.type">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="today">今天</el-radio-button>
              <el-radio-button label="yesterday">昨天</el-radio-button>
              <el-radio-button label="last7days">最近7天</el-radio-button>
            </el-radio-group>
          </search-item>

          <template #show>
            <search-item label="关键词：">
              <el-input v-model="formSearch.keyword" size="small" placeholder="收货人" />
            </search-item>
            <search-item label="开始时间：">
              <el-date-picker v-model="formSearch.starttime" size="small" type="date" placeholder="开始时间"
                style="width: 90%;" value-format="YYYY-MM-DD" />
            </search-item>
            <search-item label="结束时间：">
              <el-date-picker v-model="formSearch.endtime" size="small" type="date" placeholder="结束时间"
                style="width: 90%;" value-format="YYYY-MM-DD" />
            </search-item>
          </template>

        </search>

        <!-- 头部 -->
        <!-- 表格部分· -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
          <el-table-column label="ID" prop="id" align="center" />
          <el-table-column label="头像">
            <template #default="{ row }">
              <el-avatar :size="40" :src="row.avatar"> </el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="用户信息" align="left" width="200px">
            <template #default="{ row }">
              <div class="text-xs">
                <p>用户：{{ row.username }}</p>
                <p>昵称：{{ row.nickname }}</p>
                <p>姓名：{{ row.user_info.name }}</p>
                <p>电话：{{ row.phone }}</p>
              </div>
            </template>
          </el-table-column>


          <el-table-column label="推广用户数量" width="180" align="center" prop="share_num" />
          <el-table-column label="订单数量" width="180" align="center" prop="share_order_num" />
          <el-table-column label="订单金额" width="180" align="center" prop="order_price" />
          <el-table-column label="账户佣金" width="180" align="center" prop="commission" />
          <el-table-column label="已提现金额" width="180" align="center" prop="cash_out_price" />
          <el-table-column label="提现次数" width="180" align="center" prop="cash_out_time" />
          <el-table-column label="未提现金额" width="180" align="center" prop="no_cash_out_price" />

          <el-table-column fixed="right" label="操作" width="180" align="center">
            <template #default="{ row }">
              <el-button type="primary" size="small" text @click="onSubmitForm(row.id, 'user')">推广人
              </el-button>
              <el-button type="primary" size="small" text @click="onSubmitForm(row.id, 'order')">推广订单
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


    </div>

    <dateDrawer ref="dateDrawerRef" type="user"></dateDrawer>
    <dateDrawer ref="orderDataDrawerRef" type="order"></dateDrawer>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import indexTitle from './children/indexTitle.vue'
import dateDrawer from './children/dateDrawer.vue'

import { getAgentList } from '~/api/distribution'

// 分页和搜索封装的函数 // 表单新增修改功能  // 修改状态和删除和刷新
import { useInitTable } from '~/composables/hook/useCommon'


// 搜索组件
import search from '~/components/common/search.vue'
import searchItem from '~/components/common/searchItem.vue'

const serve_list = ref([])

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
} = useInitTable({
  // 搜索和重置  
  formSearch: {
    keyword: "",
    type: "all",
    starttime: null,
    endtime: null
  },
  // 获取数据的请求
  GetData: getAgentList,
})


const dateDrawerRef = ref(null)
const orderDataDrawerRef = ref(null)
const onSubmitForm = (id, type) => {
  (type == "user" ? dateDrawerRef : orderDataDrawerRef).value.open(id)
}

</script>

<style scoped>

</style>