import { router, addRoutes } from "~/router";
import { getToken } from "~/composables/auth";
import { toast, showFullLoading, hideFullLoading } from "~/composables/util";

import store from "~/store";
// 配置节流
let hasGetInfo = false;
router.beforeEach(async (to, from, next) => {
  // 显示全屏loading
  showFullLoading();

  const token = getToken();
  // 判断是否登录
  if (!token && to.path != "/login") {
    toast("还没登录奥", "请先登录", "warning");
    return next({ path: "/login" });
  }
  // 防止反复登录
  if (token && to.path == "/login") {
    toast("服务器故障", "请走正常逻辑重新登录", "warning");
    return next({ path: from.path ? from.path : "/index" });
  }
  let hasNewRoute = false;
  // 判断如果token存在就将token保存到vuex中
  if (token && !hasGetInfo) {
    // 每次刷新就会调用，防止用户刷新之后数据丢失
    store.commit("SetTokens", token);
    // 每次刷新就会调用，防止用户刷新之后数据丢失
    let { menus } = await store.dispatch("SetUserInfoActions");
    hasGetInfo = true;
    // 动态添加路由
    hasNewRoute = addRoutes(menus);
  }

  // 添加动态title
  if (to.meta.title) document.title = to.meta.title;

  hasNewRoute ? next(to.fullPath) : next();
});

router.afterEach((to, from) => hideFullLoading());
