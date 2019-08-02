import { RouteConfig } from "vue-router";
import * as PageLoading from "./pages/fac.page";
const routes: RouteConfig[] = [
  // WXQ-BUILD-ROUTER-PAGE # NOT DELETE
  {
    component: PageLoading.HomePagePreloading,
    name: "Home",
    path: "/",
  },
];
export default routes;
