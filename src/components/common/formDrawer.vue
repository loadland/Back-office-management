<template>
  <el-drawer v-model="showDrawer" :title="title" :size="size" :close-on-click-modal="closeOnClickModal" :z-index="100"
    :destroy-on-close="destroyOnClose">
    <div class="formDrawer">
      <div class="body">
        <slot name="form"></slot>
      </div>
      <div class="actions">
        <slot name="btn"></slot>
        <el-button round @click="close">{{ text }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
const showDrawer = ref(false)

const open = () => showDrawer.value = true
const close = () => showDrawer.value = false

defineExpose({
  open,
  close,
})

const props = defineProps({
  title: {
    String,
    default: "您打开了抽屉"
  },
  size: {
    String,
    default: "45%"
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  closeOnClickModal: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: "取消",
  }
})



</script>

<style scoped>
.formDrawer {
  width: 100%;
  height: 100%;
  position: relative;
  @apply flex flex-col
}

.body {
  flex: 1;
  overflow-y: auto;
}


.actions {
  height: 50px;
  @apply mt-auto flex items-center
}
</style>