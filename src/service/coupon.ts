import flyio from "flyio";

export interface ICoupon {
  id: number;
  name: string;
}

export const defaultCoupon: ICoupon = {
  id: 0,
  name: "",
};

export interface ICouponSearch {
  row: number;
  page: number;
  name?: string;
}

export const defaultCouponSearch: ICouponSearch = {
  row: 20,
  page: 1,
  name: "",
};

export interface ICouponData {
  page: number;
  page_count: number;
  per_page: number;
  total: number;
  totals: number;
  items: ICoupon[];
}

export const defaultCouponData: ICouponData = {
  page: 0,
  page_count: 0,
  per_page: 0,
  total: 0,
  totals: 0,
  items: [],
};

// 获取增值券列表
export const getCouponList = ({ ...params }: ICouponSearch) => {
  return flyio.get<ICouponData>("admin/coupon", params).then(data => data.data);
};

// 获取增值券列表  不分页
export const getAllCouponList = () => {
  return flyio.get<ICoupon[]>("admin/couponList").then(data => data.data);
};
