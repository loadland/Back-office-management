<template>
  <el-main class="image-main" v-loading="loading">
    <div class="top">
      <el-row :gutter="20">
        <el-col :span="6" :offset="0" v-for="(item,index) in list" :key="index">
          <el-card shadow="hover" class="my-2" :body-style="{'padding': '10px'}">
            <el-image :src="item.url" fit="cover" :lazy="true" style="width:100%;" class="h-[150px]"
              :preview-src-list="[item.url]" :initial-index="10" :hide-on-click-modal="true"></el-image>
            <div class="image-title">{{item.name}}</div>
            <div class="flex justify-center items-center p-2">

              <el-checkbox class="checkBox" v-model="item.checkbox" @change="handleChooseChange(item)" />

              <el-button type="primary" size="small" style="width:100%;" @click="UpdateImageName(item)">重命名</el-button>

              <el-popconfirm title="确定要删除该图片?" confirm-button-text="确定" cancel-button-text="取消"
                @confirm="deleteImage(item)">
                <template #reference>
                  <el-button type="primary" size="small" style="width:100%;">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </div>
    <div class="bottom">
      <el-pagination layout="prev,pager, next" :total="total" :page-size="pageSize" :current-page="currentPage"
        @current-change="addList" />
    </div>

    <!-- <el-drawer v-model="drawer" title="上传图片" size="35%">
      <upload-file :data="{ chang_class_id }" @success="handleUploadSuccess" />
    </el-drawer> -->

    <el-drawer v-model="drawer" title="上传图片">
      <Upload-file :data="{ image_class_id }" @success="handleUploadSuccess" />
    </el-drawer>

  </el-main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { GetImages, UpdateImages, DeleteImages } from '~/api/image'

// 重命名提示框
import { showMessageBox, toast } from '~/composables/util'
// 上传图片
import UploadFile from '../common/UploadFile.vue'


// 上传图片
const drawer = ref(false)
const openDrawer = () => drawer.value = true

// 分页 
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const loading = ref(false)
const list = ref([])
const image_class_id = ref(0)

// 发送请求获取数据 // 当页码发生改变时触发
function addList(e = null) {
  if (typeof e == "number") {
    currentPage.value = e
  }

  loading.value = true
  GetImages(image_class_id.value, currentPage.value).then(res => {

    total.value = res.totalCount

    list.value = res.list.map(o => {
      o.checkbox = false
      return o
    })

  }).finally(() => loading.value = false)
}
// 根据分类ID重新加载图片列表
const loadDate = (id) => {
  currentPage.value = 1
  image_class_id.value = id
  // console.log(chang_class_id.value); -> 168
  addList()
}

// 图片重命名
const UpdateImageName = (item) => {
  // 显示loading
  loading.value = true
  // 确认提示框
  showMessageBox("重命名", item.name).then((res) => {
    // 发送请求获取数据
    UpdateImages(item.id, res.value).then((res) => {
      // 提示修改成功
      toast("修改成功")
      // 重新刷新页面
      addList()
    }).finally(() => loading.value = false)
  })
}


// 删除图片
const deleteImage = (item) => {
  loading.value = true
  DeleteImages([item.id]).then(res => {
    // 提示删除成功
    toast("删除成功")
    // 重新刷新页面
    addList()
  }).finally(() => loading.value = false)
}



// 上传成功
const handleUploadSuccess = () => addList(1)


defineExpose({
  loadDate,
  openDrawer
})

const props = defineProps({
  limit: {
    type: Number,
    default: 1,
  }
})

// 选中头像
const emit = defineEmits(["choose"])
const checkImage = computed(() => list.value.filter(o => o.checkbox))
const handleChooseChange = (item) => {
  if (item.checkbox && checkImage.value.length > props.limit) {
    item.checkbox = false
    toast(`多选错误", "头像只能选中${props.limit}个", "error`)
  }
  emit("choose", checkImage.value)
}


</script>

<style scoped>
.image-main {
  position: relative;
}

.image-main .top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-main .bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  height: 50px;
  @apply flex justify-center items-center;
}

.image-title {
  font-size: 700;
  margin: 10px 0;
}

.checkBox {
  margin-right: .8667rem;
}
</style>