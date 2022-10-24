<template>
  <el-container class="bg-white rounded" :style="{height : h + 'px'}">
    <el-header class="images-header">
      <el-button type="primary" size="small" @click="openDrawer">新增图库</el-button>
      <el-button type="primary" size="small" @click="handleOpenDrawer">上传图片</el-button>
    </el-header>
    <el-container>
      <!-- 左侧导航栏 -->
      <image-aside ref="imageAsideRef" @change="handleChange" />
      <!-- 主题部分 -->
      <image-main ref="imageMainRef" />
    </el-container>
  </el-container>

</template>

<script setup>
import { ref } from 'vue'
// 左侧导航栏
import imageAside from '~/components/images/imageAside.vue'
// 主题部分
import imageMain from '~/components/images/imageMain.vue'

// 计算出当前页面的宽度
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40;

const imageAsideRef = ref(null)
const openDrawer = () => imageAsideRef.value.handleCreate()

const imageMainRef = ref(null)
const handleChange = (image_class_id) => {
  // console.log(image_class_id); -> 168
  imageMainRef.value.loadDate(image_class_id)
}

const handleOpenDrawer = () => {
  imageMainRef.value.openDrawer()
}
</script>

<style  scoped>
.images-header {
  @apply flex items-center mb-5;
  border-bottom: 1px solid #eeeeee;
}
</style>