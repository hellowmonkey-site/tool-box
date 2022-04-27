import { NumberBoolean } from "@/config/type";
import fly from "flyio";
import { ref } from "vue";

export interface IModule {
  id: number;
  status?: NumberBoolean;
  sort: number;
  title: string;
}

export const defaultModule: IModule = {
  id: 0,
  title: "",
  status: 1,
  sort: 0,
};

export const moduleList = ref<IModule[]>([]);

// 获取模块列表
export function getModuleList() {
  return fly
    .get<IModule[]>("module")
    .then(data => data.data)
    .then(data => {
      moduleList.value = data;
      return data;
    });
}

// 获取模块详情
export function getModuleDetail(id: number) {
  return fly.get<IModule>(`module/${id}`).then(data => data.data);
}

// 删除模块
export const deleteModule = (id: number) => {
  return fly.delete(`module/${id}`).then(data => data.data);
};

// 创建模块
export const postModule = (params: IModule) => {
  return fly.post("module", params).then(data => data.data);
};

// 编辑角色
export const putModule = ({ id, ...params }: IModule) => {
  return fly.put(`module/${id}`, params).then(data => data.data);
};
