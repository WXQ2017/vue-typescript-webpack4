import { CreateElement } from "vue";
import Component, { mixins } from "vue-class-component";
import { Prop } from "vue-property-decorator";
import "vue-tsx-support/enable-check";
import BaseComp from "../BaseComp";
const BAR_MAP = {
  vertical: {
    offset: "offsetHeight",
    scroll: "scrollTop",
    scrollSize: "scrollHeight",
    size: "height",
    key: "vertical",
    axis: "Y",
    client: "clientY",
    direction: "top",
  },
  horizontal: {
    offset: "offsetWidth",
    scroll: "scrollLeft",
    scrollSize: "scrollWidth",
    size: "width",
    key: "horizontal",
    axis: "X",
    client: "clientX",
    direction: "left",
  },
};
@Component({
  name: "Bar",
})
export default class Bar extends mixins(BaseComp) {
  @Prop()
  vertical: boolean;
  @Prop()
  move: number;
  @Prop()
  size: string;
  get bar() {
    return BAR_MAP[this.vertical ? "vertical" : "horizontal"];
  }
  render(h: CreateElement) {
    const { size, move, bar } = this;
    return (
      <div
        class={["scrollbar__bar", "is-" + bar.key]}
        onMousedown={this.clickTrackHandler}
      >
        <div
          ref="thumb"
          class="el-scrollbar__thumb"
          onMousedown={this.clickThumbHandler}
          style={this.renderThumbStyle({ size, move, bar })}
        />
      </div>
    );
  }
  clickTrackHandler() {}
  clickThumbHandler() {}
  renderThumbStyle<T>(obj: T) {}
}
