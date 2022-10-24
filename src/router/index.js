import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("~/views/notFound.vue"),
    meta: {
      title: "404",
    },
  },
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("~/layouts/admin.vue"),
    children: [
      {
        path: "/index",
        component: () => import("~/views/index.vue"),
        meta: {
          title: "首页",
        },
      },
    ],
  },
  {
    path: "/login",
    component: () => import("~/views/login.vue"),
    meta: {
      title: "登录",
    },
  },
];

// 动态路由/用于匹配菜单动态添加路由
const asyncRouter = [
  {
    path: "/goods/list",
    name: "/goods/list",
    component: () => import("~/views/goods/list.vue"),
    meta: {
      title: "商品管理",
    },
  },
  {
    path: "/category/list",
    name: "/category/list",
    component: () => import("~/views/category/list.vue"),
    meta: {
      title: "分类管理",
    },
  },
  {
    path: "/user/list",
    name: "/user/list",
    component: () => import("~/views/user/list.vue"),
    meta: {
      title: "用户管理",
    },
  },
  {
    path: "/order/list",
    name: "/order/list",
    component: () => import("~/views/order/list.vue"),
    meta: {
      title: "订单管理",
    },
  },
  {
    path: "/comment/list",
    name: "/comment/list",
    component: () => import("~/views/comment/list.vue"),
    meta: {
      title: "评价管理",
    },
  },
  {
    path: "/image/list",
    name: "/image/list",
    component: () => import("~/views/image/list.vue"),
    meta: {
      title: "图库管理",
    },
  },
  {
    path: "/notice/list",
    name: "/notice/list",
    component: () => import("~/views/notice/list.vue"),
    meta: {
      title: "公告管理",
    },
  },

  {
    path: "/setting/base",
    name: "/setting/base",
    component: () => import("~/views/setting/base.vue"),
    meta: {
      title: "基础设置管理",
    },
  },
  {
    path: "/coupon/list",
    name: "/coupon/list",
    component: () => import("~/views/coupon/list.vue"),
    meta: {
      title: "优惠管理",
    },
  },
  {
    path: "/manager/list",
    name: "/manager/list",
    component: () => import("~/views/manager/list.vue"),
    meta: {
      title: "管理员",
    },
  },
  {
    path: "/access/list",
    name: "/access/list",
    component: () => import("~/views/access/list.vue"),
    meta: {
      title: "权限管理",
    },
  },
  {
    path: "/role/list",
    name: "/role/list",
    component: () => import("~/views/role/list.vue"),
    meta: {
      title: "角色管理",
    },
  },
  {
    path: "/skus/list",
    name: "/skus/list",
    component: () => import("~/views/skus/list.vue"),
    meta: {
      title: "规格管理",
    },
  },
  {
    path: "/level/list",
    name: "/level/list",
    component: () => import("~/views/level/list.vue"),
    meta: {
      title: "会员管理",
    },
  },
  {
    path: "/setting/buy",
    name: "/setting/buy",
    component: () => import("~/views/setting/buy.vue"),
    meta: {
      title: "交易管理",
    },
  },
  {
    path: "/setting/ship",
    name: "/setting/ship",
    component: () => import("~/views/setting/ship.vue"),
    meta: {
      title: "物流管理",
    },
  },

  {
    path: "/distribution/index",
    name: "/distribution/index",
    component: () => import("~/views/distribution/index.vue"),
    meta: {
      title: "分销员管理",
    },
  },

  {
    path: "/distribution/setting",
    name: "/distribution/setting",
    component: () => import("~/views/distribution/setting.vue"),
    meta: {
      title: "分销管理",
    },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 动态路由
export function addRoutes(menus) {
  let hasNewRouters = false;
  const findAddRoutersMenus = (arr) => {
    arr.forEach((e) => {
      const item = asyncRouter.find((o) => o.path == e.frontpath);
      if (item && !router.hasRoute(item.path)) {
        router.addRoute("admin", item);
        hasNewRouters = true;
      }
      if (e.child && e.child.length > 0) {
        findAddRoutersMenus(e.child);
      }
    });
  };
  findAddRoutersMenus(menus);

  return hasNewRouters;
}
