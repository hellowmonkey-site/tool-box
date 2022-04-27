import fly from "flyio";
import { ref } from "vue";

export interface IApp {
  id: number;
  name: string;
  app_key?: string;
  secret_key?: string;
  status?: number;
}

export const defaultApp: IApp = {
  id: 0,
  name: "",
};

export const appList = ref<IApp[]>([]);

// 获取App列表
export function getAppList() {
  return fly
    .get<IApp[]>("app")
    .then(data => data.data)
    .then(data => {
      appList.value = data;
      return data;
    });
}

// 获取App详情
export function getAppDetail(id: number) {
  return fly.get<IApp>(`app/${id}`).then(data => data.data);
}

// 删除App
export const deleteApp = (id: number) => {
  return fly.delete(`app/${id}`).then(data => data.data);
};

// 创建App
export const postApp = (params: IApp) => {
  return fly.post("app", params).then(data => data.data);
};

// 编辑App
export const putApp = ({ id, ...params }: IApp) => {
  return fly.put(`app/${id}`, params).then(data => data.data);
};
