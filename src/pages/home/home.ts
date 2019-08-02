import Vue from "vue";
import Component, { mixins } from "vue-class-component";
import BasePage from "../BasePage";

interface IHomePage {
  /**
   *
   */
  fetchData(): void;
}

@Component({
  components: {},
  name: "Home"
})
export default class HomePage extends mixins(BasePage) implements IHomePage {
  title: string = "home";
  fetchData() {
    //
  }
  mounted() {
    //
  }
}
