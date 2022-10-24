import axios from "~/axios";
import { queryParams } from "~/composables/util";

// 获取列表
export function GetGoodsList(page, query = {}) {
  let r = queryParams(query);
  return axios.get(`/goods/${page}${r}`);
}

// 批量上/下架
export function ModifyGoods(ids, status) {
  return axios.post(`/goods/changestatus`, { ids, status });
}

// 增加
export function CreateGoods(data) {
  return axios.post(`/goods`, data);
}
// 删除
export function DeleteGoodsList(ids) {
  ids = !Array.isArray(ids) ? [ids] : ids;
  return axios.post(`/goods/delete_all`, { ids });
}
// 修改
export function UpdateGoods(id, data) {
  return axios.post(`/goods/${id}`, data);
}
// 查看商品资料
export function readGoods(id) {
  return axios.get(`/goods/read/${id}`);
}
// 设置商品轮播图
export function setGoodsBanner(id, data) {
  return axios.post(`/goods/banners/${id}`, data);
}
// 更新商品规格
export function updateGoodsSkus(id, data) {
  return axios.post(`/goods/updateskus/${id}`, data);
}
// 添加商品规格选项
export function CreateGoodsSkus(data) {
  return axios.post(`/goods_skus_card`, data);
}
// 修改商品规格选项
export function UpdateGoodsSkusCard(id, data) {
  return axios.post(`/goods_skus_card/${id}`, data);
}
// 删除商品规格选项
export function DeleteGoodsSkusCard(id) {
  return axios.post(`/goods_skus_card/${id}/delete`);
}
// 排序商品规格选项
export function sortGoodsSkusCard(data) {
  return axios.post(`/goods_skus_card/sort`, data);
}
// 添加商品规格选项的值
export function createGoodsSkusCardValue(data) {
  return axios.post(`/goods_skus_card_value`, data);
}
// 修改商品规格选项的值
export function updateGoodsSkusCardValue(id, data) {
  return axios.post(`/goods_skus_card_value/${id}`, data);
}
// 删除商品规格选项的值
export function deleteGoodsSkusCardValue(id) {
  return axios.post(`/goods_skus_card_value/${id}/delete`);
}
// 选择设置商品规格选项和值
export function chooseAndSetGoodsSkusCard(id, data) {
  return axios.post(`/goods_skus_card/${id}/set`, data);
}
// 批量恢复
export function RestoreGoodsList(ids) {
  ids = !Array.isArray(ids) ? [ids] : ids;
  return axios.post(`/goods/restore`, { ids });
}
// 永久删除
export function DestroyGoodsList(ids) {
  ids = !Array.isArray(ids) ? [ids] : ids;
  return axios.post(`/goods/destroy`, { ids });
}
