<template>
  <div class="index">
    <el-row :gutter="20" v-permission="['getStatistics1,GET']">
      <template v-if="panels.length <= 0">
        <el-col :span="6" :offset="0" v-for="i in 4" :key="i">
          <el-skeleton animated loading>
            <template #template>
              <el-card shadow="hover" class="border-0">
                <template #header>
                  <div class="flex justify-between">
                    <el-skeleton-item variant="text" style="width: 50%" />
                    <el-skeleton-item variant="text" style="width: 10%" />
                  </div>
                </template>
                <el-skeleton-item variant="h3" style="width: 80%" />
                <el-divider />
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 40%" />
                  <el-skeleton-item variant="text" style="width: 20%" />
                </div>
              </el-card>

            </template>
          </el-skeleton>
        </el-col>
      </template>

      <el-col :span="6" :offset="0" v-for="(item,index) in panels" :key="index">
        <el-card shadow="hover" class="border-0">
          <template #header>
            <div class="flex justify-between">
              <span>
                {{ item.title }}
              </span>
              <el-tag :type="item.unitColor" effect="plain">{{ item.unit }}</el-tag>
            </div>
          </template>
          <span class="text-3xl font-bold text-gray-500">
            <count-to :value="item.value"></count-to>
          </span>
          <el-divider />
          <div class="flex justify-between text-sm text-gray-500">
            <span>{{ item.subTitle }}</span>
            <span>{{ item.subValue }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 标签导航 -->
    <index-nav></index-nav>

    <el-row :gutter="20" class="mt-5">
      <el-col :span="12" :offset="0">
        <index-chart v-permission="['getStatistics3,GET']" />
      </el-col>
      <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
        <index-card :btns="goods" class="mb-5" />
        <index-card :btns="order" title="小米商城" tip="详情" />
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
// 让数字变成动画展示
import CountTo from '~/components/common/CountTo.vue'
// 首页导航栏
import indexNav from '~/components/index/indexNav.vue'
// 首页数据可视化
import indexChart from '~/components/index/indexChart.vue'
// 首页商铺信息
import indexCard from '~/components/index/indexCard.vue'

import { GetStatistics, GetStatistics2 } from '~/api/index'

import { ref } from 'vue'


const panels = ref([])

GetStatistics().then((res) => {
  panels.value = res.panels
})


const goods = ref([])
const order = ref([])
GetStatistics2().then(res => {
  goods.value = res.goods;
  order.value = res.order
})


</script>

<style scoped>

</style>