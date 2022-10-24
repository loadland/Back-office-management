import { useCookies } from "@vueuse/integrations/useCookies";

const Token = "token";
const cookies = useCookies();

export function setToken(token) {
  return cookies.set(Token, token);
}

export function getToken() {
  return cookies.get(Token);
}

export function removeToken() {
  return cookies.remove(Token);
}

// 验证记住密码
export function setUsername(account) {
  return cookies.set("account", account);
}
export function setPassword(password) {
  return cookies.set("password", password);
}
export function getUsername() {
  return cookies.get("account");
}
export function getPassword() {
  return cookies.get("password");
}
export function removeUsername() {
  return cookies.remove("account");
}
export function removePassword() {
  return cookies.remove("password");
}

// tab栏
export function SetTabList(tabList) {
  return cookies.set("tabList", tabList);
}
export function GetTabList() {
  return cookies.get("tabList");
}
