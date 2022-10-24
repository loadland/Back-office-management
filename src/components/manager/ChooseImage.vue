<template>
  <div class="flex">
    <div v-if="modelValue && preview" class="flex flex-wrap">
      <el-image v-if="typeof modelValue == 'string' " :src="modelValue" fit="fill"
        class="w-[120px] h-[100px] rounded border mr-2"></el-image>
      <div class="relative mx-1 mb-2 w-[120px] h-[100px]" v-else v-for="(item,index) in modelValue" :key="index">
        <el-icon class="absolute right-[5px] top-[5px] cursor-pointer bg-white rounded-full" style="z-index: 10;"
          @click="removeImage(item)">
          <CircleClose />
        </el-icon>
        <el-image :src="item" fit="fill" class="w-[120px] h-[100px] rounded border mr-2"></el-image>
      </div>
    </div>


    <div v-if="preview" class="choose-image-btn" @click="OpenIt">
      <el-icon :size="25" class="text-gray-500">
        <Plus />
      </el-icon>
    </div>

    <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">

      <el-container class="bg-white rounded" style="height:70vh;">
        <el-header class="images-header">
          <el-button type="primary" size="small" @click="openDrawer">新增图库</el-button>
          <el-button type="primary" size="small" @click="handleOpenDrawer">上传图片</el-button>
        </el-header>
        <el-container>
          <!-- 左侧导航栏 -->
          <image-aside ref="imageAsideRef" @change="handleChange" />
          <!-- 主题部分 -->
          <image-main ref="imageMainRef" @choose="handleChoose" :limit='limit' />
        </el-container>
      </el-container>

      <template #footer>
        <span>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </span>
      </template>

    </el-dialog>


  </div>
</template>

<script setup>
import { ref } from 'vue'



// 左侧导航栏
import imageAside from '~/components/images/imageAside.vue'
// 主题部分
import imageMain from '~/components/images/imageMain.vue'

import { toast } from '~/composables/util'



// 计算出当前页面的宽度
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




// 打开或者关闭修改头像弹窗
const dialogVisible = ref(false)

// 点击头像打开弹框
const OpenIt = () => {
  open()
}
const callbackFunction = ref(null)
const open = (callback) => {
  callbackFunction.value = callback
  dialogVisible.value = true
}

// 关闭
const close = () => { dialogVisible.value = false }



// 选中头像
let urls = []
const handleChoose = (item) => {
  urls = item.map(o => o.url)
}


// 让头像显示
const props = defineProps({
  modelValue: [String, Array],
  limit: [Number],
  preview: {
    type: Boolean,
    default: true,
  }
})

const emit = defineEmits(["update:modelValue"])

// 弹框里的确认按钮
const onSubmit = () => {
  let value = []
  if (urls.length == 1) {
    value = urls[0]
  } else {
    value = props.preview ? [...props.modelValue, ...urls] : [...urls]
    if (value.length > props.limit) {
      let limit = props.preview ? (props.limit - props.modelValue.length) : props.limit
      return toast("最多还能选择" + limit + "张")
    }
  }
  if (value && props.preview) {
    emit("update:modelValue", value)
  }
  if (!props.preview && typeof callbackFunction.value === "function") {
    callbackFunction.value(value)
  }
  close()
}

// 图片的关闭
const removeImage = (item) => {
  emit("update:modelValue", props.modelValue.filter(o => o != item))
}

defineExpose({
  open,
})

</script>


<style scoped>
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}

.choose-image-btn {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover: (bg-gray-100);
}
</style>