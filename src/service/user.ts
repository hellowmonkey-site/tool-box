import storage from "@/helper/storage";
import flyio from "flyio";
import { computed, reactive, ref } from "vue";
import { IRoute } from "./route";

export interface IUser {
  id: number;
  username: string;
}

export interface IUserInfo {
  info: IUser;
  route_tree: IRoute[];
  permissions: string[];
  route: string[];
}
export interface IUserLogin extends IUserInfo {
  token: string;
}

const token: string = storage.get("token") as string;
export const userToken = ref<string>(token || "");
export const userInfo = reactive<IUser>({
  id: 0,
  username: "",
});
export const userRoutes = ref<string[]>([]);
export const userHandles = ref<string[]>([]);
export const userMenus = ref<IRoute[]>([]);

export const requestHeaders = computed(() => ({
  appid: 1,
  Authorization: userToken.value ? `Bearer ${userToken.value}` : "",
}));

export function setUserToken(data: string) {
  userToken.value = data;
  storage.set("token", data);
}

export function setUserInfo(params: IUserInfo) {
  userInfo.id = params.info.id;
  userInfo.username = params.info.username;
  userRoutes.value = params.route || [];
  userMenus.value = params.route_tree || [];
  userHandles.value = params.permissions || [];
}

// 登录
export const postLogin = (params: any) => {
  return flyio
    .post<IUserLogin>("login", params)
    .then(data => data.data)
    .then(data => {
      const { token, ...params } = data;
      setUserToken(token);
      setUserInfo(params);
      return data;
    });
};

// 获取用户信息
export const getUserInfo = () => {
  return flyio
    .get<IUserInfo>("managerInfo")
    .then(data => data.data)
    .then(data => {
      setUserInfo(data);
      return data;
    });
};
