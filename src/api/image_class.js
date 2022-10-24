import axios from "~/axios";

export function GetImageList(page) {
  return axios.get("/image_class/" + page);
}

export function PostImageList(data) {
  return axios.post("/image_class", data);
}

export function upDateImageList(id, data) {
  return axios.post("/image_class/" + id, data);
}

export function deleteImageList(id) {
  return axios.post(`/image_class/${id}/delete`);
}
