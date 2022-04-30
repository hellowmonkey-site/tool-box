const isDev = import.meta.env.DEV;
const isElectron = typeof electronAPI !== "undefined";

export default {
  isDev,
  isElectron,
  baseURL: "http://test.guoyuan.insure.api.cheqianqiu.net/admin",
  successCode: 200,
  loginCode: 10000,
  amapKey: "31ea0f5bf198afa8e730a0b53bc0e41d",
  title: "检测站管理系统",
  timeout: 5 * 1000,
};
