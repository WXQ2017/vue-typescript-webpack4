// tslint:disable:no-var-requires
import Vue from "vue";
// WXQ-BUILD-COMP-REQUIRE # NOT DELETE
import scrollBar from "./scroll-bar/scroll-bar.vue";

// WXQ-BUILD-COMP-NAME # NOT DELETE
const components = [scrollBar];

components.forEach(component => {
  Vue.component(component.name, component);
});
