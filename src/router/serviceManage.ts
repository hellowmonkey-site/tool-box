import { RouteRecordRaw } from "vue-router";

const serviceRoutes: RouteRecordRaw[] = [
  {
    name: "service-carService-index",
    path: "/serviceManage/carService",
    meta: {
      title: "增值服务列表",
    },
    component: () => import("@/page/serviceManage/carService"),
  },
  {
    name: "service-carService-add",
    path: "/serviceManage/carService/add",
    meta: {
      title: "添加增值服务",
      keepAlive: true,
    },
    component: () => import("@/page/serviceManage/carService-detail"),
  },
  {
    name: "service-carService-edit",
    path: "/serviceManage/carService/:id(\\d+)",
    props: true,
    meta: {
      title: "增值服务编辑",
      keepAlive: true,
    },
    component: () => import("@/page/serviceManage/carService-detail"),
  },
  {
    name: "service-coupon-index",
    path: "/serviceManage/coupon",
    meta: {
      title: "增值券列表",
    },
    component: () => import("@/page/serviceManage/coupon"),
  },
  {
    name: "service-giftBag-index",
    path: "/serviceManage/giftBag",
    meta: {
      title: "增值礼包列表",
    },
    component: () => import("@/page/serviceManage/giftBag"),
  },
  {
    name: "service-giftBag-add",
    path: "/serviceManage/giftBag/add",
    meta: {
      title: "添加礼包服务",
      keepAlive: true,
    },
    component: () => import("@/page/serviceManage/giftBag-detail"),
  },
  {
    name: "service-giftBag-edit",
    path: "/serviceManage/giftBag/:id(\\d+)",
    props: true,
    meta: {
      title: "增值礼包编辑",
      keepAlive: true,
    },
    component: () => import("@/page/serviceManage/giftBag-detail"),
  },
];
export default serviceRoutes;
