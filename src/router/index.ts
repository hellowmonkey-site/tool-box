import NProgress from "nprogress";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Index from "@/layout/Index";
import { filterParams, putStyle } from "@/helper";
import { setTitle, themeOverrides, visitedPageNum } from "@/service/common";

NProgress.inc(0.2);
NProgress.configure({ easing: "ease", speed: 500, showSpinner: false });

export const menuRoutes: RouteRecordRaw[] = [
  {
    path: "image/compress",
    name: "image-compress",
    meta: {
      title: "图片压缩",
      electron: true,
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
      electron: true,
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
    path: "developer/regex",
    name: "developer-regex",
    meta: {
      title: "常用正则",
    },
    component: () => import("@/page/developer/regex"),
  },
  {
    path: "developer/translate",
    name: "developer-translate",
    meta: {
      title: "程序变量命名",
      electron: true,
    },
    component: () => import("@/page/developer/translate"),
  },
  // {
  //   path: "developer/javascript",
  //   name: "developer-javascript",
  //   meta: {
  //     title: "javascript",
  //   },
  //   component: () => import("@/page/developer/javascript"),
  // },
  // {
  //   path: "developer/babel",
  //   name: "developer-babel",
  //   meta: {
  //     title: "babel编译",
  //   },
  //   component: () => import("@/page/developer/babel"),
  // },
  // {
  //   path: "developer/typescript",
  //   name: "developer-typescript",
  //   meta: {
  //     title: "typescript编译",
  //   },
  //   component: () => import("@/page/developer/typescript"),
  // },
  // {
  //   path: "developer/css",
  //   name: "developer-css",
  //   meta: {
  //     title: "css",
  //   },
  //   component: () => import("@/page/developer/css"),
  // },
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
    path: "util/timestamp-date",
    name: "util-timestamp-date",
    meta: {
      title: "时间戳转日期",
    },
    component: () => import("@/page/util/timestamp-date"),
  },
  {
    path: "util/date-timestamp",
    name: "util-date-timestamp",
    meta: {
      title: "日期转时间戳",
    },
    component: () => import("@/page/util/date-timestamp"),
  },
];

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "app",
    component: Index,
    redirect: () => {
      return {
        name: "index",
      };
    },
    children: [
      {
        path: "",
        name: "index",
        meta: {},
        component: () => import("@/page/index"),
      },
      ...menuRoutes,
    ],
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

  setTitle(to.meta.title as string);

  return true;
});

const initHistoryLen = history.length;
router.afterEach(() => {
  visitedPageNum.value = history.length - initHistoryLen;
  NProgress.done();
});

export default router;
