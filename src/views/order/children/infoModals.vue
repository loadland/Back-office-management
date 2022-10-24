<template>
  <el-drawer title="订单详情" v-model="dialogVisible" size="50%">
    <el-card shadow="never">
      <template #header>
        <b class="text-sm">订单详情</b>
      </template>
      <el-form label-width="100px">
        <el-form-item label="订单号：">
          {{ info.no }}
        </el-form-item>
        <el-form-item label="付款方式：">
          {{info.payment_method && info.payment_method == "alipay" ? "支付宝" : "微信" }}
        </el-form-item>
        <el-form-item label="付款时间：">
          {{ info.paid_time }}
        </el-form-item>
        <el-form-item label="创建时间：">
          {{ info.create_time }}
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="info.ship_data" shadow="never" class="mb-3">
      <template #header>
        <b class="text-sm">发货信息</b>
      </template>
      <el-form label-width="100px">
        <el-form-item label="物流公司：">
          {{ info.ship_data.express_company }}
        </el-form-item>
        <el-form-item label="运单号：">
          {{ info.ship_data.express_no }}
          <el-button type="primary" size="small" text class="ml-5" @click="onShipInfoModal" :loading="loadings">查看物流
          </el-button>

        </el-form-item>
        <el-form-item label="发货时间：">
          {{ set_time }}
        </el-form-item>
      </el-form>
    </el-card>


    <el-card shadow="never">
      <template #header>
        <b class="text-sm">商品信息</b>
      </template>
      <div class="flex mb-2" v-for="(item,index) in info.order_items" :key="index">
        <el-image :src="item.goods_item?.cover ?? ''" fit="fill" :lazy="true" style="width:60px;height:60px;"
          class="rounded" />
        <div class="ml-2 text-sm">
          <p>{{ item.goods_item?.title ?? '商品已被删除' }}</p>

          <p class="mt-2">
            <el-tag type="info" size="small">
              {{ item.skus }}
            </el-tag>
          </p>
          <p class="mt-2">
            <b class="text-rose-500 mr-2">￥{{ item.price }}</b>
            <span class="text-xs text-gray-500">x{{ item.num }}</span>
          </p>
        </div>
      </div>
      <div>
        成交价: <b class="ml-5 text-rose-500 mr-2"> {{ info.total_price }} </b>
      </div>
    </el-card>

    <el-card shadow="never" v-if="info.address">
      <template #header>
        <b class="text-sm">收货人信息</b>
      </template>
      <el-form label-width="100px">
        <el-form-item label="收货人：">
          {{ info.address.name }}
        </el-form-item>
        <el-form-item label="联系方式：">
          {{ info.address.phone }}
        </el-form-item>
        <el-form-item label="收货地址：">
          {{ info.address.province + info.address.city + info.address.district + info.address.address }}
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" v-if=" info.refund_status !='pending'">
      <template #header>
        <b class="text-sm">退款信息</b>
        <el-button text disabled style="float: right;">{{ info.extra.refund_status }}</el-button>
      </template>
      <el-form label-width="100px">
        <el-form-item label="退款理由：">
          {{ info.extra.refund_reason }}
        </el-form-item>
      </el-form>
    </el-card>

  </el-drawer>

  <shipInfoModal ref="shipInfoModalRef"></shipInfoModal>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useDateFormat } from '@vueuse/core'
// 物流模块
import shipInfoModal from './shipInfoModal.vue'


// 收
const props = defineProps({
  info: Object,
})


const dialogVisible = ref(false)

const open = () => {
  dialogVisible.value = true
}
const close = () => {
  dialogVisible.value = false
}

// 发货时间
const set_time = computed(() => {
  if (props.info.ship_data) {
    let s = useDateFormat(props.info.ship_data.express_time * 1000, 'YYYY-MM-DD')
    return s.value
  }
  return ''
})

// 退款信息
const refund_status = computed(() => {
  const opt = {
    pending: "未退款",
    applied: "已申请，等待审核",
    processing: "退款中",
    success: "退款成功",
    failed: "退款失败"
  }
  return props.info.refund_status ? opt[props.info.refund_status] : ""
})



const shipInfoModalRef = ref(null)
const loadings = ref(false)
const onShipInfoModal = () => {
  loadings.value = true
  shipInfoModalRef.value.open(props.info.id).finally(() => loadings.value = false)
}

// 发
// 放
defineExpose({
  open,
})

</script>

<style scoped>

</style>