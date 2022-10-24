import { createApp } from "vue";
import App from "./App.vue";

import "./assets/main.css";
import "nprogress/nprogress.css";

const app = createApp(App);

import "~/permission";
import { router } from "./router";
import store from "~/store";
app.use(store);
app.use(router);

import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

app.use(ElementPlus, {
  locale: zhCn,
});
import "element-plus/dist/index.css";
import "virtual:windi.css";

// 字体图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 自定义指令 -->权限配置
import permission from "~/directives/permission.js";
app.use(permission);

app.mount("#app");
