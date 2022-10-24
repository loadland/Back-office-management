import axios from "~/axios";

export function GetCouponList(page) {
  return axios.get(`/coupon/${page}`);
}

export function CreateCouponList(data) {
  return axios.post("/coupon", data);
}

export function UpdateCouponList(id, data) {
  return axios.post("/coupon/" + id, data);
}

export function DeleteCouponList(id) {
  return axios.post(`/coupon/${id}/delete`);
}

export function reviseCoupon(id) {
  return axios.post(`/coupon/${id}/update_status`, {
    status: 0,
  });
}
