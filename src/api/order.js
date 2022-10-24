import axios from "~/axios";
import { queryParams } from "~/composables/util";

// 获取列表
export function GetOrderList(page, query = {}) {
  let r = queryParams(query);
  return axios.get(`/order/${page}${r}`);
}

// 删除
export function DeleteOrderList(ids) {
  ids = !Array.isArray(ids) ? [ids] : ids;
  return axios.post(`/order/delete_all`, { ids });
}
// 导出订单
export function exportOrder(query = {}) {
  let r = queryParams(query);
  return axios.post(
    `/order/excelexport${r}`,
    {},
    {
      responseType: "blob",
    }
  );
}
// 查看物流信息
export function getShipInfo(id) {
  return axios.get(`/order/${id}/get_ship_info`);
}
// 拒绝/同意退款
export function handleRefund(id, data) {
  return axios.post(`/order/${id}/handle_refund`, data);
}
