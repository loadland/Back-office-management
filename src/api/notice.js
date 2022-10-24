import axios from "~/axios";

// 获取
export function DetNoticeList(page) {
  return axios.get(`/notice/${page}`);
}

// 新增
export function NewNoticeList(data) {
  return axios.post(`/notice`, data);
}

// 修改
export function UpdateNoticeList(id, data) {
  return axios.post(`/notice/${id}`, data);
}
// 删除
export function DeleteNoticeList(id) {
  return axios.post(`/notice/${id}/delete`);
}
