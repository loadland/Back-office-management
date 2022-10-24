import { reactive, ref } from "vue";
// toast 提示框
import { toast } from "~/composables/util";
// 修改密码请求
import { updatedPassword } from "~/api/manager";
// vuex
import { useStore } from "vuex";
// 蒙版的选择后的提示框
import { ElMessage } from "element-plus";
// toast 提示框 showModal 蒙版
import { showModal } from "~/composables/util";

// form表单封装函数
export function useRepassword() {
  // vuex
  const store = useStore();
  // 双向绑定保存input的内容
  const account = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
  });
  //配置input使用的规则
  const rules = {
    oldpassword: [
      // required 设置为必传  message：设置提示语  trigger：在失去焦点后在进行判断
      { required: true, message: "密码不能为空", trigger: "blur" },
      // pattern：配置正则
      { pattern: /^[a-z0-9]{5,10}$/, message: "password err", trigger: "blur" },
    ],
    password: [
      { required: true, message: "新密码不能为空", trigger: "blur" },
      { pattern: /^[a-z0-9]{5,10}$/, message: "password err", trigger: "blur" },
    ],
    repassword: [
      {
        required: true,
        message: "不能为空，并且要与新密码保持一致",
        trigger: "blur",
      },
      { pattern: /^[a-z0-9]{5,10}$/, message: "password err", trigger: "blur" },
    ],
  };
  // 拿到el-form表单的内容
  const formRef = ref(null);
  const loading = ref(false);
  // 修改密码
  const onSubmit = () => {
    formRef.value.validate((valid) => {
      if (valid) {
        loading.value = true;
        updatedPassword(account)
          .then(() => {
            toast("要走了吗燕子~", "一定要回来啊燕子!");
            // 退出登录
            store.dispatch("SetLogout");
          })
          .finally(() => {
            loading.value = false;
          });
      }
    });
  };

  return {
    account,
    rules,
    onSubmit,
    formRef,
    loading,
  };
}

// 退出登录
export function useLogout() {
  // vuex
  const store = useStore();
  // 退出登录
  const logout = () => {
    // 蒙版
    showModal(
      "真的要离开了吗燕子?",
      "Warning",
      "嗯",
      "骗你的啦，哈哈",
      "warning"
    )
      .then(() => {
        // 退出登录
        store.dispatch("SetLogout");
        ElMessage({
          type: "success",
          message: "燕子，你一定要健康，一定要幸福",
        });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "就知道你不舍得离开我",
        });
      });
  };
  return {
    logout,
  };
}
