// tslint:disable:no-var-requires
import Vue from "vue";

// WXQ-BUILD-COMP-REQUIRE # NOT DELETE
import Bar from "./scroll-bar/bar.vue";
import ScrollBar from "./scroll-bar/scroll-bar.vue";

const components = [
  // WXQ-BUILD-COMP-NAME # NOT DELETE
  ScrollBar,
  Bar,
];

components.forEach((component: any) => {
  const c = new component();
  Vue.component(c.$options.name, component);
});
