import { compressImage } from "@/helper/file";
import router, { indexName, routes } from "@/router";
import fly from "flyio";
import { reactive, ref } from "vue";
import { RouteLocationNormalizedLoaded, RouteRecordName } from "vue-router";

let timer: number;

export const defaultCompressImageOpts = { quality: 0.8, maxWidth: 1300, maxHeight: 1800, convertSize: 1024 * 1024 * 2 };

// 图片上传
export function uploadImage(file: File, compressImageOpts = defaultCompressImageOpts) {
  return compressImage(file, compressImageOpts).then(file => {
    const formData = new FormData();
    formData.append("file", file);
    return fly.post("common/upload", formData).then(data => data.data);
  });
}

// tabs
export const routeTabList = ref<RouteLocationNormalizedLoaded[]>([]);
export const pushRouteTab = (data: RouteLocationNormalizedLoaded) => {
  const otherRoutes = routes.filter(v => v.name !== "index");
  if (otherRoutes.some(v => v.name === data.name)) {
    return;
  }
  const index = routeTabList.value.findIndex(v => v.name === data.name);
  if (index > -1) {
    routeTabList.value[index] = data;
    return;
  }
  routeTabList.value.push(data);
};

export const removeRouteTab = (names: RouteRecordName | RouteRecordName[]) => {
  const routeName = router.currentRoute.value.name;
  if (routeName === indexName && routeTabList.value.length === 1) {
    return;
  }
  let arr: RouteRecordName[] = [];
  if (!Array.isArray(names)) {
    arr = [names];
  } else {
    arr = names;
  }
  routeTabList.value = routeTabList.value.filter(v => {
    if (v.name) {
      return !arr.includes(v.name);
    }
    return false;
  });
  if (routeName && arr.includes(routeName)) {
    let redirect = "/";
    if (routeTabList.value.length) {
      const last = routeTabList.value[routeTabList.value.length - 1]?.fullPath;
      if (last) {
        redirect = last;
      }
    }
    router.push(redirect);
  }
};

// spin
export const loadingState = reactive({
  loading: false,
  tip: "处理中...",
});
export const hideLoading = () => {
  clearTimeout(timer);
  loadingState.loading = false;
};
export const loading = (tip?: string) => {
  clearTimeout(timer);
  timer = setTimeout(hideLoading, 5000);
  loadingState.loading = true;
  loadingState.tip = tip || "处理中...";
  return hideLoading;
};
