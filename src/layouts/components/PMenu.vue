<template>
  <div class="p-menu" :style="{width:$store.state.asideWidth}">
    <!-- select时间可以拿到跳转的路由的路径     select 事件可以拿到下面:index中的path可以来实现路由的跳转   -->
    <!-- :default-active 动态决定默认路由  collapse 判断是否折叠-->
    <el-menu :default-active="defaultActive" class="border-0" @select="handleSelect" :collapse="isCollapse"
      :collapse-transition="false" :unique-opened="true">
      <!-- 遍历出来所有的路由 -->
      <template v-for="(item,index) of $store.state.menus" :key="index">
        <!-- 做个判断如果存在child并且他的长度大于0 就实现这个组件 -->
        <el-sub-menu :index="item.name" v-if="item.child && item.child.length > 0">
          <template #title>
            <el-icon>
              <!-- 使用component组件 动态给每个路由添加一个icon -->
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{item.name}}</span>
          </template>
          <!-- 循环item.child 出现二级导航 :index="item1.frontpath"方法获取到item的路由的url的path   -->
          <el-menu-item :index="items.frontpath" v-for="(items,indexss) of item.child" :key="indexss">
            <el-icon>
              <component :is="items.icon"></component>
            </el-icon>
            <span>{{items.name}}</span>
          </el-menu-item>
        </el-sub-menu>
        <!-- 如果不存在child就显示这个组件 -->
        <el-menu-item :index="item.frontpath" v-else>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{item.name}}</span>
        </el-menu-item>
      </template>

    </el-menu>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useStore } from 'vuex'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()
const route = useRoute()

const handleSelect = (e) => { router.replace(e) }

const isCollapse = computed(() => !(store.state.asideWidth == "250px"))
// 默认选中的路由，展示的菜单
const defaultActive = ref(route.path)

// 监听路由变化
onBeforeRouteUpdate((to, from) => {
  defaultActive.value = to.path
})
</script>

<style scoped>
.p-menu {
  top: 64px;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  transition: all .5s;
  @apply shadow fixed bg-light-50;
}

.p-menu::-webkit-scrollbar {
  display: none;
}
</style>