import { NumberBoolean } from "@/config/type";
import flyio from "flyio";

export interface IRoute {
  children?: IRoute[];
  deep: NumberBoolean;
  id: number;
  is_menu: NumberBoolean;
  key: string;
  parent_id: number;
  sort: number;
  name: string;
  url: string;
  module_id: string;
  title: string | undefined;
}

export const defaultRoute: IRoute = {
  deep: 0,
  is_menu: 1,
  key: "",
  parent_id: 0,
  sort: 0,
  name: "",
  url: "",
  module_id: "0",
  id: 0,
  title: "",
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
