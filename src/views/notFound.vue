<template>
  <div>
    <el-result icon="info" title="网址不存在">
      <template #sub-title>
        <p>不要乱输入网址你他妈的!!</p>
      </template>
      <template #extra>
        <el-button type="primary" @click="$router.replace('/index')">滚回去!!</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>