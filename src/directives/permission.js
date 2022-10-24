import store from "~/store";

function hasPermission(el = false, value) {
  // 判断传来的参数是否是Array类型
  if (!Array.isArray(value)) {
    // 如果不是，报错并提醒
    throw new Error("v-permission value needs to be passed in an array");
  }
  // 是的话，就是用findIndex方法判断
  const hasAuth =
    // 给vuex里保存的权限数组ruleNames使用includes方法在里面找用户传来的value看看当前用户是否有权限访问当前组件/元素
    // 如果找不到就返回false 找得到就返回true
    value.findIndex((v) => store.state.ruleNames.includes(v)) != -1;
  //判断如果组件存在并且还在当前用户权限数组里面找不到该组件的权限就移除当前元素/数组
  if (el && !hasAuth) {
    // 拿到当前元素的父组件 并且 让父组件移除当前组件
    el.parentNode && el.parentNode.removeChild(el);
  }
  // 返回判断返回的结果
  return hasAuth;
}

// 权限配置类
export default {
  install(app) {
    // 调用app的directive方法创建自定义指令
    app.directive("permission", {
      // 在元素/组件挂载后拿到元素本身和自定义指令传来的参数
      mounted(el, binding) {
        //在组件挂载之后调用该方法，判断当前用户是否，有指定权限，来访问当前组件/元素
        hasPermission(el, binding.value);
      },
    });
  },
};
