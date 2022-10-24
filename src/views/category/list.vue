<template>
  <el-card shadow="never" class="border-0">
    <new-flushed @NewNotice="NewNotice" @update="update" />

    <el-tree :data="tableData" :props="{ label:'name', children:'child' }" v-loading="loading" node-key="id">
      <template #default="{  data }">
        <div class="custom-tree-node">
          <span>{{ data.name }}</span>

          <div>
            <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0" class="mr-10"
              @change="handleStatusChange($event,data)" />

            <el-button text type="primary" size="small" @click="goodsDrawerShop(data)">推荐商品</el-button>

            <el-button type="primary" size="small" @click.stop="handleUpdate(data)">修改</el-button>
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


    <formDrawer :title="noticeTitle + '权限'" ref="formDrawerRef">
      <template #form>
        <el-form :model="from" ref="formRef" :rules="rules" label-width="120px" :inline="false">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="from.name" placeholder="分类名称"></el-input>
          </el-form-item>
        </el-form>

      </template>

      <template #btn>
        <el-button type="primary" @click="onsubmit">提交</el-button>
      </template>

    </formDrawer>

    <goodsDrawer ref="goodsDrawerRef" />
  </el-card>

</template>

<script setup>
import { ref } from "vue"

import NewFlushed from '~/components/common/NewFlushed.vue'

// 抽屉组件
import formDrawer from "~/components/common/formDrawer.vue"
// 推荐商品组件
import goodsDrawer from "./children/goodsDrawer.vue"


// 图标组件
import IconSelect from "~/components/common/IconSelect.vue"

// 请求
import {
  getCategoryList,
  updateCategoryList,
  createCategoryList,
  deleteCategoryList,
  reviseCategory
} from "~/api/category"


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
  GetData: getCategoryList,
  // 获取的数据
  onGetListSuccess(res) {
    tableData.value = res;
  },

  remove: deleteCategoryList,
  modify: reviseCategory,
})


// 表单新增修改功能
const {
  noticeId,
  noticeTitle,
  formDrawerRef,
  formRef,
  rules,
  from,
  onsubmit,
  NewNotice,
  handleUpdate,
  resetForm,
} = useInitForm({
  from: {
    name: "",
  },
  update: updateCategoryList,
  create: createCategoryList,

  rules: {},

  getData,
})


const goodsDrawerRef = ref(null)

const goodsDrawerShop = (data) => {
  goodsDrawerRef.value.open(data)
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