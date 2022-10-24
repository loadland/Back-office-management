<template>
  <div class="flex items-center justify-between mb-5">
    <div>
      <el-button v-if="btns.includes('create')" type="primary" size="small" @click="emit('NewNotice')">新增</el-button>
      <el-popconfirm v-if="btns.includes('delete')" title="是否要删除选中记录？" confirmButtonText="确认" cancelButtonText="取消"
        @confirm="$emit('delete')">
        <template #reference>
          <el-button type="danger" size="small">批量删除</el-button>
        </template>
      </el-popconfirm>
      <slot />
    </div>
    <div>
      <el-tooltip v-if="btns.includes('refresh')" class="box-item" effect="dark" content="刷新数据" placement="top">
        <el-button text @click="emit('update')">
          <el-icon>
            <Refresh />
          </el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip v-if="btns.includes('download')" class="box-item" effect="dark" content="下载数据" placement="top">
        <el-button text @click="emit('download')">
          <el-icon>
            <Download />
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const emit = defineEmits(["update", "NewNotice", "delete", "download"])
const props = defineProps({
  layout: {
    type: String,
    default: "create,refresh"
  }
})


const btns = computed(() => props.layout.split(","))
</script>

<style  scoped>

</style>