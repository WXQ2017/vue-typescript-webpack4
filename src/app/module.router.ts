import Vue from "vue";
import { RouteConfig } from "vue-router";
import VueRouter from "vue-router";
import * as PageLoading from "./pages/fac.page";
import Common from "./core/common";
Vue.use(VueRouter);
const routes: RouteConfig[] = [
  // WXQ-BUILD-ROUTER-PAGE # NOT DELETE
  {
    component: PageLoading.HomePagePreloading,
    name: "Home",
    path: "/",
  },
  {
    component: PageLoading.TestPagePreloading,
    name: "Test",
    path: "/test",
  },
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  base: Common.getPublicPath(),
  mode: "history",
  routes,
});

export default router;
