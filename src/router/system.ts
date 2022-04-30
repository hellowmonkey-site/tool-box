import { RouteRecordRaw } from "vue-router";

const systemRoutes: RouteRecordRaw[] = [
  {
    name: "system-route-index",
    path: "/system/route",
    meta: {
      title: "页面设置",
      keepAlive: true,
    },
    component: () => import("@/page/system/route"),
  },
  {
    name: "system-route-add",
    path: "/system/route/add",
    meta: {
      keepAlive: true,
      title: "添加页面",
    },
    component: () => import("@/page/system/route-detail"),
  },
  {
    name: "system-route-edit",
    path: "/system/route/:id(\\d+)",
    props: true,
    meta: {
      title: "页面编辑",
    },
    component: () => import("@/page/system/route-detail"),
  },
  {
    name: "system-role-index",
    path: "/system/role",
    meta: {
      title: "角色设置",
      keepAlive: true,
    },
    component: () => import("@/page/system/role"),
  },
  {
    name: "system-role-add",
    path: "/system/role/add",
    meta: { keepAlive: true, title: "添加角色" },
    component: () => import("@/page/system/role-detail"),
  },
  {
    name: "system-role-edit",
    path: "/system/role/:id(\\d+)",
    props: true,
    meta: {
      title: "角色编辑",
    },
    component: () => import("@/page/system/role-detail"),
  },
  {
    name: "system-manager-index",
    path: "/system/manager",
    meta: {
      title: "员工设置",
      keepAlive: true,
    },
    component: () => import("@/page/system/manager"),
  },
  {
    name: "system-manager-add",
    path: "/system/manager/add",
    meta: { keepAlive: true, title: "添加员工" },
    component: () => import("@/page/system/manager-detail"),
  },
  {
    name: "system-manager-edit",
    path: "/system/manager/:id(\\d+)",
    props: true,
    meta: {
      title: "员工编辑",
    },
    component: () => import("@/page/system/manager-detail"),
  },
  {
    name: "system-module-index",
    path: "/system/module",
    meta: {
      title: "模块设置",
      keepAlive: true,
    },
    component: () => import("@/page/system/module"),
  },
  {
    name: "system-module-add",
    path: "/system/module/add",
    meta: { keepAlive: true, title: "添加模块" },
    component: () => import("@/page/system/module-detail"),
  },
  {
    name: "system-module-edit",
    path: "/system/module/:id(\\d+)",
    props: true,
    meta: {
      title: "模块编辑",
    },
    component: () => import("@/page/system/module-detail"),
  },
  {
    name: "system-permission-index",
    path: "/system/permission",
    meta: {
      title: "权限设置",
      keepAlive: true,
    },
    component: () => import("@/page/system/permission"),
  },
  {
    name: "system-permission-add",
    path: "/system/permission/add",
    meta: { keepAlive: true, title: "添加权限" },
    component: () => import("@/page/system/permission-detail"),
  },
  {
    name: "system-permission-edit",
    path: "/system/permission/:id(\\d+)",
    props: true,
    meta: {
      title: "权限编辑",
    },
    component: () => import("@/page/system/permission-detail"),
  },
  {
    name: "system-app-index",
    path: "/system/app",
    meta: {
      title: "APP设置",
      keepAlive: true,
    },
    component: () => import("@/page/system/app"),
  },
  {
    name: "system-app-add",
    path: "/system/app/add",
    meta: { keepAlive: true, title: "添加APP" },
    component: () => import("@/page/system/app-detail"),
  },
  {
    name: "system-app-edit",
    path: "/system/app/:id(\\d+)",
    props: true,
    meta: {
      title: "APP编辑",
    },
    component: () => import("@/page/system/app-detail"),
  },
  {
    name: "system-client-index",
    path: "/system/client",
    meta: {
      title: "商家设置",
      keepAlive: true,
    },
    component: () => import("@/page/system/client"),
  },
  {
    name: "system-client-add",
    path: "/system/client/add",
    meta: { keepAlive: true, title: "添加商家" },
    component: () => import("@/page/system/client-detail"),
  },
  {
    name: "system-client-edit",
    path: "/system/client/:id(\\d+)",
    props: true,
    meta: {
      title: "商家编辑",
    },
    component: () => import("@/page/system/client-detail"),
  },
];
export default systemRoutes;
