import fly from "flyio";
import { ref } from "vue";

export interface IBananer {
  id: number;
  name: string;
  img_path: string | number;
  url?: string;
  status?: number;
  img_id?: number | string;
}

export const defaultBanner: IBananer = {
  id: 0,
  name: "",
  img_path: "",
  status: 0,
  url: "",
};

export const bannerList = ref<IBananer[]>([]);

// 获取banner列表
export function getBannerList() {
  return fly
    .get<IBananer[]>("admin/banners")
    .then(data => data.data)
    .then(data => {
      bannerList.value = data;
      return data;
    });
}

// 获取banner详情
export function getBannerDetail(id: number) {
  return fly.get<IBananer>(`admin/banners/${id}`).then(data => data.data);
}

// 删除banner
export const deleteBanner = (id: number) => {
  return fly.delete(`admin/banners/${id}`).then(data => data.data);
};

// 创建banner
export const postBanner = (params: IBananer) => {
  return fly.post("admin/banners", params).then(data => data.data);
};

// 编辑banner
export const putBanner = ({ id, ...params }: IBananer) => {
  return fly.put(`admin/banners/${id}`, params).then(data => data.data);
};
