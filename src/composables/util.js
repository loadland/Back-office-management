import { ElNotification, ElMessageBox } from "element-plus";

import nprogress from "nprogress";

// 右上提示框
export function toast(
  title,
  message = "成功",
  type = "success",
  showClose = false,
  dangerouslyUseHTMLString = true
) {
  ElNotification({
    title,
    message,
    type,
    showClose,
    dangerouslyUseHTMLString,
  });
}
// 蒙版提示框
export function showModal(
  conText,
  title,
  confirmButtonText = "确定",
  cancelButtonText = "取消",
  type = "warning"
) {
  return ElMessageBox.confirm(conText, title, {
    confirmButtonText,
    cancelButtonText,
    type,
  });
}

// 开启全屏loading
export function showFullLoading() {
  nprogress.start();
}
// 隐藏全屏loading
export function hideFullLoading() {
  nprogress.done();
}

export function showMessageBox(title, value) {
  return ElMessageBox.prompt(title, "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputValue: value,
  });
}

// 请求拼接的query
export function queryParams(query) {
  let q = [];
  for (const key in query) {
    if (query[key]) {
      q.push(`${key}=${encodeURIComponent(query[key])}`);
    }
  }

  let r = q.join("&");
  r = r ? "?" + r : "";
  return r;
}

// 上移
export function useArrayMoveUp(arr, index) {
  swapArray(arr, index, index - 1);
}
// 下移
export function useArrayMoveDown(arr, index) {
  swapArray(arr, index, index + 1);
}
// function swapArray(arr, index1, index2) {
//   arr[index1] = arr.splice(index2, 1, arr[index1])[0];
//   return arr;
// }

function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}

// sku排列算法
export function cartesianProductOf() {
  return Array.prototype.reduce.call(
    arguments,
    function (a, b) {
      var ret = [];
      a.forEach(function (a) {
        b.forEach(function (b) {
          ret.push(a.concat([b]));
        });
      });
      return ret;
    },
    [[]]
  );
}
