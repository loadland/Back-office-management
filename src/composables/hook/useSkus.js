// import { ref } from "vue";

// export const goodsId = ref(0);

// export const sku_card_list = ref([]);

// export function initSkuCardList(d) {
//   sku_card_list.value = d.goodsSkusCard.map((item) => {
//     item.text = item.name;
//     item.loading = false;
//     item.goodsSkuCardValue.map((v) => {
//       v.text = v.value || "默认属性值";
//       return v;
//     });
//     return item;
//   });
// }

import { nextTick, ref, computed } from "vue";

import {
  CreateGoodsSkus,
  UpdateGoodsSkusCard,
  DeleteGoodsSkusCard,
  sortGoodsSkusCard,
  createGoodsSkusCardValue,
  updateGoodsSkusCardValue,
  deleteGoodsSkusCardValue,
  chooseAndSetGoodsSkusCard,
} from "~/api/goods";
import {
  toast,
  useArrayMoveUp,
  useArrayMoveDown,
  cartesianProductOf,
} from "~/composables/util";

// 当前商品ID
export const goodsId = ref(0);

// 规格选项列表
export const sku_card_list = ref([]);

// 存放规格选项表格的值
export const sku_list = ref([]);

// 初始化规格选项列表
export function initSkuCardList(d) {
  sku_card_list.value = d.goodsSkusCard.map((item) => {
    item.text = item.name;
    item.loading = false;
    item.goodsSkusCardValue.map((v) => {
      v.text = v.value || "属性值";
      return v;
    });
    return item;
  });
  sku_list.value = d.goodsSkus;
  getTableDate();
}

// 添加商品规格
const btnLoading = ref(false);
export function addSkuCardEvent() {
  btnLoading.value = true;
  CreateGoodsSkus({
    goods_id: goodsId.value, //商品ID
    name: "规格名称", //规格名称
    order: 50, //排序
    type: 0,
  })
    .then((res) => {
      toast("添加成功");
      sku_card_list.value.push({
        ...res,
        text: res.name,
        loading: false,
        goodsSkusCardValue: [],
      });
      getTableDate();
    })
    .finally(() => (btnLoading.value = false));
}

// 更新商品规格选项
export function handleUpdate(item) {
  item.loading = true;
  UpdateGoodsSkusCard(item.id, {
    goods_id: item.goods_id, //商品ID
    name: item.text, //规格名称
    order: item.order, //排序
    type: 0,
  })
    .then((res) => {
      item.name = item.text;
      getTableDate();
    })
    .catch((err) => {
      item.text = item.name;
    })
    .finally(() => (item.loading = false));
}

// 删除商品规格选项
export function handleDelete(item) {
  item.loading = true;
  DeleteGoodsSkusCard(item.id)
    .then((res) => {
      toast("删除成功");
      getTableDate();
      const i = sku_card_list.value.findIndex((o) => o.id == item.id);
      if (i != -1) {
        sku_card_list.value.splice(i, 1);
      }
    })
    .finally(() => (item.loading = false));
}

// 排序商品规格选项
export const bodyLoading = ref(false);
export function sortCard(action, index) {
  const oList = JSON.parse(JSON.stringify(sku_card_list.value));
  const func = action == "up" ? useArrayMoveUp : useArrayMoveDown;
  func(oList, index);
  let sortData = oList.map((o, i) => {
    return {
      id: o.id,
      order: i + 1,
    };
  });
  bodyLoading.value = true;
  sortGoodsSkusCard({ sortdata: sortData })
    .then((res) => {
      func(sku_card_list.value, index);
      getTableDate();
    })
    .finally(() => {
      bodyLoading.value = false;
    });
}

