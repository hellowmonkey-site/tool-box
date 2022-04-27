import flyio from "flyio";

export interface IGiftBag {
  id: number;
  name: string;
  status?: number;
  price: number;
  start_money: number;
  end_money: number;
  coupon: Array<string>;
}

export const defaultGiftBag: IGiftBag = {
  id: 0,
  name: "",
  status: 0,
  price: 0,
  start_money: 0,
  end_money: 0,
  coupon: [],
};

export interface IGiftBagSearch {
  row: number;
  page: number;
  name?: string;
  start_time?: string;
  end_time?: string;
}

export const defaultGiftBagSearch: IGiftBagSearch = {
  row: 20,
  page: 1,
  name: "",
  start_time: "",
  end_time: "",
};

export interface IGiftBagData {
  page: number;
  page_count: number;
  per_page: number;
  total: number;
  totals: number;
  items: IGiftBag[];
}

export const defaultGiftBagData: IGiftBagData = {
  page: 0,
  page_count: 0,
  per_page: 0,
  total: 0,
  totals: 0,
  items: [],
};

// 获取增值礼包列表
export const getGiftBagList = ({ ...params }: IGiftBagSearch) => {
  return flyio.get<IGiftBagData>("giftBag", params).then(data => data.data);
};

// 获取增值礼包详情
export const getGiftBagDetail = (id: number) => {
  return flyio.get<IGiftBag>(`giftBag/${id}`).then(data => data.data);
};

// 删除增值礼包
export const deleteGiftBag = (id: number) => {
  return flyio.delete(`giftBag/${id}`).then(data => data.data);
};

// 创建增值礼包
export const postGiftBag = (params: IGiftBag) => {
  return flyio.post("giftBag", params).then(data => data.data);
};

// 编辑增值礼包
export const putGiftBag = ({ id, ...params }: IGiftBag) => {
  return flyio.put(`giftBag/${id}`, params).then(data => data.data);
};
