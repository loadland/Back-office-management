<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="160px">
      <el-form-item label="物流查询key">
        <div>
          <el-input v-model="form.ship" placeholder="物流查询key"></el-input>
          <small class="text-gray-500 flex mt-1">
            用于查询物流信息，接口申请（仅供参考）
          </small>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>

  </div>

</template>

<script setup>
import { ref, reactive } from 'vue'
import { setSysConfig, getSysConfig } from "~/api/setting"



const form = reactive({
  "ship": ""
})

const loading = ref(false)
function getDate() {
  loading.value = true
  getSysConfig().then(res => {
    for (const key in form) {
      form[key] = res[key]
    }
  }).finally(() => loading.value = false)
}
getDate()

// 保存按钮
const onSubmit = () => {
  loading.value = true
  setSysConfig({
    ...form,
  })
    .then((res) => {
      toast('保存成功')
      getDate()
    })
    .finally(() => loading.value = false)

}

</script>

<style  scoped>

</style>