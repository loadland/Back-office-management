<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 头部 -->
      <new-flushed @NewNotice="NewNotice" @delete="handleMultiDelete" @update="update" layout="create,delete,refresh" />


      <!-- 表格部分· -->
      <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
        style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="规格名称" />
        <el-table-column prop="default" label="规格值" width="380" />
        <el-table-column prop="order" label="排序" />

        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
              @change="handleStatusChange($event,row)" :loading="row.statusLoading">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="250" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleUpdate(scope.row)" text>修改</el-button>
            <el-popconfirm title="是否要删除该行数据?" confirm-button-text="确定" cancel-button-text="取消"
              @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" size="small" text>删除</el-button>
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
    <form-drawer :title="noticeTitle + '角色'" ref="formDrawerRef" :destroyOnClose="true">
      <template #form>
        <el-form :model="from" ref="formRef" :rules="rules" label-width="120px" :inline="false">
          <el-form-item label="规格名称" prop="name">
            <el-input v-model="from.name" placeholder="规格名称"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="order">
            <el-input-number v-model="from.order" :min="0" :max="1000">
            </el-input-number>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch v-model="from.status" :active-value="1" :inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item label="规格值" prop="default">
            <tag-input v-model="from.default"></tag-input>
          </el-form-item>
        </el-form>
      </template>

      <template #btn>
        <el-button type="primary" @click="onsubmit">提交</el-button>
      </template>

    </form-drawer>


  </div>
</template>

<script setup>
import { ref } from 'vue'

import NewFlushed from '~/components/common/NewFlushed.vue'

// 获取/新增/修改/删除
import { GetSkusList, CreateSkusList, UpdateSkusList, DeleteSkusList, reviseSkus } from '~/api/skus'

// 获取角色权限的数据
import { GetRuleList } from "~/api/rule"

// 抽屉组件
import formDrawer from "~/components/common/formDrawer.vue"

// tag
import tagInput from "~/components/common/tagInput.vue"
// 提示组件
import { toast } from '~/composables/util'


// 分页和搜索封装的函数
import { useInitTable, useInitForm } from '~/composables/hook/useCommon'



const {
  // 分页
  total,
  pageSize,
  currentPage,
  tableData,
  // 加载
  loading,
  // 获取数据
  getData,

  handleStatusChange,
  handleDelete,
  update,


  multipleTableRef,
  handleMultiDelete,
  handleSelectionChange
} = useInitTable({
  // 获取数据的请求
  GetData: GetSkusList,
  remove: DeleteSkusList,
  modify: reviseSkus,
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
    name: "",
    status: 1,
    default: "",
    order: 50
  },
  rules: {
    name: [{
      required: true,
      message: '规格名称不能为空',
      trigger: 'blur'
    }],
    default: [{
      required: true,
      message: '规格值不能为空',
      trigger: 'blur'
    }],
  },
  getData,
  update: UpdateSkusList,
  create: CreateSkusList,
})

// 页码变更事件
const addList = (e) => {
  getData(e)
}



// 数组深层遍历
// function getId(lists) {
//   const hasChildrenArr = (obj) => {
//     return obj.child !== undefined
//   }
//   lists.forEach(list => {
//     defaultExpandedKeys.value.push(list.id)
//     if (hasChildrenArr(list)) {
//       getId(list.child)
//     }
//   })
// }

</script>

<style  scoped>

</style>