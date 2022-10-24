<template>
  <div>
    <el-card shadow="never" class="border-0">

      <!-- 搜索 -->
      <search :model="formSearch" @search="getData" @reset="resetSearchForm" ref="form" label-width="150px">
        <search-item label="搜索指定管理员：">
          <el-input v-model="formSearch.keyword" placeholder="手机号/邮箱/会员昵称"></el-input>
        </search-item>
        <template #show>
          <search-item label="会员等级：">
            <el-select v-model="formSearch.user_level_id" size="small" placeholder="请选择会员等级">
              <el-option v-for="item in serve_list" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </search-item>
        </template>
      </search>

      <!-- 头部 -->
      <!-- 新增/刷新组件 -->
      <new-flushed @NewNotice="NewNotice" @update="update" />
      <!-- 表格部分· -->
      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
        <el-table-column label="会员">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-avatar :size="40" :src="row.avatar"> </el-avatar>
              <div class="ml-3">
                <h6>{{row.username}}</h6>
                <small>ID:{{row.id}}</small>
              </div>
            </div>
          </template>
        </el-table-column>



        <el-table-column label="会员等级" align="center">
          <template #default="{ row }">
            {{ row.user_level?.name || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="登录注册" align="center">
          <template #default="{ row }">
            <p v-if="row.last_login_time">
              最后登录 : {{ row.last_login_time }}
            </p>
            <p>
              注册时间 : {{ row.create_time }}
            </p>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
              @change="handleStatusChange($event,row)" :loading="row.statusLoading">
            </el-switch>
          </template>
        </el-table-column>


        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleUpdate(scope.row)">修改</el-button>
            <el-popconfirm title="是否要移除该会员?" confirm-button-text="确定" cancel-button-text="取消"
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
    <form-drawer :title="noticeTitle + '会员'" ref="formDrawerRef">
      <template #form>
        <el-form :model="from" ref="formRef" label-width="120px" :inline="false">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="from.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="from.password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="from.nickname" placeholder="昵称"></el-input>
          </el-form-item>
          <el-form-item label="会员头像" prop="avatar">
            <choose-image v-model="from.avatar" />
            <!-- <el-input v-model="from.avatar"></el-input> -->
          </el-form-item>
          <el-form-item label="会员等级" prop="avatar">
            <el-select v-model="from.user_level_id" size="small" placeholder="请选择会员等级">
              <el-option v-for="item in serve_list" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <!-- <el-input v-model="from.avatar"></el-input> -->
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="from.phone" placeholder="手机"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="from.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch v-model="from.status" :active-value="1" :inactive-value="0">
            </el-switch>
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

// 上传头像组件
import ChooseImage from '~/components/manager/ChooseImage.vue'

// 获取/新增/修改/删除管理员 // 修改管理员状态
import {
  GetUserList,
  ModifyUser,
  CreateUser,
  RemoveUser,
  UpdateUser
} from '~/api/user'

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

  handleStatusChange,
  handleDelete,
  update,
} = useInitTable({
  // 搜索和重置  
  formSearch: {
    keyword: "",
    user_level_id: null,
  },
  // 获取数据的请求
  GetData: GetUserList,
  // 获取的数据
  onGetListSuccess(res) {
    tableData.value = res.list.map((o) => {
      o.statusLoading = false;
      return o;
    });
    total.value = res.totalCount;
    roles.value = res.roles;
    serve_list.value = res.user_level
  },

  remove: RemoveUser,
  modify: ModifyUser,

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
    username: "",
    password: "",
    user_level_id: null,
    status: 1,
    avatar: "",
    nickname: "",
    phone: "",
    email: "",
  },
  update: UpdateUser,
  create: CreateUser,
  rules: {},
  getData,
})



// 角色
const roles = ref([]);


// 页码变更事件
const addList = (e) => {
  getData(e)
}

</script>

<style  scoped>

</style>