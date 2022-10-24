import axios from "~/axios";

// 获取列表
export function GetGoodsCommentList(page, query = {}) {
  let q = [];
  for (const key in query) {
    if (query[key]) {
      q.push(`${key}=${encodeURIComponent(query[key])}`);
    }
  }

  let r = q.join("&");
  r = r ? "?" + r : "";
  return axios.get(`/goods_comment/${page}${r}`);
}

// 修改状态
export function ModifyGoodsComment(id, status) {
  return axios.post(`/goods_comment/${id}/update_status`, { status });
}

export function ModifyReview(id, data) {
  return axios.post(`/goods_comment/review/${id}`, { data });
}
