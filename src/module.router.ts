import { RouteConfig } from "vue-router";
import * as PageLoading from "./pages/fac.page";
const routes: RouteConfig[] = [
  {
    component: PageLoading.HomePagePreloading,
    name: "Home",
    path: "/",
  },
];
export default routes;
