import axios from "~/axios";
// 获取列表
export function GetUserList(page, query = {}) {
  let q = [];
  for (const key in query) {
    if (query[key]) {
      q.push(`${key}=${encodeURIComponent(query[key])}`);
    }
  }

  let r = q.join("&");
  r = r ? "?" + r : "";
  return axios.get(`/user/${page}${r}`);
}

// 修改状态
export function ModifyUser(id, status) {
  return axios.post(`/user/${id}/update_status`, { status });
}

// 增加
export function CreateUser(data) {
  return axios.post(`/user`, data);
}
// 删除
export function RemoveUser(id) {
  return axios.post(`/user/${id}/delete`);
}
// 修改
export function UpdateUser(id, data) {
  return axios.post(`/user/${id}`, data);
}
