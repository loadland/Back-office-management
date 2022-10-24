import axios from "~/axios";

// 获取
export function DetRoleList(page) {
  return axios.get(`/role/${page}`);
}

// 新增
export function NewRoleList(data) {
  return axios.post(`/role`, data);
}
// 修改
export function UpdateRoleList(id, data) {
  return axios.post("/role/" + id, data);
}
// 删除
export function DeleteRoleList(id) {
  return axios.post(`/role/${id}/delete`);
}

// 修改状态
export function ModifyRole(id, status) {
  return axios.post(`/role/${id}/update_status`, { status });
}

export function RolePermissions(id, rule_ids) {
  return axios.post(`/role/set_rules`, { id, rule_ids });
}
