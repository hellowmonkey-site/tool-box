import { NumberBoolean, PageData, StorageType } from "@/config/type";
import fly from "flyio";
import { IRole } from "./role";

export interface IManager {
  username: string;
  roles: IRole[];
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
  avatar?: StorageType | null;
  nickname?: string;
  remark?: string;
  password?: string;
  client_id?: number;
  role: number[];
}

export const defaultManager: IManagerInput = {
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
export function getManagerPageList(params = {}) {
  return fly.get<PageData<IManager>>("manager", params).then(data => data.data);
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
export const postManager = (params: IManagerInput) => {
  return fly.post("manager", { ...params, avatar: params.avatar?.id }).then(data => data.data);
};

// 编辑角色
export const putManager = ({ id, ...params }: IManagerInput) => {
  return fly.put(`manager/${id}`, params).then(data => data.data);
};
