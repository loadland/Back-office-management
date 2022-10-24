<template>
  <div>
    <el-card shadow="never" class="border-0">

      <!-- 头部 -->
      <!-- 新增/刷新组件 -->
      <new-flushed @NewNotice="NewNotice" @update="update" />
      <!-- 表格部分· -->
      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="会员等级" />
        <el-table-column prop="discount" label="折扣率" align="center" />
        <el-table-column prop="level" label="等级序号" align="center" />

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
            <el-popconfirm title="是否要删除该会员选项?" confirm-button-text="确定" cancel-button-text="取消"
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
    <form-drawer :title="noticeTitle + '角色'" ref="formDrawerRef">
      <template #form>
        <el-form :model="from" ref="formRef" label-width="120px" :inline="false">
          <el-form-item label="等级名称" prop="name">
            <el-input v-model="from.name" placeholder="等级名称"></el-input>
          </el-form-item>
          <el-form-item label="等级权重" prop="level">
            <el-input v-model="from.level" placeholder="等级权重"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch v-model="from.status" :active-value="1" :inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item label="升级条件">
            <div>
              <small class="text-xs mr-2">累计消费满</small>
              <el-input v-model="from.max_price" placeholder="元" style="width:50%;">
                <template #append>元</template>
              </el-input>
              <small class="text-gray-400 flex">
                设置会员等级所需要的累计消费必须大于等于0,单位：元
              </small>
            </div>

            <div>
              <small class="text-xs mr-2">累计次数满</small>
              <el-input v-model="from.max_times" placeholder="次数" style="width:50%;">
                <template #append>次</template>
              </el-input>
              <small class="text-gray-400 flex">
                设置会员等级所需要的购买量必须大于等于0,单位：笔
              </small>
            </div>
          </el-form-item>
          <el-form-item label="折扣率(%)" prop="discount">
            <el-input v-model="from.discount" placeholder="折扣率(%)" style="width:50%;">
              <template #append>%</template>
            </el-input>
            <small class="text-gray-400 flex">
              折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买
            </small>
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
  GetUserLevelList,
  ModifyUserLevel,
  CreateUserLevel,
  RemoveUserLevel,
  UpdateUserLevel
} from '~/api/level'

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

// 分页和搜索封装的函数
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
} = useInitTable({
  // 获取数据的请求
  GetData: GetUserLevelList,
  // 获取的数据
  onGetListSuccess(res) {
    tableData.value = res.list.map((o) => {
      o.statusLoading = false;
      return o;
    });
    total.value = res.totalCount;
    roles.value = res.roles;
  },

  remove: RemoveUserLevel,
  modify: ModifyUserLevel,

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
    level: 0,
    discount: 0,
    status: 1,
    max_price: 0,
    max_times: 0,
  },
  update: UpdateUserLevel,
  create: CreateUserLevel,
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