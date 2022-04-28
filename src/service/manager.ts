import { NumberBoolean, StorageType } from "@/config/type";
import fly from "flyio";
import { IRole } from "./role";

export interface IManager {
  username: string;
  role: IRole[];
  id: number;
  status?: NumberBoolean;
  home_url?: string;
  avatar?: StorageType | null;
  nickname?: string;
  remark?: string;
  password?: string;
  client_id?: number;
}

export interface IManagerInput {
  id?: number;
  username: string;
  home_url?: string;
  avatar?: string;
  nickname?: string;
  remark?: string;
  password?: string;
  client_id?: number;
  role: number[];
}

export const defaultManager: IManager = {
  id: 0,
  username: "",
  home_url: "",
  avatar: null,
  nickname: "",
  remark: "",
  password: "",
  client_id: 0,
  role: [],
};

// 获取角色列表
export function getManagerList() {
  return fly.get<IManager[]>("manager").then(data => data.data);
}

// 获取角色详情
export function getManagerDetail(id: number) {
  return fly.get<IManager>(`manager/${id}`).then(data => data.data);
}

// 删除角色
export const deleteManager = (id: number) => {
  return fly.delete(`manager/${id}`).then(data => data.data);
};

// 创建角色
export const postManager = (params: IManager) => {
  return fly.post("manager", params).then(data => data.data);
};

// 编辑角色
export const putManager = ({ id, ...params }: IManager) => {
  return fly.put(`manager/${id}`, params).then(data => data.data);
};
