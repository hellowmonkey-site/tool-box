import fly from "flyio";

export interface INetAddress {
  id: number;
  name: string;
  address: string;
  long: string;
  lat: string;
  status?: number;
}

export const defaultNetAddress: INetAddress = {
  id: 0,
  name: "",
  long: "",
  lat: "",
  address: "",
  status: 0,
};

export interface INetAddressSearch {
  row: number;
  page: number;
  name?: string;
  start_time?: string;
  end_time?: string;
}

export const defaultNetAddressSearch: INetAddressSearch = {
  row: 20,
  page: 1,
  name: "",
  start_time: "",
  end_time: "",
};

export interface INetAddressData {
  page: number;
  page_count: number;
  per_page: number;
  total: number;
  totals: number;
  items: INetAddress[];
}

export const defaultNetAddressData: INetAddressData = {
  page: 0,
  page_count: 0,
  per_page: 0,
  total: 0,
  totals: 0,
  items: [],
};

// 获取服务网点列表
export const getNetAddressList = ({ ...params }: INetAddressSearch) => {
  return fly.get<INetAddressData>("netAddress", params).then(data => data.data);
};

// 获取服务网点详情
export const getNetAddressDetail = (id: number) => {
  return fly.get<INetAddress>(`netAddress/${id}`).then(data => data.data);
};

// 删除服务网点
export const deleteNetAddress = (id: number) => {
  return fly.delete(`netAddress/${id}`).then(data => data.data);
};

// 创建服务网点
export const postNetAddress = (params: INetAddress) => {
  return fly.post("netAddress", params).then(data => data.data);
};

// 编辑服务网点
export const putNetAddress = ({ id, ...params }: INetAddress) => {
  return fly.put(`netAddress/${id}`, params).then(data => data.data);
};
