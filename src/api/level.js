import axios from "~/axios";
// 获取列表
export function GetUserLevelList(page) {
  return axios.get(`/user_level/${page}`);
}

// 修改状态
export function ModifyUserLevel(id, status) {
  return axios.post(`/user_level/${id}/update_status`, { status });
}

// 增加
export function CreateUserLevel(data) {
  return axios.post(`/user_level`, data);
}
// 删除
export function RemoveUserLevel(id) {
  return axios.post(`/user_level/${id}/delete`);
}
// 修改
export function UpdateUserLevel(id, data) {
  return axios.post(`/user_level/${id}`, data);
}
