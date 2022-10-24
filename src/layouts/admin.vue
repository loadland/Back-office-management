<template>
  <el-container>
    <el-header>
      <p-header></p-header>
    </el-header>
    <el-container>
      <el-aside :style="{width:$store.state.asideWidth}">
        <p-menu></p-menu>
      </el-aside>
      <el-main>
        <p-tag-list></p-tag-list>
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <keep-alive :max="10">
              <component :is="Component"></component>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import PHeader from './components/PHeader.vue'
import PMenu from './components/PMenu.vue'
import PTagList from './components/PTagList.vue'
</script>

<style scoped>
.el-aside {
  transition: all .5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: all .3s ease;
}

.fade-enter-active {
  transition-delay: .3s;
}
</style>