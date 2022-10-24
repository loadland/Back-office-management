<template>
  <div class="p-header">
    <!-- logo + 名称-->
    <span class="logo">
      <!-- logo -->
      <el-icon class="mr-2 mt-0.5">
        <Shop />
      </el-icon>
      <span class="logoText">内涵段子商城</span>
    </span>
    <!-- 收放左侧导航栏 -->
    <el-tooltip effect="light" content="收放导航栏" placement="left">
      <el-icon class="icon-btn" @click="$store.commit('SetAsideWidth')">
        <fold v-if="$store.state.asideWidth == '250px'" />
        <Expand v-else />
      </el-icon>
    </el-tooltip>
    <!-- 刷新 -->
    <el-tooltip effect="light" content="刷新" placement="right">
      <el-icon class="icon-btn" @click="handleRefresh">
        <refresh />
      </el-icon>
    </el-tooltip>
    <div class="flex ml-auto justify-center items-center">
      <!-- 全屏 -->
      <el-tooltip effect="light" content="全屏" placement="left" v-if="!isFullscreen">
        <el-icon class="icon-btn" @click="toggle">
          <full-screen />
        </el-icon>
      </el-tooltip>
      <el-tooltip effect="light" content="关闭全屏" placement="left" v-else>
        <el-icon class="icon-btn" @click="toggle">
          <Aim />
        </el-icon>
      </el-tooltip>
      <!-- 下拉菜单 -->
      <div>
        <!-- command事件 能获取到下拉菜单拿到点击的哪个菜单 -->
        <el-dropdown class="dropdown" @command="handleCommand">
          <span class="flex items-center text-light-50">
            <el-avatar class="mx-5" :size="25" :src="$store.state.user.avatar" />
            {{$store.state.user.username}}
            <!-- 下箭头 -->
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- command 配置用户菜单  -->
              <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <!-- 抽屉 -->
  <formDrawer ref="formDrawerRef" title="真的要改吗燕子？？" text="算了不改了" destroyOnClose>
    <template #form>
      <el-form :rules="rules" :model="account" ref="formRef" label-width="100px" size="small">
        <el-form-item label="旧密码：" prop="oldpassword">
          <el-input placeholder="请输入旧密码" v-model="account.oldpassword" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input placeholder="请输入新密码" v-model="account.password" show-password />
        </el-form-item>
        <el-form-item label="确认密码：" prop="repassword">
          <el-input placeholder="确认密码 " v-model="account.repassword" show-password />
        </el-form-item>
      </el-form>
    </template>
    <template #btn>
      <el-button type="primary" round @click="onSubmit" :loading="loading">提交改过的</el-button>
    </template>
  </formDrawer>
</template>

<script setup>
// 抽屉组件
import formDrawer from '~/components/common/formDrawer.vue'
// ref，reactive 响应式 onMounted 组件挂载后 onBeforeUnmount 组件卸载后 
import { ref, onMounted, onBeforeUnmount } from 'vue'
// vuex
import { useStore } from 'vuex'
// 全屏
import { useFullscreen } from '@vueuse/core'
// form表单封装函数 退出登录
import { useRepassword, useLogout } from '~/composables/hook/useManager'


// vuex
const store = useStore()

// form表单封装函数
const { account, rules, onSubmit, formRef, loading } = useRepassword()
// 退出登录
const { logout } = useLogout()

// 全屏
const { isFullscreen, toggle } = useFullscreen()
// 刷新
const handleRefresh = () => location.reload();




// 抽屉
const formDrawerRef = ref(null)
// 判断用户点击的下拉菜单是哪个
const handleCommand = (e) => {
  switch (e) {
    case "logout":
      logout()
      break;
    case "rePassword":
      formDrawerRef.value.open()
      break;
  }
}



// 回车确定
onMounted(() => {
  document.addEventListener("keyup", EnterClick)
})
onBeforeUnmount(() => {
  document.removeEventListener("keyup", EnterClick)
})
const EnterClick = (e) => {
  if (e.key == "Enter") {
    onSubmit()
  }
}

</script>

<style scoped>
.p-header {
  @apply flex items-center bg-indigo-500 text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
  z-index: 9;
}

.logo {
  width: 250px;
  @apply flex justify-center items-center text-xl font-thin;
}

.logoText {
  @apply text-lg font-extrabold text-gray-500/50 text-shadow-lg
}

.icon-btn {
  @apply flex justify-center items-center;
  width: 42px;
  height: 64px;
  cursor: pointer;
  transition: all .5s;
}

.icon-btn:hover {
  @apply bg-indigo-600;
}

.dropdown {
  @apply mr-10
}
</style>