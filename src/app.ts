import Vue from "vue";
import VueRouter from "vue-router";
import App from "./app.vue";
import routes from "./module.router";
Vue.use(VueRouter);

const router = new VueRouter({
  base: "/",
  mode: "history",
  routes,
});
new Vue({
  render: h => h(App),
  router,
}).$mount("#app");
