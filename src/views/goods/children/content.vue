<template>
  <form-drawer ref="formDrawerRef" title="更改详情" size="50%" destroy-on-close>
    <template #form>
      <el-form :model="from">
        <el-form-item>
          <Editor v-model="from.content" />
        </el-form-item>
      </el-form>
    </template>
    <template #btn>
      <el-button type="primary" size="small" @click="submit">提交</el-button>
    </template>
  </form-drawer>
</template>

<script setup>
import { ref, reactive } from 'vue'

import formDrawer from '~/components/common/formDrawer.vue'
import Editor from '~/components/context/Editor.vue'
// 请求
import {
  readGoods,
  UpdateGoods
} from "~/api/goods"
import { toast } from '~/composables/util';

// 存储富文本编辑器
const from = reactive({
  content: '',
})

// 双向绑定抽屉
const formDrawerRef = ref(null)
// 打开抽屉之后获取到的该id
const goodsId = ref(0)

// 打开抽屉
const open = (row) => {
  // 保存id
  goodsId.value = row.id
  row.contentLoading = true
  // 发送请求，获取对应id的数据
  readGoods(goodsId.value).then(res => {
    from.content = res.content
    // 打开抽屉
    formDrawerRef.value.open()
  }).finally(() => row.contentLoading = false)

}
// 关闭抽屉
const close = () => {
  formDrawerRef.value.close()
}

// 提交方法
const loading = ref(false)
const submit = () => {
  loading.value = true
  UpdateGoods(goodsId.value, from).then(res => {
    toast("详情修改成功")
    close()
    emit('reloadData')
  }).finally(() => loading.value = false)
}


const emit = defineEmits(['reloadData'])

// 向父组件暴露方法
defineExpose({
  open,
  close,
})

</script>

<style  scoped>

</style>