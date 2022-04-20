import { RouteRecordRaw } from "vue-router";

const systemRoutes: RouteRecordRaw[] = [
  {
    name: "system-route-index",
    path: "/system/route",
    meta: {
      title: "页面设置",
    },
    component: () => import("@/page/system/route"),
  },
  {
    name: "system-route-add",
    path: "/system/route/add",
    meta: {
      title: "添加页面",
      keepAlive: true,
    },
    component: () => import("@/page/system/route-detail"),
  },
  {
    name: "system-route-edit",
    path: "/system/route/:id(\\d+)",
    props: true,
    meta: {
      title: "页面编辑",
      keepAlive: true,
    },
    component: () => import("@/page/system/route-detail"),
  },
  {
    name: "system-role-index",
    path: "/system/role",
    meta: {
      title: "角色设置",
    },
    component: () => import("@/page/system/role"),
  },
  {
    name: "system-role-add",
    path: "/system/role/add",
    meta: {
      title: "添加角色",
      keepAlive: true,
    },
    component: () => import("@/page/system/role-detail"),
  },
  {
    name: "system-role-edit",
    path: "/system/role/:id(\\d+)",
    props: true,
    meta: {
      title: "角色编辑",
      keepAlive: true,
    },
    component: () => import("@/page/system/role-detail"),
  },
  {
    name: "system-admin-index",
    path: "/system/admin",
    meta: {
      title: "用户设置",
    },
    component: () => import("@/page/system/admin"),
  },
  {
    name: "system-admin-add",
    path: "/system/admin/add",
    meta: {
      title: "添加用户",
      keepAlive: true,
    },
    component: () => import("@/page/system/admin-detail"),
  },
  {
    name: "system-admin-edit",
    path: "/system/admin/:id(\\d+)",
    props: true,
    meta: {
      title: "用户编辑",
      keepAlive: true,
    },
    component: () => import("@/page/system/admin-detail"),
  },
  {
    name: "system-banner",
    path: "/system/banner",
    meta: {
      title: "幻灯设置",
    },
    component: () => import("@/page/system/banner"),
  },
  {
    name: "system-banner-add",
    path: "/system/banner/add",
    meta: {
      title: "添加幻灯",
      keepAlive: true,
    },
    component: () => import("@/page/system/banner-detail"),
  },
  {
    name: "system-banner-edit",
    path: "/system/banner/:id(\\d+)",
    props: true,
    meta: {
      title: "幻灯编辑",
      keepAlive: true,
    },
    component: () => import("@/page/system/banner-detail"),
  },
  {
    name: "system-module-index",
    path: "/system/module",
    meta: {
      title: "模块设置",
    },
    component: () => import("@/page/system/module"),
  },
  {
    name: "system-module-add",
    path: "/system/module/add",
    meta: {
      title: "添加模块",
      keepAlive: true,
    },
    component: () => import("@/page/system/module-detail"),
  },
  {
    name: "system-module-edit",
    path: "/system/module/:id(\\d+)",
    props: true,
    meta: {
      title: "模块编辑",
      keepAlive: true,
    },
    component: () => import("@/page/system/module-detail"),
  },
  {
    name: "system-permission-index",
    path: "/system/permission",
    meta: {
      title: "权限设置",
    },
    component: () => import("@/page/system/permission"),
  },
  {
    name: "system-permission-add",
    path: "/system/permission/add",
    meta: {
      title: "添加权限",
      keepAlive: true,
    },
    component: () => import("@/page/system/permission-detail"),
  },
  {
    name: "system-permission-edit",
    path: "/system/permission/:id(\\d+)",
    props: true,
    meta: {
      title: "权限编辑",
      keepAlive: true,
    },
    component: () => import("@/page/system/permission-detail"),
  },
  {
    name: "system-app-index",
    path: "/system/app",
    meta: {
      title: "APP设置",
    },
    component: () => import("@/page/system/app"),
  },
  {
    name: "system-app-add",
    path: "/system/app/add",
    meta: {
      title: "添加APP",
      keepAlive: true,
    },
    component: () => import("@/page/system/app-detail"),
  },
  {
    name: "system-app-edit",
    path: "/system/app/:id(\\d+)",
    props: true,
    meta: {
      title: "APP编辑",
      keepAlive: true,
    },
    component: () => import("@/page/system/app-detail"),
  },
];
export default systemRoutes;
