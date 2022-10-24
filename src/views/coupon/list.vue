<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 头部 -->
      <new-flushed @NewNotice="NewNotice" @update="update" layout="create,refresh" />

      <!-- 表格部分· -->
      <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%" v-loading="loading">
        <el-table-column label="优惠券名称" width="350">
          <template #default="{ row }">
            <div class="border border-dashed py-2 px-4 rounded"
              :class="row.statusText == '领取中' ? 'active' : 'inactive'">
              <h5 class="font-bold text-md">{{ row.name }}</h5>
              <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="statusText" label="状态" />
        <el-table-column prop="order" label="排序" />

        <el-table-column label="优惠">
          <template #default=" { row }">
            {{ row.type ? "折扣" : "满减" }} {{ row.type ?(row.value + "折"): ("￥" + row.value) }}
          </template>
        </el-table-column>
        <el-table-column prop="total" label="发行数量" />
        <el-table-column prop="used" label="已使用" />
        <el-table-column label="操作" width="250" align="center">
          <template #default="scope">
            <el-button v-if="scope.row.statusText == '未开始' " type="primary" size="small"
              @click="handleUpdate(scope.row)" text>修改</el-button>

            <el-button v-if="scope.row.statusText == '领取中' " type="danger" size="small" plain
              @click="handleLapse(0,scope.row)">失效
            </el-button>


            <el-popconfirm
              v-if="scope.row.statusText == '已结束' || scope.row.statusText == '未开始' || scope.row.statusText == '已失效' "
              title=" 是否要删除该行数据?" confirm-button-text="确定" cancel-button-text="取消"
              @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" size="small" text>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
      <div class="flex justify-center items-center mt-5">
        <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page="currentPage"
          @current-change="addList" />
      </div>


    </el-card>

    <!-- 抽屉组件 -->
    <form-drawer :title="noticeTitle + '优惠券'" ref="formDrawerRef" :destroyOnClose="true">
      <template #form>
        <el-form :model="from" ref="formRef" :rules="rules" label-width="120px" :inline="false">
          <el-form-item label="优惠券名称：" prop="name" style="width: 50%;">
            <el-input v-model="from.name" placeholder="规格名称"></el-input>
          </el-form-item>
          <el-form-item label="类型：" prop="type">
            <el-radio-group v-model="from.type">
              <el-radio :label="0">满减</el-radio>
              <el-radio :label="1">折扣</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="面值：" prop="value" style="width: 50%;">
            <el-input v-model="from.status">
              <template #append> {{ from.type ? "折" : "元" }} </template>
            </el-input>
          </el-form-item>
          <el-form-item label="发行量：" prop="total">
            <el-input-number v-model="from.total" size="small" :min="1" :max="Infinity"></el-input-number>
          </el-form-item>
          <el-form-item label="最低使用价格：" prop="min_price" style="width: 50%;">
            <el-input type="number" v-model="from.min_price" placeholder="最底使用价格"></el-input>
          </el-form-item>
          <el-form-item label="排序：" prop="order">
            <el-input-number v-model="from.order" size="small" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="活动时间：" prop="default">
            <el-date-picker v-model="timerange" type="daterange" range-separator="To" start-placeholder="开始时间"
              end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
          <el-form-item label=" 描述：" prop="desc" style="width: 80%;">
            <el-input v-model="from.desc" placeholder="描述" type="textarea" :rows="5"></el-input>
          </el-form-item>
        </el-form>
      </template>

      <template #btn>
        <el-button type="primary" @click="onsubmit">提交</el-button>
      </template>

    </form-drawer>


  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import NewFlushed from '~/components/common/NewFlushed.vue'

// 获取/新增/修改/删除
import { GetCouponList, CreateCouponList, UpdateCouponList, DeleteCouponList, reviseCoupon } from '~/api/coupon'

// 抽屉组件
import formDrawer from "~/components/common/formDrawer.vue"
// 提示组件
import { toast } from '~/composables/util'


// 分页和搜索封装的函数
import { useInitTable, useInitForm } from '~/composables/hook/useCommon'



const {
  // 分页
  total,
  pageSize,
  currentPage,
  tableData,
  // 加载
  loading,
  // 获取数据
  getData,

  handleDelete,
  update,
  handleMultiDelete
} = useInitTable({
  // 获取数据的请求
  GetData: GetCouponList,
  onGetListSuccess(res) {
    tableData.value = res.list.map(o => {
      o.statusText = formatStatus(o)
      return o
    })
    total.value = res.totalCount;
  },
  remove: DeleteCouponList,
  modify: reviseCoupon,
})

// 表单新增修改功能
const {
  formDrawerRef,
  noticeTitle,
  formRef,
  rules,
  from,
  NewNotice,
  onsubmit,
  handleUpdate,
  resetForm,
} = useInitForm({
  from: {
    name: "",
    type: 1,
    value: 100,
    total: 100,
    min_price: 10,
    start_time: null,
    end_time: null,
    order: 50,
    desc: '',
  },
  rules: {},
  getData,
  update: UpdateCouponList,
  create: CreateCouponList,
  beforeSubmit(f) {
    if (typeof f.start_time != "number") {
      f.start_time = (new Date(f.start_time)).getTime();
    }
    if (typeof f.end_time != "number") {
      f.end_time = (new Date(f.end_time)).getTime();
    }
    return f
  }

})

// 页码变更事件
const addList = (e) => {
  getData(e)
}


// 时间判断
function formatStatus(row) {
  let s = "领取中"
  let start_time = new Date(row.start_time).getTime()
  let now = new Date().getTime()
  let end_time = new Date(row.end_time).getTime()
  if (start_time > now) {
    s = "未开始"
  } else if (end_time < now) {
    s = "已结束"
  } else if (row.status == 0) {
    s = "已失效"
  }

  return s
}


// 活动时间
const timerange = computed({
  get() {
    return from.start_time && from.end_time ? [from.start_time, from.end_time] : []
  },
  set(val) {
    from.start_time = val[0]
    from.end_time = val[1]
  }
})

// 失效
const handleLapse = (status, row) => {
  reviseCoupon(row.id, status).then(res => {
    toast("修改状态成功");
    row.statusText = "已失效";
  })
}

// 数组深层遍历
// function getId(lists) {
//   const hasChildrenArr = (obj) => {
//     return obj.child !== undefined
//   }
//   lists.forEach(list => {
//     defaultExpandedKeys.value.push(list.id)
//     if (hasChildrenArr(list)) {
//       getId(list.child)
//     }
//   })
// }

</script>

<style  scoped>
.active {
  @apply border-rose-200 bg-rose-50 text-red-400;
}

.inactive {
  @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>
