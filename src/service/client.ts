import { NumberBoolean, StatusType } from "@/config/type";
import flyio from "flyio";

export interface IClient {
  extends: number[] | null;
  id: number;
  is_group: NumberBoolean;
  module: number[];
  name: string;
  parent_id: number;
  short_name: string;
  status: StatusType;
}

export const defaultClient: IClient = {
  is_group: NumberBoolean.FALSE,
  parent_id: 0,
  name: "",
  id: 0,
  extends: null,
  module: [],
  short_name: "",
  status: StatusType.ONLINE,
};

// 获取父级路由列表
export const getClientList = (parent_id = 0) => {
  return flyio.get<IClient[]>("client", { page: 1, row: 20 }).then(data => data.data);
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

// 获取所有路由
export const getAllClientList = () => {
  return flyio.get<IClient[]>("client", {}).then(data => data.data);
};
