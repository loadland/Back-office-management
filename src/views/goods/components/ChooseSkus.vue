<template>
  <div>
    <el-dialog v-model="dialogVisible" title="商品规格" width="80%" top="5vh">

      <el-container style="height:65vh;">
        <el-aside width="220px" class="image-aside">
          <div class="top">
            <div class="sku-list" :class="{'active':(activeId == item.id) }" v-for="(item,index) in tableData"
              :key="index" @click="handleChangeActiveId(item.id)">
              {{ item.name }}
            </div>
          </div>
          <div class="bottom">
            <el-pagination background layout="prev, next" :total="total" :current-page="currentPage"
              :page-size="pageSize" @current-change="getData" />
          </div>
        </el-aside>
        <el-main>
          <el-checkbox-group v-model="from.list">
            <el-checkbox v-for="item in list" :key="item" :label="item" border>
              {{item}}
            </el-checkbox>
          </el-checkbox-group>
        </el-main>
      </el-container>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="submit">确定</el-button>
          <el-button type="primary" @click="dialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

import { GetSkusList } from "~/api/skus"

import { useInitTable } from '~/composables/hook/useCommon'
// dialog的双向绑定开关
const dialogVisible = ref(false)

const {
  getData,
  total,
  loading,
  pageSize,
  currentPage,
  tableData,
} = useInitTable({
  GetData: GetSkusList,
  onGetListSuccess(res) {
    tableData.value = res.list;
    total.value = res.totalCount;

    if (tableData.value.length > 0) {
      handleChangeActiveId(tableData.value[0].id)
    }
  }
})

const callbackFunction = ref(null)
const open = (callback = null) => {
  callbackFunction.value = callback;
  getData(1)
  dialogVisible.value = true
}

const submit = () => {
  if (typeof callbackFunction.value == "function") {
    callbackFunction.value(from)
  }
  dialogVisible.value = false
}

defineExpose({
  open,
})


const from = reactive({
  name: '',
  list: [],
})

const activeId = ref(0)

const list = ref([])
const handleChangeActiveId = (id) => {
  activeId.value = id
  list.value = []
  const item = tableData.value.find(o => o.id == id)
  if (item) {
    list.value = item.default.split(",")
    from.name = item.name
  }
}
</script>

<style scoped>
.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}

.image-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-aside .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}

.sku-list {
  border-bottom: 1px solid #f4f4f4;
  @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
}

.sku-list:hover,
.active {
  @apply bg-blue-50;
}
</style>