import axios from "~/axios";

// 获取首页头部信息
export function GetStatistics() {
  return axios.get("/statistics1");
}

// 获取首页数据可视化的信息
export function GetStatistics3(type) {
  return axios.get("/statistics3?type=" + type);
}

// 获取首页商铺信息
export function GetStatistics2() {
  return axios.get("/statistics2");
}