// 选择设置商品规格选项和值
export const handleChooseSetGoodsSkusCard = (id, data) => {
  const item = sku_card_list.value.find((o) => o.id == id);
  item.loading = true;
  chooseAndSetGoodsSkusCard(id, data)
    .then((res) => {
      item.name = item.text = res.goods_skus_card.name;
      item.goodsSkusCardValue = res.goods_skus_card_value.map((o) => {
        o.text = o.value || "默认属性值";
        return o;
      });
      getTableDate();
    })
    .finally(() => {
      item.loading = false;
    });
};

// 初始化规格值
export function initSkusCardItem(id) {
  const item = sku_card_list.value.find((o) => o.id == id);

  // //
  const loading = ref(false);
  const inputValue = ref("");
  const inputVisible = ref(false);
  const InputRef = ref();
  // tag的删除事件
  const handleClose = (tag) => {
    loading.value = true;
    deleteGoodsSkusCardValue(tag.id)
      .then((res) => {
        const i = item.goodsSkusCardValue.findIndex((o) => o.id == tag.id);
        if (i != -1) {
          item.goodsSkusCardValue.splice(i, 1);
          getTableDate();
        }
      })
      .finally(() => (loading.value = false));
  };
  // button的点击事件
  const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
      InputRef.value.input.focus();
    });
  };

  // 回车/失去焦点事件
  const handleInputConfirm = () => {
    if (!inputValue.value) {
      inputVisible.value = false;
      return;
    }
    loading.value = true;
    createGoodsSkusCardValue({
      goods_skus_card_id: id, //规格ID
      name: item.name, //规格名称
      order: 50, //排序
      value: inputValue.value, //规格选项名称
    })
      .then((res) => {
        item.goodsSkusCardValue.push({
          ...res,
          text: res.value,
        });
        getTableDate();
      })
      .finally(() => {
        inputVisible.value = false;
        inputValue.value = "";
        loading.value = false;
      });
  };
  // input发生改变的事件
  const handleChange = (e, tag) => {
    loading.value = true;
    updateGoodsSkusCardValue(tag.id, {
      goods_skus_card_id: id, //规格ID
      name: item.name, //规格名称
      order: item.order, //排序
      value: e, //规格选项名称
    })
      .then((res) => {
        tag.value = e;
        getTableDate();
      })
      .catch((err) => {
        tag.text = tag.value;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  // //
  return {
    item,
    inputValue,
    inputVisible,
    InputRef,
    loading,
    handleClose,
    showInput,
    handleInputConfirm,
    handleChange,
  };
}
// 初始化表格
export function initSkuTable() {
  const skuLabels = computed(() => {
    return sku_card_list.value.filter((v) => v.goodsSkusCardValue.length > 0);
  });

  const tableThs = computed(() => {
    let length = skuLabels.value.length;
    return [
      {
        name: "商品规格",
        colspan: length,
        width: "",
        rowspan: length > 0 ? 1 : 2,
      },
      {
        name: "销售价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "市场价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "成本价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "库存",
        width: "100",
        rowspan: 2,
      },
      {
        name: "体积",
        width: "100",
        rowspan: 2,
      },
      {
        name: "重量",
        width: "100",
        rowspan: 2,
      },
      {
        name: "编码",
        width: "100",
        rowspan: 2,
      },
    ];
  });
  return {
    tableThs,
    skuLabels,
    sku_list,
  };
}

// 获取规格表格数据
function getTableDate() {
  setTimeout(() => {
    if (sku_card_list.value.length === 0) return [];

    let list = [];
    sku_card_list.value.forEach((o) => {
      if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
        list.push(o.goodsSkusCardValue);
      }
    });

    if (list.length === 0) return [];

    let arr = cartesianProductOf(...list);

    sku_list.value = [];
    sku_list.value = arr.map((o) => {
      return {
        code: "",
        cprice: "0.00",
        goods_id: goodsId.value,
        image: "",
        oprice: "0.00",
        pprice: "0.00",
        skus: o,
        stock: 0,
        volume: 0,
        weight: 0,
      };
    });
  }, 200);
}
