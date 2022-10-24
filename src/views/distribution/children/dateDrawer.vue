<template>
  <el-drawer :title="drawerTitle" v-model="dialogVisible" size="70%">
    <el-form :model="formSearch" size="small">
      <el-form-item label="时间选择：">
        <el-radio-group v-model="formSearch.type">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="today">今天</el-radio-button>
          <el-radio-button label="yesterday">昨天</el-radio-button>
          <el-radio-button label="last7days">最近7天</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开始时间：">
        <el-date-picker v-model="formSearch.starttime" size="small" type="date" placeholder="开始时间" style="width: 10%;"
          value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="结束时间：">
        <el-date-picker v-model="formSearch.endtime" size="small" type="date" placeholder="结束时间" style="width: 10%;"
          value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="用户类型：">
        <el-radio-group v-model="formSearch.level">
          <el-radio-button :label="0">全部</el-radio-button>
          <el-radio-button :label="1">一级推广</el-radio-button>
          <el-radio-button :label="2">二级推广</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">搜索</el-button>
        <el-button @click="resetSearchForm">重置</el-button>
      </el-form-item>
    </el-form>


    <!-- 表格部分· -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">

      <template v-if="type == 'user'">
        <el-table-column label="ID" prop="id" align="center" />
        <el-table-column label="头像">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column label="用户信息" align="left" width="200px" prop="username" />
        <el-table-column label="推广数量" width="180" align="center" prop="share_num" />
        <el-table-column label="推广订单数量" width="180" align="center" prop="share_order_num" />
        <el-table-column label="绑定时间" width="180" align="center" prop="create_time" />
      </template>


      <template v-else>
        <el-table-column label="订单号">
          <template #default="{ row }">
            {{ row.order.no }}
          </template>
        </el-table-column>
        <el-table-column label="用户名|昵称|手机">
          <template #default="{ row }">
            <div v-if="!row.order.user">
              该用户已被删除
            </div>
            <div v-else>
              {{ row.order.user.username }}|{{ row.order.user.nickname }}|{{ row.order.user.phone }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="create_time" />
        <el-table-column label="返佣金额" prop="commission" />
      </template>

    </el-table>


    <!-- 分页部分 -->
    <div class="flex justify-center items-center mt-5">
      <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page="currentPage"
        @current-change="getData" />
    </div>

  </el-drawer>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useInitTable } from '~/composables/hook/useCommon'

import {
  getAgentList,
  getAgentOrderList
} from '~/api/distribution'

const props = defineProps({
  type: {
    type: String,
    default: 'user',
  }
})
const drawerTitle = computed(() => props.type === 'user' ? '推广人列表' : '推广订单列表')
const dialogVisible = ref(false)
const open = (id) => {
  dialogVisible.value = true
  formSearch.user_id = id
  getData()
}
const {
  // 搜索
  formSearch,
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
    type: "all",
    starttime: null,
    endtime: null,
    level: 0,
    user_id: 0
  },
  // 获取数据的请求
  GetData: (() => {
    return props.type == 'user' ? getAgentList : getAgentOrderList
  })(),
})

const resetSearchForm = () => {
  searchForm.type = "all"
  searchForm.starttime = null
  searchForm.endtime = null
  searchForm.level = 0
}

defineExpose({
  open,
})
</script>

<style scoped>

</style>