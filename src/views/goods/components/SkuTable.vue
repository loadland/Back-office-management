<template>
  <el-form-item label="规格映射">
    <table class="border" style="width:100%">
      <thead>
        <tr>
          <th class="border" v-for="(item,index) in tableThs" :key="index" :width="item.width" :rowspan="item.rowspan"
            :colspan="item.colspan">{{ item.name }}</th>
        </tr>
        <tr>
          <th class="border" v-for="(item1,index1) in skuLabels" :key="index1">{{ item1.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in sku_list" :key="index">
          <td width="100" class="border text-center" v-for="(sku,skuI) in item.skus" :key="skuI">
            {{ sku.value }}
          </td>
          <td class="border">
            <el-input v-model="item.pprice" size="small" type="number"></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.oprice" size="small" type="number"></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.cprice" size="small" type="number"></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.stock" size="small" type="number"></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.volume" size="small" type="number"></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.weight" size="small" type="number"></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.code" size="small"></el-input>
          </td>
        </tr>
      </tbody>
    </table>
  </el-form-item>
</template>

<script setup>
import { initSkuTable, } from '~/composables/hook/useSkus'

const {
  tableThs,
  skuLabels,
  sku_list,
} = initSkuTable()
// 表单头
// console.log(tableThs.value)
// // 表单的对应id的列的值
// console.log(skuLabels.value)
// // 表单的值
// console.log(sku_list.value)
</script>

<style  scoped>

</style>