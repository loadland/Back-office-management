<template>
  <div class="flex items-center">

    <el-icon :size="20" v-if="modelValue" class="mr-2">
      <component :is="modelValue"></component>
    </el-icon>


    <el-select filterable :modelValue="modelValue" placeholder="请选择图标" @change="handleChange">
      <el-option v-for="item in icons" :key="item" :label="item" :value="item">
        <div class="flex items-center">
          <el-icon>
            <component :is="item"></component>
          </el-icon>
          <span class="ml-1 text-gray-500">{{item}}</span>
        </div>
      </el-option>

    </el-select>
  </div>
</template>

<script setup>
import { ref } from "vue";
// 字体图标
import * as icon from "@element-plus/icons-vue";

defineProps({
  modelValue: String
})

const icons = ref(Object.keys(icon))

const emit = defineEmits(["update:modelValue"])
const handleChange = (icon) => {
  emit("update:modelValue", icon)
}
</script>

<style  scoped>

</style>