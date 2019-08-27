import Vue from "vue";
import App from "./app.vue";
// import "./components/fac.comp";
import router from "./module.router";

new Vue({
  render: h => h(App),
  router,
}).$mount("#app");
