<template>
  <formDrawer title="推荐商品" ref="formDrawerRef" size="70%">
    <template #form>

      <el-table :data="tableData" border stripe style="width:100%;">
        <el-table-column label="ID" prop="goods_id" width="60" />

        <el-table-column label="商品封面">
          <template #default="{ row }">
            <el-image :src="row.cover" fit="fill" :lazy="true" style="width: 50%;height: 50%;" />
          </template>
        </el-table-column>

        <el-table-column prop="name" label="商品名称" width="180" />

        <el-table-column label="商品封面" width="180">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="handleDelete(row)" v-loading="row.loading">删除</el-button>

          </template>
        </el-table-column>
      </el-table>

    </template>

    <template #btn>
      <el-button type="primary" @click="onsubmit">关联</el-button>
    </template>

  </formDrawer>

  <ChooseGoods ref="ChooseGoodsRef" />
</template>

<script setup>
import { ref } from 'vue'
// 抽屉组件
import formDrawer from "~/components/common/formDrawer.vue"
// 商品关联
import ChooseGoods from "~/components/common/chooseGoods.vue"

// 请求
import { getCategoryGoods, deleteCategoryGoods, CategoryGoods } from '~/api/category'

import { toast } from '~/composables/util'

const formDrawerRef = ref(null)
const category_id = ref(0)
const tableData = ref([])
// 打开表单事件
const open = (data) => {
  category_id.value = data.id
  getData().then(() => formDrawerRef.value.open())
}
// 关闭表单事件
const close = () => {
  formDrawerRef.value.close()
}
// 请求数据
function getData() {
  return getCategoryGoods(category_id.value).then(res => {
    tableData.value = res.map(o => {
      o.loading = false;
      return o
    })
  })
}
// 表单删除
const handleDelete = (row) => {
  row.loading = true
  deleteCategoryGoods(row.id).then(res => {
    toast('删除成功')
    getData()
  }).finally(() => row.loading = false)
}

const ChooseGoodsRef = ref(null)
// 表单关联
const onsubmit = () => {
  ChooseGoodsRef.value.open((goods_ids) => {
    CategoryGoods({
      category_id: category_id.value,
      goods_ids,
    }).then(res => {
      toast("关联成功")
      getData()
      ChooseGoodsRef.value.close()
    })
  })
}
defineExpose({
  open,
})

</script>

<style  scoped>

</style>