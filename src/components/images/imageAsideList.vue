<template>
  <div class="aside-list" :class="{'active' : active}">
    <div class="truncate">
      <slot name="asideText" />
    </div>
    <el-button :icon="Edit" class="border-0 ml-auto" @click.stop="$emit('edit')" />
    <el-popconfirm title="确定要删除该分类?" confirm-button-text="确定" cancel-button-text="取消" @confirm="$emit('delete')">
      <template #reference>
        <el-button :icon="Delete" class="border-0" />
      </template>
    </el-popconfirm>
  </div>
</template>

<script setup>
// 按钮的字体图标
import { Delete, Edit, } from '@element-plus/icons-vue'

defineProps({
  active: {
    type: Boolean,
    default: false,
  }
})

defineEmits(["edit", "delete"])



</script>

<style scoped>
.aside-list {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center p-3 text-sm text-gray-600 cursor-pointer;
}

.aside-list:hover,
.active {
  @apply bg-blue-50;
}
</style>