<template>
  <div class="p-tag-list" :style="{left:$store.state.asideWidth}">
    <el-tabs v-model="activeTab" type="card" class="flex-1" @tab-remove="removeTab" style="min-width:100vh"
      @tab-change="changeTab">
      <el-tab-pane v-for="item in tabList" :key="item.path" :label="item.title" :name="item.path"
        :closable="item.path != '/index'">
      </el-tab-pane>
    </el-tabs>

    <span class="tag-btn">
      <el-dropdown @command="TabListCommend">
        <span class="el-dropdown-link">
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
            <el-dropdown-item command="clearAll">关闭全部</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
  <!-- 把main的内容顶下去 -->
  <div style="height:44px"></div>
</template>
<script setup>
import { useTabList } from '~/composables/hook/useTabList'
const {
  activeTab,
  tabList,
  removeTab,
  changeTab,
  TabListCommend,
  initTabList, } = useTabList()
</script>
<style  scoped>
.p-tag-list {
  height: 44px;
  @apply fixed flex items-center bg-gray-100 px-2;
  top: 64px;
  right: 0;
  z-index: 9;
  transition: all.5s;
}

.tag-btn {
  @apply bg-light-100 rounded ml-auto flex justify-center items-center px-3;
  height: 32px;
}

:deep(.el-tabs__header) {
  @apply mb-0;
  border: 0 !important;
}

:deep(.el-tabs__nav) {
  border: 0 !important;
}

:deep(.el-tabs__item) {
  border: 0 !important;
  height: 32px;
  line-height: 32px;
  @apply bg-light-100 mx-1 rounded;
}

:deep(el-tabs__nav-next),
:deep(el-tabs__nav-prev) {
  height: 32px;
  line-height: 32px;
}

:deep(.is-disabled) {
  cursor: not-allowed;
  @apply text-gray-300
}
</style>