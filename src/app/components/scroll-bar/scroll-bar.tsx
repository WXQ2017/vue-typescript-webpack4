import Vue, { CreateElement } from "vue";
import Component, { mixins } from "vue-class-component";
import { Prop } from "vue-property-decorator";

import {
  addResizeListener,
  removeResizeListener,
} from "../../../common/utils/resize-event";
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
export default class ScrollBarComp extends Vue implements IScrollBarComp {
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
  @Prop({ default: false })
  native: boolean;
  @Prop({ default: false })
  noresize: boolean; // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
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
        class: ["wxq-scrollbar-view", this.viewClass],
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
          "wxq-scrollbar__wrap",
          gutter ? "" : "wxq-scrollbar_wrap--hidden-default",
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
          class={[this.wrapClass, "wxq-scrollbar__wrap"]}
          style={style}
        >
          {[view]}
        </div>,
      ];
    }

    return h("div", { class: "wxq-scrollbar" }, nodes);
  }
  handleScroll() {
    const wrap = this.wrap;
    this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;
    this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth;
  }
  update() {
    let heightPercentage;
    let widthPercentage;
    const wrap = this.wrap;
    if (!wrap) {
      return;
    }

    heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight;
    widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth;

    this.sizeHeight = heightPercentage < 100 ? heightPercentage + "%" : "";
    this.sizeWidth = widthPercentage < 100 ? widthPercentage + "%" : "";
  }
  mounted() {
    if (this.native) {
      return;
    }
    this.$nextTick(this.update);
    if (!this.noresize) {
      addResizeListener(this.$refs.resize, this.update);
    }
  }

  beforeDestroy() {
    if (this.native) {
      return;
    }
    if (!this.noresize) {
      removeResizeListener(this.$refs.resize, this.update);
    }
  }
}
