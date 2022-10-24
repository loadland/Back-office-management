<template>
  <form-drawer ref="formDrawerRef" title="更改详情" size="70%" destroy-on-close>
    <template #form>
      <el-form :model="from">
        <el-form-item label="规格类型">
          <el-radio-group v-model="from.sku_type">
            <el-radio :label="0">单规格</el-radio>
            <el-radio :label="1">多规格</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="from.sku_type == 0">
          <el-form-item label="市场价格">
            <el-input v-model="from.sku_value.oprice" style="width:20%;">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销售价格">
            <el-input v-model="from.sku_value.pprice" style="width:20%;">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="成本价格">
            <el-input v-model="from.sku_value.cprice" style="width:20%;">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="from.sku_value.weight" style="width:20%;">
              <template #append>公斤</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品体积">
            <el-input v-model="from.sku_value.volume" style="width:20%;">
              <template #append>立方米</template>
            </el-input>
          </el-form-item>
        </template>
        <template v-else>
          <SkuCard></SkuCard>
          <SkuTable></SkuTable>
        </template>
      </el-form>
    </template>
    <template #btn>
      <el-button type="primary" size="small" @click="submit">提交</el-button>
    </template>
  </form-drawer>
</template>

<script setup>
import { ref, reactive } from 'vue'

import formDrawer from '~/components/common/formDrawer.vue'

import SkuCard from "../components/SkuCard.vue"
import SkuTable from "../components/SkuTable.vue"

// 请求
import {
  readGoods,
  updateGoodsSkus
} from "~/api/goods"

import {
  // 打开抽屉之后获取到的该id
  goodsId,
  initSkuCardList,
  sku_list,
} from "~/composables/hook/useSkus"

import { toast } from '~/composables/util';

// 存储规格
const from = reactive({
  sku_type: 0,
  sku_value: {
    "oprice": 0,
    "pprice": 0,
    "cprice": 0,
    "weight": 0,
    "volume": 0
  }
})

// 双向绑定抽屉
const formDrawerRef = ref(null)

// 打开抽屉
const open = (row) => {
  // 保存id
  goodsId.value = row.id
  row.SkusLoading = true
  // 发送请求，获取对应id的数据
  readGoods(goodsId.value).then(res => {
    from.sku_type = res.sku_type
    from.sku_value = res.sku_value || {
      "oprice": 0,
      "pprice": 0,
      "cprice": 0,
      "weight": 0,
      "volume": 0,
    }
    initSkuCardList(res)
    // 打开抽屉
    formDrawerRef.value.open()
  }).finally(() => row.SkusLoading = false)

}
// 关闭抽屉
const close = () => {
  formDrawerRef.value.close()
}

// 提交方法
const loading = ref(false)
const submit = () => {
  let data = {
    sku_type: from.sku_type,
    sku_value: from.sku_value,
    goodsSkus: null
  }

  if (from.sku_type == 1) {
    console.log(sku_list.value);
    data.goodsSkus = sku_list.value
  }

  loading.value = true
  updateGoodsSkus(goodsId.value, data).then(res => {
    toast("详情修改成功")
    close()
    emit('reloadData')
  }).finally(() => loading.value = false)
}


const emit = defineEmits(['reloadData'])

// 向父组件暴露方法
defineExpose({
  open,
  close,
})

</script>

<style  scoped>

</style>