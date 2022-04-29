import { NumberBoolean, PageData, StatusType } from "@/config/type";
import flyio from "flyio";

export interface IClient {
  created_at: string;
  deleted_at: string | null;
  id: number;
  is_group: NumberBoolean;
  modules: number[];
  name: string;
  parent_id: number;
  short_name: string;
  status: StatusType;
  updated_at: string | null;
}

export const defaultClient: IClient = {
  is_group: NumberBoolean.FALSE,
  parent_id: 0,
  name: "",
  id: 0,
  modules: [],
  short_name: "",
  status: StatusType.ONLINE,
  updated_at: null,
  created_at: "",
  deleted_at: null,
};

// 获取父级路由列表
export const getClientPageList = (params = {}) => {
  return flyio.get<PageData<IClient>>("client", params).then(data => data.data);
};

// 获取路由详情
export const getClientDetail = (id: number) => {
  return flyio.get<IClient>(`client/${id}`).then(data => data.data);
};

// 删除路由
export const deleteClient = (id: number) => {
  return flyio.delete(`client/${id}`).then(data => data.data);
};

// 创建路由
export const postClient = (params: IClient) => {
  return flyio.post("client", params).then(data => data.data);
};

// 编辑路由
export const putClient = ({ id, ...params }: IClient) => {
  return flyio.put(`client/${id}`, params).then(data => data.data);
};
