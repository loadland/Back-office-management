<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 头部 -->
      <div class="flex  items-center justify-between mb-5">
        <el-button type="primary" size="default" @click="NewNotice">新增</el-button>
        <el-tooltip class="box-item" effect="dark" content="刷新数据" placement="top">
          <el-button text @click="update">
            <el-icon>
              <Refresh />
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
      <!-- 表格部分· -->
      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="title" label="公告标题" />
        <el-table-column prop="create_time" label="发布时间" width="380" />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleUpdate(scope.row)">修改</el-button>
            <el-popconfirm title="是否要删除该行数据?" confirm-button-text="确定" cancel-button-text="取消"
              @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" size="small">删除</el-button>
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
    <form-drawer :title="noticeTitle + '公告'" ref="formDrawerRef">
      <template #form>
        <el-form :model="from" ref="formRef" :rules="rules" label-width="120px" :inline="false">
          <el-form-item label="公告标题：" prop="title">
            <el-input v-model="from.title" />
          </el-form-item>
          <el-form-item label="公告内容：" prop="content">
            <el-input v-model="from.content" type="textarea" :rows="5" />
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

// 获取/新增/修改/删除公告
import { DetNoticeList, NewNoticeList, UpdateNoticeList, DeleteNoticeList } from '~/api/notice'

// 抽屉组件
import formDrawer from "~/components/common/formDrawer.vue"


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


  handleDelete,
  update,
} = useInitTable({
  // 获取数据的请求
  GetData: DetNoticeList,
  remove: DeleteNoticeList,
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
    title: '',
    content: "",
  },
  update: UpdateNoticeList,
  create: NewNoticeList,
  rules: {},
  getData,
})


// 页码变更事件
const addList = (e) => {
  getData(e)
}

</script>

<style  scoped>

</style>