import { createStore } from "vuex";
import { router } from "~/router";

import { GetUserInfo, login, logout } from "~/api/manager";

import { removeToken, setToken } from "~/composables/auth";
import { toast } from "~/composables/util";

const state = () => {
  return {
    token: "",
    user: {},

    // 侧边栏宽度
    asideWidth: "250px",
    // 用户信息
    menus: [],
    // 权限信息
    ruleNames: [],
  };
};

const store = createStore({
  state,
  mutations: {
    // 记录token
    SetTokens(state, token) {
      state.token = token;
    },
    // 记录用户信息
    SetUserInfo(state, user) {
      state.user = user;
    },
    // 改变侧边栏宽度
    SetAsideWidth(state) {
      state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px";
    },
    SetMenus(state, menus) {
      state.menus = menus;
    },
    SetRuleNames(state, ruleNames) {
      state.ruleNames = ruleNames;
    },
  },
  actions: {
    // 获取token
    SetTokenActions({ commit }, form) {
      return new Promise((resolve, reject) => {
        login(form)
          .then((res) => {
            // 保存到cookie
            setToken(res.token);
            // 登录成功跳转;
            router.replace("/index");

            toast("成功了，我的朋友", "登录成功");
            // 保存到vuex
            commit("SetTokens", res.token);
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
    // 获取用户信息
    SetUserInfoActions({ commit }) {
      return new Promise((resolve, reject) => {
        GetUserInfo()
          .then((res) => {
            commit("SetUserInfo", res);
            commit("SetMenus", res.menus);
            commit("SetRuleNames", res.ruleNames);
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
    // 退出登录
    SetLogout({ commit }) {
      return new Promise((resolve, reject) => {
        logout().finally(() => {
          // 返回登录页面
          router.replace("/login");
          // 删除token
          removeToken();
          // 清空vuex
          commit("SetTokens", "");
          commit("SetUserInfo", {});
          // 提示语
          toast("还会回来吗，燕子", "燕子 ! 燕子 ! ! !");
        });
      });
    },
  },
});

export default store;
