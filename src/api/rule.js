import axios from "~/axios";

// 获取
export function GetRuleList() {
  return axios.get(`/rule/1`);
}

// 新增
export function NewRuleList(data) {
  return axios.post(`/rule`, data);
}

// 修改
export function UpdateRuleList(id, data) {
  return axios.post("/rule" + id, data);
}
// 删除
export function DeleteRuleList(id) {
  return axios.post(`/rule/${id}/delete`);
}
// 修改状态
export function reviseRule(id, status) {
  return axios.post(`/rule/${id}/update_status`, { status });
}
