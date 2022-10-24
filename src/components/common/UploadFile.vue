<template>
  <el-upload drag :action="uploadImageAction" multiple :headers="{ token }" name="img" :data="data"
    :on-success="onSuccess" :on-error="onError">
    <el-icon class="el-icon--upload">
      <upload-filled />
    </el-icon>
    <div class="el-upload__text">
      点击此处 <em>上传文件</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        *文件的格式只能是jpg/png格式的文件，并且不能超过500kb
      </div>
    </template>
  </el-upload>
</template>

<script setup>
import { uploadImageAction } from '~/api/image'
import { getToken } from '~/composables/auth'
import { toast } from '~/composables/util';
const token = getToken()

defineProps({
  data: Object,
})

const emit = defineEmits(["success"])

const onSuccess = (response, uploadFile, uploadFiles) => {
  emit('success', {
    response, uploadFile, uploadFiles
  })
}
const onError = (error, uploadFile, uploadFiles) => {
  toast("上传失败", JSON.parse(error.message).msg, "error")
}
</script>

<style  scoped>

</style>
<!-- <template>
  <el-upload :data="data" drag :action="uploadImageAction" multiple :headers="{ token }" name="img"
    :on-success="uploadSuccess" :on-error="uploadError">
    <el-icon class="el-icon--upload">
      <upload-filled />
    </el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>
<script setup>
import { uploadImageAction } from "~/api/image"
import { getToken } from "~/composables/auth"
import { toast } from "~/composables/util"
const token = getToken()

const props = defineProps({
  data: Object,
})

console.log(props.data);

const emit = defineEmits(["success"])

const uploadSuccess = (response, uploadFile, uploadFiles) => {
  console.log(response);
  emit("success", {
    response, uploadFile, uploadFiles
  })
}

const uploadError = (error, uploadFile, uploadFiles) => {
  let msg = JSON.parse(error.message).msg || "上传失败"
  toast('失败', msg, "error")
}
</script>
<style  scoped>

</style> -->