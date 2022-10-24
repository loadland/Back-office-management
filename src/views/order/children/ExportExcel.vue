<template>
  <el-drawer title="下载数据" v-model="dialogVisible" size="40%">
    <el-form :model="form" label-width="80px">
      <el-form-item label="订单类型">
        <el-select v-model="form.tab" placeholder="请选择订单类型">
          <el-option v-for="item in tabbars" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="时间范围" style="width:80%;">
        <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="onDownload">下载</el-button>

      </el-form-item>
    </el-form>

  </el-drawer>

</template>

<script setup>
import { ref, reactive } from 'vue'
import { toast } from '~/composables/util'


import { exportOrder } from '~/api/order'

defineProps({
  tabbars: Array,
})

const dialogVisible = ref(false)

const open = () => {
  dialogVisible.value = true
}
const close = () => {
  dialogVisible.value = false
}

const form = reactive({
  tab: null,
  time: ''
})

const loading = ref(false)
const onDownload = () => {
  if (!form.tab) return toast('订单类型不能为空', '警告', 'warning')
  loading.value = true
  let starttime = ''
  let endtime = ''
  if (form.time && Array.isArray(form.time)) {
    starttime = form.time[0]
    endtime = form.time[1]
  }
  exportOrder({
    tab: form.tab,
    starttime,
    endtime,
  })
    .then((data) => {
      // 获取到url 通过这个URL,可以获取到所指定文件的完整内容
      let url = window.URL.createObjectURL(new Blob([data]))
      // 创建a标签
      let link = document.createElement("a")
      // 让a标签不显示
      link.style.display = 'none'
      // 给标签的跳转地址是获取到的url
      link.href = url
      // 定义文件名
      let filename = `orders--${form.tab}--Information.xlsx`
      // 将文件名当作属性给到a标签中
      link.setAttribute('download', filename)
      // 将a标签添加到body中
      document.body.appendChild(link)
      // 自动触发a标签的点击事件 下载到文件当中
      link.click()
      // 关闭抽屉
      close()
    })
    .finally(() => loading.value = false)
}

defineExpose({
  open,
})
</script>

<style scoped>

</style>