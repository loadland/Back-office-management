import axios from "~/axios";

export function GetImages(id, page = 1) {
  return axios.get(`/image_class/${id}/image/${page}`);
}

export function UpdateImages(id, name) {
  return axios.post(`/image/${id}`, { name });
}

export function DeleteImages(ids) {
  return axios.post("/image/delete_all", { ids });
}

export const uploadImageAction =
  import.meta.env.VITE_APP_BASE_API + "/image/upload";
