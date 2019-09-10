import Vue, { CreateElement } from "vue";
import Component, { mixins } from "vue-class-component";
import { Prop } from "vue-property-decorator";

import getScrollBarWidth from "../../../common/utils/scroll-width";
import Common from "../../../common/utils/utils";
import BaseComp from "../BaseComp";
import Bar from "./bar.vue";

interface IScrollBarComp {
  title: string;
}

@Component({
  components: { Bar },
  name: "scrollBar",
})
export default class ScrollBarComp extends mixins(BaseComp)
  implements IScrollBarComp {
  title: string = "scroll-bar";
  moveX: number = 0;
  moveY: number = 0;
  sizeWidth: string = "0";
  sizeHeight: string = "0";
  @Prop({ default: "div" })
  tag: string;
  @Prop({
    default: () => {
      return [];
    },
  })
  viewClass: any[];
  @Prop({
    default: () => {
      return [];
    },
  })
  viewStyle: any[];
  @Prop({
    default: () => {
      return {};
    },
  })
  wrapStyle: any;
  @Prop({
    default: () => {
      return {};
    },
  })
  wrapClass: any;
  @Prop()
  native: boolean;

  get wrap() {
    return this.$refs.wrap as HTMLBaseElement;
  }
  render(h: CreateElement) {
    const gutter = getScrollBarWidth();
    let style = this.wrapStyle;
    if (gutter) {
      // 滚动条宽度
      const gutterWith = `-${gutter}px`;
      // 偏移隐藏滚动条
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;
      if (Array.isArray(this.wrapStyle)) {
        style = Common.toObject(this.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof this.wrapStyle === "string") {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }
    const view = h(
      this.tag,
      {
        class: ["scrollbar-view", this.viewClass],
        ref: "resize",
        style: this.viewStyle,
      },
      this.$slots.default,
    );
    const wrap = (
      <div
        ref="wrap"
        style={style}
        onScroll={this.handleScroll}
        class={[
          this.wrapClass,
          "scrollbar-wrap",
          gutter ? "" : "scrollbar_wrap--hidden-default",
        ]}
      >
        {[view]}
      </div>
    );
    let nodes;
    if (!this.native) {
      nodes = [
        wrap,
        <bar move={this.moveX} size={this.sizeWidth}></bar>,
        <bar vertical move={this.moveY} size={this.sizeHeight}></bar>,
      ];
    } else {
      nodes = [
        <div
          ref="wrap"
          class={[this.wrapClass, "el-scrollbar__wrap"]}
          style={style}
        >
          {[view]}
        </div>,
      ];
    }

    return h("div", { class: "scrollbar" }, nodes);
  }
  handleScroll() {
    const wrap = this.wrap;
    this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;
    this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth;
  }
}
