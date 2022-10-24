import axios from "~/axios";
// 获取原有系统设置
export function getSysConfig() {
  return axios.get(`/sysconfig`);
}
// 修改系统设置
export function setSysConfig(data) {
  return axios.post(`/sysconfig`, data);
}
