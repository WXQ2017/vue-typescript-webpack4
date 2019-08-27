import Vue from "vue";
import Component, { mixins } from "vue-class-component";
import getScrollBarWidth from "../../../common/utils/scroll-width";
import Common from "../../../common/utils/utils";
import BaseComp from "../BaseComp";

interface IScrollBarComp {
  title: string;
}

@Component({
  components: {},
})
export default class ScrollBarComp extends mixins(BaseComp)
  implements IScrollBarComp {
  title: string = "scroll-bar";
  wrapStyle: any = {};
  render(h: Document) {
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
  }
}
