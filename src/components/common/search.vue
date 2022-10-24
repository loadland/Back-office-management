<template>
  <el-form :model="model" label-width="120px">
    <el-row :gutter="20">
      <!-- <el-col :span="8" :offset="0">
        <el-form-item label="商品名称：">
          <el-input v-model="formSearch.title" size="small"></el-input>
        </el-form-item>
      </el-col> -->
      <slot />
      <!-- <el-col :span="8" :offset="0">
        <el-form-item label="商品分类：">
          <el-select v-model="formSearch.category_id" size="small">
            <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col> -->
      <template v-if="showSearch">
        <slot name="show" />
      </template>
      <el-col :span="8" :offset="showSearch ? 0 : 8">
        <div class="flex items-center justify-end">
          <el-button plain type="primary" size="small" @click="$emit('search')">搜索</el-button>
          <el-button plain type="primary" size="small" @click="$emit('reset')">重置</el-button>
          <el-button plain size="small" @click="showSearch = !showSearch" v-if="handleSlots">
            {{showSearch ? "关闭" : "展开"}}
            <el-icon>
              <ArrowUp v-if="showSearch" />
              <ArrowDown v-else />
            </el-icon>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, useSlots } from 'vue'

const props = defineProps({
  model: Object,
})

const emit = defineEmits(["search", "reset"])

const showSearch = ref(false)

const slots = useSlots()
const handleSlots = ref(!!slots.show)
</script>

<style scoped>

</style>