<template>
  <el-dialog title="商品关联" v-model="dialogVisible" width="80%">
    <!-- 表格部分· -->
    <el-table ref="multipleTableRef" :data="tableData" stripe v-loading="loading"
      @selection-change="handleSelectionChange" style="width: 100%" height="500px">
      <el-table-column type="selection" width="55" />
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image :src="row.cover" style="width:50px;height:50px;" class="rounded mr-3" fit="cover" :lazy="true" />
            <div class="flex-1">
              <p>{{ row.title }}</p>
              <p class="text-gray-400 text-xs mb-1">分类:{{ row.category ? row.category.name : "未分类" }}</p>
              <p class="text-gray-400 text-xs">创建时间：{{ row.create_time }}</p>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="总库存" width="90" prop="stock" align="center" />
      <el-table-column label="价格（元）" width="150" prop="stock" align="center">
        <template #default="{ row }">
          <span class="text-red-400">￥ {{ row.min_price }}</span>
          <el-divider direction="vertical" />
          <span class="text-xs text-gray-500 italic line-through">{{ row.min_oprice }}</span>
        </template>
      </el-table-column>

    </el-table>

    <div class="flex items-center justify-center mt-5">
      <el-pagination background layout="prev, pager ,next" :total="total" :current-page="currentPage"
        :page-size="pageSize" @current-change="getData" />
    </div>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDialog">确定</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { ref } from 'vue'

import {
  GetGoodsList,
} from '~/api/goods'


// 分页和搜索封装的函数 // 表单新增修改功能  // 修改状态和删除和刷新
import { useInitTable } from '~/composables/hook/useCommon'

const dialogVisible = ref(null)

const callbackFunction = ref(null)
const open = (callback = null) => {
  callbackFunction.value = callback
  dialogVisible.value = true;
}
const close = () => {
  dialogVisible.value = false;
}


// 分页和搜索封装的函数
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
  multiSelectionIds,

  multipleTableRef,
  handleSelectionChange,

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
    tableData.value = res.list;
    total.value = res.totalCount;
  },
})




defineExpose({
  open,
  close,
})

// 确定关联按钮
const handleDialog = () => {
  if (typeof callbackFunction.value === 'function') {
    callbackFunction.value(multiSelectionIds.value)
  }
}


</script>

<style  scoped>

</style>