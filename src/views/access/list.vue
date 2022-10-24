<template>
  <el-card shadow="never" class="border-0">
    <new-flushed @NewNotice="NewNotice" @update="update" />

    <el-tree :data="tableData" :props="{ label:'name', children:'child' }" v-loading="loading" node-key="id"
      :default-expanded-keys="defaultExpandedKeys">
      <template #default="{  data }">
        <div class="custom-tree-node">
          <div>
            <el-tag size="small" :type="data.menu ? '' : 'info'"> {{ data.menu ? "菜单" : "权限"}}</el-tag>
            <el-icon v-if="data.icon" :size="16" class="ml-2">
              <component :is="data.icon" />
            </el-icon>
            <span>{{ data.name }}</span>
          </div>

          <div>
            <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0" class="mr-10"
              @change="handleStatusChange($event,data)" />
            <el-button type="primary" size="small" @click.stop="handleUpdate(data)">修改</el-button>
            <el-button text type="primary" size="small" @click.stop="addChild(data.id)">增加</el-button>
            <el-popconfirm title="是否要删除该管理员?" confirm-button-text="确定" cancel-button-text="取消"
              @confirm="handleDelete(data.id)">
              <template #reference>
                <el-button type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>


    <form-drawer :title="noticeTitle + '权限'" ref="formDrawerRef">
      <template #form>
        <el-form :model="from" ref="formRef" :rules="rules" label-width="120px" :inline="false">
          <el-form-item label="上级菜单" prop="rule_id">
            <el-cascader v-model="from.rule_id" :options="options"
              :props="{value:'id', label:'name', children:'child',checkStrictly:true,emitPath:false  }"
              placeholder="请选择上级菜单" />
          </el-form-item>
          <el-form-item label="菜单/规则" prop="menu">
            <el-radio-group v-model="from.menu">
              <el-radio label="1" border>菜单</el-radio>
              <el-radio label="0" border>规则</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="from.name" placeholder="名称" />
          </el-form-item>
          <el-form-item label="菜单图标" prop="icon" v-if="from.menu == 1">
            <IconSelect v-model="from.icon" />
          </el-form-item>
          <el-form-item label="前端路由" prop="frontpath" v-if="from.menu == 1 && from.rule_id > 0">
            <el-input v-model="from.frontpath" />
          </el-form-item>
          <el-form-item label="后端规则" prop="condition" v-if="from.menu == 0">
            <el-input v-model="from.condition" />
          </el-form-item>
          <el-form-item label="请求方式" prop="method" v-if="from.menu == 0">
            <el-select v-model="from.method" placeholder="选择请求方式" size="large">
              <el-option v-for="item in ['GET','POST','PUT','DELETE']" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="order">
            <el-input-number v-model="from.order" :min="0" :max="Infinity" />
          </el-form-item>
        </el-form>

      </template>

      <template #btn>
        <el-button type="primary" @click="onsubmit">提交</el-button>
      </template>

    </form-drawer>
  </el-card>

</template>

<script setup>
import { ref } from "vue"

import NewFlushed from '~/components/common/NewFlushed.vue'

// 抽屉组件
import formDrawer from "~/components/common/formDrawer.vue"


// 图标组件
import IconSelect from "~/components/common/IconSelect.vue"

// 请求
import {
  GetRuleList,
  NewRuleList,
  UpdateRuleList,
  DeleteRuleList,
  reviseRule
} from "~/api/rule"


// 分页和搜索封装的函数 // 表单新增修改功能  // 修改状态和删除和刷新
import { useInitTable, useInitForm } from '~/composables/hook/useCommon'



// 默认展开
const defaultExpandedKeys = ref([])

// 表单可选项数据源
const options = ref([])


// 分页和搜索封装的函数
const {
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
  GetData: GetRuleList,
  // 获取的数据
  onGetListSuccess(res) {
    options.value = res.rules
    tableData.value = res.list;
    defaultExpandedKeys.value = res.list.map(o => o.id)
  },

  remove: DeleteRuleList,
  modify: reviseRule,
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
    rule_id: 0,
    menu: 0,
    name: "",
    condition: "",
    method: "GET",
    status: 1,
    order: 0,
    icon: "",
    frontpath: "",
  },
  update: UpdateRuleList,
  create: NewRuleList,

  rules: {},

  getData,
})

const addChild = (id) => {
  NewNotice()
  from.rule_id = id
  from.status = 1
}

</script>

<style >
.custom-tree-node {
  flex: 1;
  display: flex;

  align-items: center;
  font-size: 14px;
  padding-right: 8px;
  @apply justify-between
}


.el-tree-node__content {
  padding: 20px 0;
}

.el-tree-node__label {
  width: 100%;
}
</style>