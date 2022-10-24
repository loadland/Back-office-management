import axios from "~/axios";

export function getCategoryList() {
  return axios.get("/category");
}
// 新增
export function createCategoryList(data) {
  return axios.post(`/category`, data);
}
// 修改
export function updateCategoryList(id, data) {
  return axios.post("/category/" + id, data);
}
// 删除
export function deleteCategoryList(id) {
  return axios.post(`/category/${id}/delete`);
}
// 修改状态
export function reviseCategory(id, status) {
  return axios.post(`/category/${id}/update_status`, { status });
}
// 分类关联产品列表
export function getCategoryGoods(id) {
  return axios.get(`/app_category_item/list?category_id=${id}`);
}
// 删除关联产品
export function deleteCategoryGoods(id) {
  return axios.post(`/app_category_item/${id}/delete`);
}
// 关联产品
export function CategoryGoods(data) {
  return axios.post(`/app_category_item`, data);
}
