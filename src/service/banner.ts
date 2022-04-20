import fly from "flyio";
import { ref } from "vue";

export interface IBananer {
  id: number;
  title: string;
}

export const defaultBanner: IBananer = {
  id: 0,
  title: "",
};

export const bannerList = ref<IBananer[]>([]);

// 获取banner列表
export function getBannerList() {
  return fly
    .get<IBananer[]>("admin/banner")
    .then(data => data.data)
    .then(data => {
      bannerList.value = data;
      return data;
    });
}

// 获取banner详情
export function getBannerDetail(id: number) {
  return fly.get<IBananer>(`admin/banner/${id}`).then(data => data.data);
}

// 删除banner
export const deleteBanner = (id: number) => {
  return fly.delete(`admin/banner/${id}`).then(data => data.data);
};

// 创建banner
export const postBanner = (params: IBananer) => {
  return fly.post("admin/banner", params).then(data => data.data);
};

// 编辑banner
export const putBanner = ({ id, ...params }: IBananer) => {
  return fly.put(`admin/banner/${id}`, params).then(data => data.data);
};
