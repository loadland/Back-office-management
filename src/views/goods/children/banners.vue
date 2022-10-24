<template>
  <el-drawer v-model="dialogVisible" title="设置轮播图" size="50%" destroy-on-close>
    <el-form :model="from" ref="form">
      <el-form-item label="选择轮播图">
        <choose-image v-model="from.banners" :limit="9" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit">提交</el-button>
        <el-button type="primary" size="small" @click="close()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from 'vue'


// 上传轮播图组件
import ChooseImage from '~/components/manager/ChooseImage.vue'

// 轮播图请求
import {
  readGoods,
  setGoodsBanner
} from "~/api/goods"
import { toast } from '../../../composables/util';

// 存储轮播图
const from = reactive({
  banners: []
})

// 双向绑定抽屉
const dialogVisible = ref(null)
// 打开抽屉之后获取到的该id
const goodsId = ref(0)

// 打开抽屉
const open = (row) => {
  // 保存id
  goodsId.value = row.id
  row.bannersLoading = true
  // 发送请求，获取对应id的数据
  readGoods(goodsId.value).then(res => {
    // 保存轮播图
    from.banners = res.goodsBanner.map(o => o.url)
    // 打开抽屉
    dialogVisible.value = true
  }).finally(() => row.bannersLoading = false)

}
// 关闭抽屉
const close = () => {
  dialogVisible.value = false
}

// 提交方法
const loading = ref(false)
const submit = () => {
  loading.value = true
  setGoodsBanner(goodsId.value, from).then(res => {
    toast("设置轮播图成功")
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