<template>
  <el-aside width="220px" class="image-aside">
    <div class="top" v-loading="loading">
      <image-aside-list v-for="(item,index) in list" :key="index" :class="{'active' :activeId == item.id}"
        @click="activeClick(item.id)" @edit="handleEdit(item)" @delete="handleDelete(item.id)">
        <template v-slot:asideText>
          {{item.name}}
        </template>
      </image-aside-list>
    </div>
    <div class="bottom">
      <el-pagination layout="prev,pager, next" :total="total" :page-size="pageSize" :current-page="currentPage"
        @current-change="addList" />
    </div>
  </el-aside>

  <form-drawer :title="drawerTitle" ref="formDrawerRef">
    <template #form>
      <el-form :model="form" ref="formRef" :rules="rules" label-width="130px" :inline="false">
        <el-form-item :label="drawerTitle + '图库名称'" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input-number v-model="form.order" :min="1" :max="Infinity" />
        </el-form-item>
      </el-form>
    </template>

    <template #btn>
      <el-button round @click="handleSubmit">提交</el-button>
    </template>
  </form-drawer>

</template>

<script setup>
import { ref, reactive, computed } from 'vue'
// 图片列表增/删/改，请求
import {
  GetImageList,
  PostImageList,
  upDateImageList,
  deleteImageList
} from '~/api/image_class'
// 左侧列表
import imageAsideList from './imageAsideList.vue'
// 抽屉组件
import formDrawer from '~/components/common/formDrawer.vue'
// 提示
import { toast } from '~/composables/util'


// 拿到列表数据
const list = ref([])
let loading = ref(false)

// 分页 
let total = ref(0)
let pageSize = ref(10)
let currentPage = ref(1)


// 发送请求获取数据 // 当页码发生改变时触发
function addList(e) {
  if (typeof e == "number") {
    currentPage.value = e
  }
  loading.value = true
  GetImageList(currentPage.value).then(res => {
    total.value = res.totalCount
    list.value = res.list
    let item = list.value[0]
    if (item) {
      // console.log(item.id);  -> 168
      activeClick(item.id)
    }
  }).finally(() => loading.value = false)
}
addList()

const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "修改" : "新增")
// 获取到抽屉组件
const formDrawerRef = ref(null)
// form表单双向绑定
let form = reactive({
  name: "",
  order: 50,
})
// form表单的规则
const rules = {
  name: [
    // required 设置为必传  message：设置提示语  trigger：在失去焦点后在进行判断
    { required: true, message: "图库名不能为空", trigger: "blur" },
  ],
};


// 获取到表单组件
const formRef = ref(null)
// 确认添加/修改
const handleSubmit = () => [
  formRef.value.validate(valid => {
    if (valid) {
      const fun = editId.value ?
        // 修改图库                            // 发送添加请求
        upDateImageList(editId.value, form) : PostImageList(form);
      fun.then(res => {
        // 添加成功提示
        toast(drawerTitle.value + "成功")
        // 刷新图库列表
        addList(editId.value ? currentPage.value : 1)
        // 关闭抽屉
        formDrawerRef.value.close()
      })
    }
  })
]

// 设置带有active的class
let activeId = ref(0)
const activeClick = (id) => {
  // console.log(id); -> 168
  activeId.value = id
  emit("change", id)
}
const emit = defineEmits(["change"])

// 新增按钮调用open方法打开抽屉
const handleCreate = () => {
  form.name = ''
  form.order = 50
  editId.value = 0
  formDrawerRef.value.open()
}

// 修改
const handleEdit = (row) => {
  editId.value = row.id
  form.name = row.name
  form.order = row.order
  formDrawerRef.value.open()
}

// 删除
const handleDelete = (row) => {
  loading.value = true
  deleteImageList(row).then(res => {
    toast("删除成功", "你还会回来吗燕子")
    addList()
  }).finally(() => loading.value = false)
}


defineExpose({
  handleCreate,
})

</script>

<style  scoped>
.image-aside {
  border-right: 1px solid #eee;
  position: relative;
  @apply mr-5;
}

.image-aside .top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-aside .bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  height: 50px;
  @apply flex justify-center items-center;
}
</style>