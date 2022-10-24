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
        <el-table-column prop="name" label="角色" />
        <el-table-column prop="desc" label="角色描述" />

        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
              @change="handleStatusChange($event,row)" :loading="row.statusLoading">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="250" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" text @click="addRoot(scope.row)">角色权限</el-button>
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
    <form-drawer :title="noticeTitle + '角色'" ref="formDrawerRef">
      <template #form>
        <el-form :model="from" ref="formRef" :rules="rules" label-width="120px" :inline="false">
          <el-form-item label="角色标题：" prop="name">
            <el-input v-model="from.name" />
          </el-form-item>
          <el-form-item label="角色描述：" prop="desc">
            <el-input v-model="from.desc" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch v-model="from.status" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-form>
      </template>

      <template #btn>
        <el-button type="primary" @click="onsubmit">提交</el-button>
      </template>

    </form-drawer>


    <form-drawer title="角色权限" ref="formRootRef">
      <template #form>
        <el-tree ref="elTreeRef" node-key="id" :default-expanded-keys="defaultExpandedKeys" :data="roleList"
          :props="{value:'id', label:'name',children:'child' }" show-checkbox :height="WindowHeight"
          @check="handleTreeCheck" :check-strictly="checkStrictly">
          <template #default="{ data }">
            <div class="flex items-center">
              <el-tag :type="data.menu ? '' : 'info'" size="small">
                {{ data.menu ? "菜单" : "权限" }}
              </el-tag>
              <el-icon v-if="data.icon" :size="16" class="ml-2">
                <component :is="data.icon" />
              </el-icon>
              <span class="ml-2 text-sm"> {{ data.name }} </span>
            </div>
          </template>
        </el-tree>
      </template>

      <template #btn>
        <el-button type="primary" @click="handleSetRuleSubmit">提交</el-button>
      </template>

    </form-drawer>
  </div>
</template>

<script setup>
import { isPlainObject } from 'lodash'
import { ref } from 'vue'

// 获取/新增/修改/删除
import { DetRoleList, NewRoleList, UpdateRoleList, DeleteRoleList, ModifyRole, RolePermissions } from '~/api/role'

// 获取角色权限的数据
import { GetRuleList } from "~/api/rule"

// 抽屉组件
import formDrawer from "~/components/common/formDrawer.vue"


// 分页和搜索封装的函数
import { useInitTable, useInitForm } from '~/composables/hook/useCommon'
import { toast } from '~/composables/util'



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
  GetData: DetRoleList,
  remove: DeleteRoleList,
  modify: ModifyRole,
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
    desc: "",
    status: 1,
  },
  update: UpdateRoleList,
  create: NewRoleList,
  rules: {},
  getData,
})


// 页码变更事件
const addList = (e) => {
  getData(e)
}


// 角色权限表单
const formRootRef = ref(null)
// 角色权限id
const roleIds = ref([])
// 当前角色权限id
const roleId = ref(0)
// 获取到角色id
const defaultExpandedKeys = ref([])
// 获取到树形控件表单
const elTreeRef = ref(null)

// 角色权限面板
const roleList = ref([])

// 计算高度
const WindowHeight = ref(0)

const checkStrictly = ref(false)

// 角色权限
const addRoot = (row) => {
  roleId.value = row.id
  checkStrictly.value = true
  GetRuleList(1).then((res) => {
    roleList.value = res.list
    defaultExpandedKeys.value = res.list.map(o => o.id)
    // getId(res.list)

    roleIds.value = row.rules.map(o => o.id)
    setTimeout(() => {
      elTreeRef.value.setCheckedKeys(roleIds.value)
      checkStrictly.value = false
    }, 150);
  })
  WindowHeight.value = window.innerHeight - 180
  formRootRef.value.open()

    
}

const handleSetRuleSubmit = () => {
  RolePermissions(roleId.value, roleIds.value).then(res => {
    toast("请求成功");
    getData();
    formRootRef.value.close()
  })
}


const handleTreeCheck = (...e) => {
  const { checkedKeys, halfCheckedKeys } = e[1]
  roleIds.value = [...checkedKeys, ...halfCheckedKeys]
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