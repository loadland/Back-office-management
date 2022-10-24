import { ref } from "vue";
// onBeforeRouteUpdate 路由更新前
import { useRoute, onBeforeRouteUpdate } from "vue-router";

import { SetTabList, GetTabList } from "~/composables/auth";
import { router } from "~/router";

export function useTabList() {
  const route = useRoute();

  const activeTab = ref(route.path);
  const tabList = ref([
    {
      title: "后台管理",
      path: "/index",
    },
  ]);

  // 移除标签页 点击标签上的×自动调用
  const removeTab = (t) => {
    // 点击删除之后获取到tabList，拿到当前所有的tab
    let tabs = tabList.value;
    // 获取到当前选中状态
    let a = activeTab.value;
    // 判断删除的是否与选中状态的一致
    if (a == t) {
      // 如果一致便利tabs 拿到每一个tab和他的index
      tabs.forEach((tab, index) => {
        // 判断删除的是否和tab中的路径一致
        if (tab.path == t) {
          // 如果一致，将tabs往前移动一格或者往后移动一格
          const nextTab = tabs[index + 1] || tabs[index - 1];
          // 判断是否存在
          if (nextTab) {
            // 将tabs的path赋值给a
            a = nextTab.path;
          }
        }
      });
    }
   
    // 再把a赋值给activeTab.value 移动高亮
    activeTab.value = a; // 当选中状态发生改变之后会自动调用发生改变后的回调，从而改变路由
    // 晒选 判断删除的path不等于tab.path就留下来
    tabList.value = tabList.value.filter((tab) => tab.path != t);
    // 更新cookies里的tabList
    SetTabList(tabList.value);
  };

  //  在路由更新前条用该函数
  function appTab(tab) {
    // 遍历tabList里面的值 判断tabList里面的path是否等于传递进来的path 如果== -1就是不存在，不存在就是true
    let noTab = tabList.value.findIndex((e) => e.path == tab.path) == -1;
    // 判断是否是true 如果是true的话证明不存在，就会往tabList里面添加title和path
    if (noTab) tabList.value.push(tab);
    // 保存到cookies里面
    SetTabList(tabList.value);
  }

  // 在路由更新前条用该函数
  onBeforeRouteUpdate((to, from) => {
    // 让tab的选中等于要到达的路由的path
    activeTab.value = to.path;

    // 在路由更新前调用并且把要去的路由的title和path传递过去
    appTab({
      title: to.meta.title,
      path: to.path,
    });
  });

  // 在tab选中状态发生改变之后触发
  const changeTab = (e) => {
    activeTab.value = e;
    router.replace(e);
  };

  // 初始化标签导航
  const initTabList = () => {
    const TabLists = GetTabList();
    if (TabLists) tabList.value = TabLists;
  };
  initTabList();

  // 关闭全部和其他标签页
  const TabListCommend = (e) => {
    if (e == "clearAll") {
      // 切换为首页
      activeTab.value = "/index";
      // 过滤只剩下首页
      tabList.value = [
        {
          title: "后台管理",
          path: "/index",
        },
      ];
    } else if ((e = "changeOther")) {
      // 过滤只剩下首页和当前激活
      tabList.value = tabList.value.filter(
        (tab) => tab.path == "/index" || tab.path == activeTab.value
      );
    }
    // 更新cookies里的tabList
    SetTabList(tabList.value);
  };

  return {
    activeTab,
    tabList,
    removeTab,
    changeTab,
    TabListCommend,
    initTabList,
  };
}
