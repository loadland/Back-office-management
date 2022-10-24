<template>
  <div>
    <el-row class=" min-h-screen">
      <el-col :lg="16" :md="12" :xs="24" class="loginLeft ">
        <div class="text-light-50">
          <div class="font-bold text-5xl mb-5">毕业设计</div>
          <div>项目主要技术：html ,css ,javaScript ,es6 ,axios ,vite ,vue3 ,git ,windiCss ,element-plus</div>
        </div>
      </el-col>
      <el-col :lg="8" :md="12" :xs="24" class="loginRight ">
        <h2 class="loginTitle">商丘学院</h2>
        <div class="loginAccount">
          <span class="login-"></span>
          <span>账号密码登录</span>
          <span class="login-"></span>
        </div>
        <el-form class="w-[250px]" :rules="rules" :model="form" ref="formRef">
          <el-form-item label="账号：" prop="username">
            <el-input placeholder="account：admin" v-model="form.username" ref="input">
              <template #prefix>
                <el-icon>
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input placeholder="password：admin" v-model="form.password" show-password ref="inputPassword">
              <template #prefix>
                <el-icon>
                  <Cellphone />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-checkbox label="记住密码" v-model="loginCheckbox" />
          <el-button class="text-blue-500 w-[250px] round" @click="onSubmit" :loading="loading">登录</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'

import { setUsername, setPassword, getUsername, getPassword, removeUsername, removePassword } from '~/composables/auth.js'

import { useStore } from 'vuex'

//配置表单验证
const rules = {
  username: [
    // required 设置为必传  message：设置提示语  trigger：在失去焦点后在进行判断
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    // pattern：配置正则
    { pattern: /^[a-z0-9]{5,16}$/, message: '用户名要在5-16位之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { pattern: /^[a-z0-9]{5,10}$/, message: '密码要在5-10位之间', trigger: 'blur' }
  ],
}

const form = reactive({
  username: getUsername() ?? '',
  password: getPassword() ?? '',
})

const store = useStore()

// 记住密码
const loginCheckbox = ref(true)

const formRef = ref(null)
const loading = ref(false)
const onSubmit = () => {
  //拿到form表单使用-->validate方法判断用户是否输入以及正确输入
  formRef.value.validate((valid) => {
    if (valid) {
      // 判断是否记住密码
      if (loginCheckbox.value) {
        setUsername(form.username)
        setPassword(form.password)
      } else {
        removeUsername()
        removePassword()
      }

      loading.value = true;

      store.dispatch('SetTokenActions', form).finally(() => {
        loading.value = false
      })
    }
  })
}

const input = ref(null)
const inputPassword = ref(null)
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
  if (e.key == "ArrowUp") {
    // input 账号
    input.value.focus()
  }
  if (e.key == 'ArrowDown') {
    // inputPassword 密码
    inputPassword.value.focus()
  }
}



</script>

<style scoped>
.loginLeft {
  @apply flex justify-center items-center rounded-2xl overflow-hidden bg-indigo-500
}

.loginRight {
  @apply bg-light-50 flex justify-center items-center flex-col
}

.loginTitle {
  @apply font-bold text-3xl text-blue-500
}

.loginAccount {
  @apply flex justify-center items-center my-5 text-gray-300 space-x-3
}

.login- {
  @apply h-[1px] w-16 bg-gray-200
}
</style>