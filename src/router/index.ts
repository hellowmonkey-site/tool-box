import NProgress from "nprogress";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Index from "@/layout/Index";
import { filterParams, putStyle } from "@/helper";
import { setTitle, themeOverrides } from "@/service/common";

NProgress.inc(0.2);
NProgress.configure({ easing: "ease", speed: 500, showSpinner: false });

export const menuRoutes: RouteRecordRaw[] = [
  {
    path: "image/compress",
    name: "image-compress",
    meta: {
      title: "图片压缩",
    },
    component: () => import("@/page/image/compress"),
  },
  {
    path: "image/clip",
    name: "image-clip",
    meta: {
      title: "图片裁剪",
    },
    component: () => import("@/page/image/clip"),
  },
  {
    path: "image/watermark",
    name: "image-watermark",
    meta: {
      title: "图片加水印",
    },
    component: () => import("@/page/image/watermark"),
  },
  {
    path: "image/ico",
    name: "image-ico",
    meta: {
      title: "ico生成",
    },
    component: () => import("@/page/image/ico"),
  },
  {
    path: "video/m3u8",
    name: "video-m3u8",
    meta: {
      title: "m3u8下载",
    },
    component: () => import("@/page/video/m3u8"),
  },
  {
    path: "video/parse",
    name: "video-parse",
    meta: {
      title: "视频在线解析",
    },
    component: () => import("@/page/video/parse"),
  },
  {
    path: "developer/javascript",
    name: "developer-javascript",
    meta: {
      title: "javascript",
    },
    component: () => import("@/page/developer/javascript"),
  },
  {
    path: "developer/babel",
    name: "developer-babel",
    meta: {
      title: "babel编译",
    },
    component: () => import("@/page/developer/babel"),
  },
  {
    path: "developer/typescript",
    name: "developer-typescript",
    meta: {
      title: "typescript编译",
    },
    component: () => import("@/page/developer/typescript"),
  },
  {
    path: "developer/css",
    name: "developer-css",
    meta: {
      title: "css",
    },
    component: () => import("@/page/developer/css"),
  },
  {
    path: "qrcode/create",
    name: "qrcode-create",
    meta: {
      title: "生成二维码",
    },
    component: () => import("@/page/qrcode/create"),
  },
  {
    path: "qrcode/decode",
    name: "qrcode-decode",
    meta: {
      title: "解析二维码",
    },
    component: () => import("@/page/qrcode/decode"),
  },
  {
    path: "util/num-money",
    name: "util-num-money",
    meta: {
      title: "数字转大写金额",
    },
    component: () => import("@/page/util/num-money"),
  },
  {
    path: "util/timestamp",
    name: "util-timestamp",
    meta: {
      title: "时间戳转换",
    },
    component: () => import("@/page/util/timestamp"),
  },
];

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "index",
    component: Index,
    redirect: () => {
      return {
        name: menuRoutes[0].name,
      };
    },
    children: menuRoutes,
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: () => import("@/page/error/404") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(to => {
  // 设置body样式
  const style = putStyle({ "--primary-color": themeOverrides.value.common?.primaryColor });
  document.body.setAttribute("style", style);

  // 参数过滤
  filterParams(to.query);
  filterParams(to.params);

  NProgress.done().start();

  setTitle(String(to.meta.title || ""));

  return true;
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
