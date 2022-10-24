<template>
  <div>
    <el-card shadow="never" class="border-0">

      <!-- 搜索 -->
      <search :model="formSearch" @search="getData" @reset="resetSearchForm" ref="form" label-width="150px">
        <search-item label="搜索指定商品：">
          <el-input v-model="formSearch.title"></el-input>
        </search-item>
      </search>

      <!-- 头部 -->
      <!-- 表格部分· -->
      <el-table default-expand-all :data="tableData" stripe style="width: 100%" v-loading="loading">


        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="flex pl-18">
              <el-avatar :size="50" :src="row.user?.avatar ?? '游客'" fit="fill" class="mr-3"></el-avatar>
              <div class="flex-1">
                <h6 class="flex items-center">
                  {{ row.user.username || row.user.nickname }}
                  <small class=" text-gray-400 ml-2">{{ row.user?.create_time ?? '' }}</small>
                  <el-button size="small" class="ml-auto" @click="openTextarea(row)">回复</el-button>
                </h6>
                {{ row.review.data }}
                <div class="flex py-2">
                  <el-image v-for="(item,index) in row.review.image" :key="index" :src="item" fit="fill" :lazy="true"
                    style="width: 100px;height: 100px;" class="rounded cursor-pointer">
                  </el-image>

                  <!--  -->
                  <div v-if="row.textareaEdit" class="flex-1 ml-30">
                    <el-input v-model="textarea" placeholder="请输入回复内容" size="small" type="textarea" :rows="2" />
                    <div class="mt-5">
                      <el-button type="primary" size="small" @click="review(row)">回复</el-button>
                      <el-button size="small" @click="textarea = ''">取消</el-button>
                    </div>
                  </div>
                </div>

                <div class="mt-3 bg-gray-100 p-3 rounded" v-for="(item,index) in row.extra" :key="index">
                  <h6 class="flex font-bold">
                    客服
                    <el-button type="info" size="small" class="ml-auto" @click="openTextarea(row,item.data)">修改
                    </el-button>
                  </h6>
                  <p>{{ item.data }}</p>
                </div>

              </div>
            </div>
          </template>
        </el-table-column>



        <el-table-column label="ID" width="70" align="center" prop="id" />
        <el-table-column label="商品">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-image :src="row.goods_item ? row.goods_item.cover : ''" fit="fill" :lazy="true"
                style="width:50px;height:50px;" class="rounded"></el-image>
              <div class="ml-3">
                <p>{{ row.goods_item?.title ?? '-' }}</p>
                <p>{{ row.goods_item?.desc ?? '-' }}</p>
              </div>
            </div>
          </template>
        </el-table-column>


        <el-table-column label="评价信息" width="380">
          <template #default="{ row }">
            <div>
              <p>用户： {{ row.user?.username ?? "-" }}</p>
              <p>
                <el-rate v-model="row.rating" disabled text-color="#ff9900" />
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="评价时间" width="180" align="center" prop="review_time" />


        <el-table-column label="状态" width="120" align="right">
          <template #default="{ row }">
            <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
              @change="handleStatusChange($event,row)" :loading="row.statusLoading">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
      <div class="flex justify-center items-center mt-5">
        <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page="currentPage"
          @current-change="getData" />
      </div>

    </el-card>


  </div>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from "~/composables/util"

// 获取/新增/修改/删除管理员 // 修改管理员状态
import {
  GetGoodsCommentList,
  ModifyGoodsComment,
  ModifyReview,
} from '~/api/goods_comment'


// 分页和搜索封装的函数 // 表单新增修改功能  // 修改状态和删除和刷新
import { useInitTable } from '~/composables/hook/useCommon'


// 搜索组件
import search from '~/components/common/search.vue'
import searchItem from '~/components/common/searchItem.vue'

// 分页和搜索封装的函数
const {
  // 搜索
  formSearch,
  resetSearchForm,
  // 分页
  total,
  pageSize,
  currentPage,
  tableData,
  // 加载
  loading,
  // 获取数据
  getData,

  handleStatusChange,
  handleDelete,
  update,
} = useInitTable({
  // 搜索和重置  
  formSearch: {
    title: "",
  },
  // 获取数据的请求
  GetData: GetGoodsCommentList,
  // 获取的数据
  onGetListSuccess(res) {
    tableData.value = res.list.map((o) => {
      o.loading = false
      o.textareaEdit = false;
      return o
    })
    total.value = res.totalCount;
  },
  modify: ModifyGoodsComment,

})

const textarea = ref("")
const openTextarea = (row, data) => {
  textarea.value = data
  row.textareaEdit = true
}

const review = (row) => {
  if (!textarea.value) {
    toast("请输入内容", '警告', 'warning')
  } else {
    ModifyReview(row.id, textarea.value)
      .then((res) => {
        toast("评论成功")
        getData()
        textarea.value = ''
        row.textareaEdit = true
      })
  }

}
</script>

<style  scoped>

</style>