import Vue from "vue";
import Component, { mixins } from "vue-class-component";
import BasePage from "../BasePage";

interface ITestPage {
  /**
   *
   */
  fetchData(): void;
}

@Component({
  components: {},
  name: "Test",
})
export default class TestPage extends mixins(BasePage) implements ITestPage {
  title: string = "test";
  fetchData() {
    //
  }
  mounted() {
    //
  }
}
