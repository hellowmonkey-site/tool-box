import NProgress from "nprogress";
import { createRouter, createWebHistory } from "vue-router";

import Index from "@/layout/Index";

import user from "@/router/user";
import system from "@/router/system";
import { pushRouteTab } from "@/service/common";

NProgress.inc(0.2);
NProgress.configure({ easing: "ease", speed: 500, showSpinner: false });

export const indexName = "system-route-index";

export const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
    redirect: () => {
      return {
        name: indexName,
      };
    },
    children: [...system],
  },
  ...user,
  { path: "/:pathMatch(.*)*", name: "NotFound", component: () => import("@/page/error/404") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(to => {
  pushRouteTab(to);
  NProgress.start();
  return true;
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
