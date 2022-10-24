import { ref, reactive, computed } from "vue";
// 提示组件
import { toast } from "~/composables/util";

// 分页和搜索封装的函数   // 修改状态和删除和刷新
export function useInitTable(options = {}) {
  // 搜索
  // const formSearch = reactive({
  //   keyword: "",
  // });
  // // 重置
  // const resetSearchForm = () => {
  //   formSearch.keyword = "";
  //   getData();
  // };

  // 搜索和重置   公共衍生版
  let formSearch = null;
  let resetSearchForm = null;
  if (options.formSearch) {
    // 搜索
    formSearch = reactive({ ...options.formSearch });

    // 重置
    resetSearchForm = () => {
      for (const key in options.formSearch) {
        formSearch[key] = options.formSearch[key];
      }
      getData();
    };
  }

  // 分页
  const total = ref(0);
  const pageSize = ref(10);
  const currentPage = ref(1);
  const tableData = ref([]);
  const loading = ref(false);

  // 获取数据
  function getData(e) {
    if (typeof e == "number") {
      currentPage.value = e;
    }
    loading.value = true;
    // 1
    options
      .GetData(currentPage.value, formSearch)
      .then((res) => {
        // 2
        if (
          options.onGetListSuccess &&
          typeof options.onGetListSuccess == "function"
        ) {
          options.onGetListSuccess(res);
        } else {
          tableData.value = res.list;
          total.value = res.totalCount;
        }
      })
      .finally(() => (loading.value = false));
  }
  getData();

  // 修改状态和删除和刷新
  // 点击删除
  const handleDelete = (id) => {
    options.remove(id).then((res) => {
      toast("删除成功");
      getData();
    });
  };

  // 状态发生改变时的回调
  const handleStatusChange = (status, row) => {
    row.statusLoading = true;
    options
      .modify(row.id, status)
      .then((res) => {
        toast("修改状态成功");
        row.status = status;
      })
      .finally(() => (row.statusLoading = false));
  };

  // 刷新
  const update = () => getData();

  // 多选选中的id
  const multiSelectionIds = ref([]);
  // 多选
  const handleSelectionChange = (e) => {
    multiSelectionIds.value = e.map((o) => o.id);
  };

  const multipleTableRef = ref(null);

  const handleMultiDelete = () => {
    loading.value = true;
    options
      .remove(multiSelectionIds.value)
      .then((res) => {
        toast("批量删除成功");
        getData();
        if (multipleTableRef.value) {
          multipleTableRef.value.clearSelection();
        }
      })
      .finally(() => (loading.value = false));
  };

  const handleMultiStatusChange = (status) => {
    loading.value = true;
    options
      .modify(multiSelectionIds.value, status)
      .then((res) => {
        toast("批量修改成功");
        getData();
        if (multipleTableRef.value) {
          multipleTableRef.value.clearSelection();
        }
      })
      .finally(() => (loading.value = false));
  };

  return {
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
    multiSelectionIds,

    handleStatusChange,
    handleDelete,
    update,

    multipleTableRef,
    handleMultiDelete,
    handleSelectionChange,

    handleMultiStatusChange,
  };
}

// 表单新增修改功能
export function useInitForm(options = {}) {
  // 判断是更新还是修改打开的抽屉
  const noticeId = ref(0);
  const noticeTitle = computed(() => (noticeId.value == 0 ? "新增" : "修改"));

  // 抽屉
  const formDrawerRef = ref(null);
  // 抽屉里的表单
  const formRef = ref(null);

  const defaultFrom = options.from;

  // 抽屉里的表单的数据
  const from = reactive({});

  // 抽屉里的表单验证规则
  const rules = options.rules || {};

  // 新增
  const NewNotice = () => {
    noticeId.value = 0;
    resetForm(defaultFrom);
    formDrawerRef.value.open();
  };

  // 抽屉里的提交
  const onsubmit = () => {
    formRef.value.validate((valid) => {
      if (valid) {
        let body = {};
        if (
          options.beforeSubmit &&
          typeof options.beforeSubmit === "function"
        ) {
          body = options.beforeSubmit({ ...from });
        } else {
          body = from;
        }

        const fun = noticeId.value
          ? options.update(noticeId.value, body)
          : options.create(body);
        fun
          .then((res) => {
            toast(`${noticeTitle.value}成功`);
            options.getData(noticeId.value ? false : 1);
            formDrawerRef.value.close();
          })
          .catch((err) => console.log(err));
      }
    });
  };

  // 修改
  const handleUpdate = (row) => {
    noticeId.value = row.id;
    resetForm(row);
    formDrawerRef.value.open();
  };

  // 重置表单
  function resetForm(row = false) {
    if (formRef.value) formRef.value.clearValidate();
    for (const key in defaultFrom) {
      from[key] = row[key];
    }
  }

  return {
    noticeId,
    noticeTitle,
    formDrawerRef,
    formRef,
    rules,
    from,
    NewNotice,
    onsubmit,
    handleUpdate,
    resetForm,
  };
}
