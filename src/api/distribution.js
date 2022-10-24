import axios from "~/axios";
import { queryParams } from "~/composables/util";

// 获取列表
export function getAgentList(page, query = {}) {
  let r = queryParams(query);
  return axios.get(`/agent/${page}${r}`);
}

export function getAgentOrderList(page, query = {}) {
  let r = queryParams(query);
  return axios.get(`/user_bill/${page}${r}`);
}
// 分销数据统计
export function getStatistics() {
  return axios.get(`/agent/statistics`);
}
// 获取分销配置
export function getConfig() {
  return axios.get(`/distribution_setting/get`);
}
// 修改分销配置
export function setConfig(data) {
  return axios.post(`/distribution_setting/set`, data);
}
