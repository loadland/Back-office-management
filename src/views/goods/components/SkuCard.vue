<template>
  <el-form-item label="添加规格：" style="width:100%;" v-loading="bodyLoading">
    <el-card shadow="hover" class="w-full mb-3" v-for="(item,index) in sku_card_list" :key="index"
      v-loading="item.loading">
      <template #header>
        <div class="flex items-center">
          <el-input style="width:25%;" v-model="item.text" @change="handleUpdate(item)">
            <template #append>
              <el-icon class="cursor-pointer" @click="handleChooseSku(item)">
                <MoreFilled />
              </el-icon>
            </template>
          </el-input>
          <div class="ml-auto">
            <el-button type="info" @click="sortCard('up', index)" :disabled="index == 0">
              <el-icon>
                <Top />
              </el-icon>
            </el-button>
            <el-button type="info" @click="sortCard('down', index)" :disabled="index == (sku_card_list.length - 1)">
              <el-icon>
                <Bottom />
              </el-icon>
            </el-button>
            <el-button type="info" @click="handleDelete(item)">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </div>
        </div>
      </template>

      <SkuCardItem :skuCardId="item.id"></SkuCardItem>
    </el-card>
    <el-button type="success" size="small" @click="createSkus">添加规格</el-button>
    

    <!-- 跳出窗 -->
    <ChooseSkus ref="ChooseSkusRef"></ChooseSkus>
  </el-form-item>
</template>

<script setup>
import { ref } from "vue"

import SkuCardItem from "./SkuCartItem.vue"
import ChooseSkus from "./ChooseSkus.vue"


import {
  sku_card_list,
  addSkuCardEvent,
  handleUpdate,
  handleDelete,
  sortCard,
  bodyLoading,
  initSkusCardItem,
  handleChooseSetGoodsSkusCard,
} from "~/composables/hook/useSkus"

const createSkus = () => {
  addSkuCardEvent()
}
const ChooseSkusRef = ref(null)
const handleChooseSku = (item) => {
  ChooseSkusRef.value.open((res) => {
    handleChooseSetGoodsSkusCard(item.id, {
      name: res.name,
      value: res.list
    })
  })
}

</script>

<style scoped>
.el-card__header {
  padding: 2px !important;
}
</style>