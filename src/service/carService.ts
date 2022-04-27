import flyio from "flyio";

export interface ICarService {
  id: number;
  name: string;
  img_path: string | number;
  status: number;
  url: string;
  img_id: number | string;
}

export const defaultCarService: ICarService = {
  id: 0,
  name: "",
  img_path: "",
  status: 0,
  url: "",
  img_id: 0,
};

export interface ICarServiceSearch {
  row: number;
  page: number;
  name?: string;
  start_time?: string;
  end_time?: string;
}

export const defaultCarServiceSearch: ICarServiceSearch = {
  row: 20,
  page: 1,
  name: "",
  start_time: "",
  end_time: "",
};

export interface ICarServiceData {
  page: number;
  page_count: number;
  per_page: number;
  total: number;
  totals: number;
  items: ICarService[];
}

export const defaultCarServiceData: ICarServiceData = {
  page: 0,
  page_count: 0,
  per_page: 0,
  total: 0,
  totals: 0,
  items: [],
};

// 获取增值服务列表
export const getCarServiceList = ({ ...params }: ICarServiceSearch) => {
  return flyio.get<ICarServiceData>("carService", params).then(data => data.data);
};

// 获取增值服务详情详情
export const getCarServiceDetail = (id: number) => {
  return flyio.get<ICarService>(`carService/${id}`).then(data => data.data);
};

// 删除增值服务
export const deleteCarService = (id: number) => {
  return flyio.delete(`carService/${id}`).then(data => data.data);
};

// 创建增值服务
export const postCarService = (params: ICarService) => {
  return flyio.post("carService", params).then(data => data.data);
};

// 编辑增值服务
export const putCarService = ({ id, ...params }: ICarService) => {
  return flyio.put(`carService/${id}`, params).then(data => data.data);
};
