import axios from "~/axios";
// 获取token
export function login({ username, password }) {
  return axios.post("/login", {
    username,
    password,
  });
}
// 获取用户信息
export function GetUserInfo() {
  return axios.post("/getinfo");
}

// 退出登录
export function logout() {
  return axios.post("/logout");
}

// 修改密码
export function updatedPassword(data) {
  return axios.post("/updatepassword", data);
}

// 获取管理员列表
export function GetManagerList(page, query = {}) {
  let q = [];
  for (const key in query) {
    if (query[key]) {
      q.push(`${key}=${encodeURIComponent(query[key])}`);
    }
  }

  let r = q.join("&");
  r = r ? "?" + r : "";
  return axios.get(`/manager/${page}${r}`);
}

// 修改管理员状态
export function ModifyAdministrator(id, status) {
  return axios.post(`/manager/${id}/update_status`, { status });
}

// 增加管理员
export function CreateAdministrator(data) {
  return axios.post(`/manager`, data);
}
// 删除管理员
export function RemoveAdministrator(id) {
  return axios.post(`/manager/${id}/delete`);
}
// 修改管理员
export function UpdateAdministrator(id, data) {
  return axios.post(`/manager/${id}`, data);
}
