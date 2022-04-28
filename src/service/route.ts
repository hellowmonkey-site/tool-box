import { NumberBoolean } from "@/config/type";
import flyio from "flyio";

export interface IRoute {
  children?: IRoute[];
  id: number;
  is_menu: NumberBoolean;
  key: string;
  module_id?: number;
  name: string;
  parent_id: number;
  sort: number;
  url: string;
}

export const defaultRoute: IRoute = {
  is_menu: NumberBoolean.TRUE,
  key: "",
  parent_id: 0,
  sort: 0,
  name: "",
  url: "",
  module_id: undefined,
  id: 0,
};

// 获取父级路由列表
export const getRouterList = (parent_id = 0) => {
  return flyio.get<IRoute[]>("router", { parent_id }).then(data => data.data);
};

// 获取路由详情
export const getRouterDetail = (id: number) => {
  return flyio.get<IRoute>(`router/${id}`).then(data => data.data);
};

// 删除路由
export const deleteRouter = (id: number) => {
  return flyio.delete(`router/${id}`).then(data => data.data);
};

// 创建路由
export const postRouter = (params: IRoute) => {
  return flyio.post("router", params).then(data => data.data);
};

// 编辑路由
export const putRouter = ({ id, ...params }: IRoute) => {
  return flyio.put(`router/${id}`, params).then(data => data.data);
};

// 获取所有路由
export const getAllRouterList = () => {
  return flyio.get<IRoute[]>("router", {}).then(data => data.data);
};
