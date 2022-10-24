import axios from "~/axios";

export function GetSkusList(page) {
  return axios.get(`/skus/${page}`);
}

export function CreateSkusList(data) {
  return axios.post("/skus", data);
}

export function UpdateSkusList(id, data) {
  return axios.post("/skus/" + id, data);
}

export function DeleteSkusList(ids) {
  ids = !Array.isArray(ids) ? [ids] : ids;
  return axios.post(`/skus/delete_all`, { ids });
}

export function reviseSkus(id, status) {
  return axios.post(`/skus/${id}/update_status`, {
    status,
  });
}
