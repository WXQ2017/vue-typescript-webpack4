import { CreateElement } from "vue";
import Component, { mixins } from "vue-class-component";
import { Prop } from "vue-property-decorator";
import "vue-tsx-support/enable-check";
import Common from "../../core/common";
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
interface IBarFactory {
  move: number;
  size: string;
  bar: any;
}
interface IBarFacNames {
  offset: string;
  scroll: string;
  scrollSize: string;
  size: string;
  key: string;
  axis: string;
  client: string;
  direction: string;
}
@Component({
  name: "Bar",
})
export default class Bar extends mixins(BaseComp) {
  @Prop()
  vertical: boolean;
  @Prop({ default: 0 })
  move: number;
  @Prop({ default: "" })
  size: string;
  cursorDown: boolean = false;
  X: any = null;
  get bar() {
    return BAR_MAP[this.vertical ? "vertical" : "horizontal"];
  }
  get wrap() {
    return (this.$parent as any).wrap;
  }
  render(h: CreateElement) {
    const { size, move, bar } = this;
    return (
      <div
        class={["wxq-scrollbar__bar", "is-" + bar.key]}
        onMousedown={this.clickTrackHandler}
      >
        <div
          ref="thumb"
          class="wxq-scrollbar__thumb"
          onMousedown={this.clickThumbHandler}
          style={this.renderThumbStyle({ size, move, bar })}
        />
      </div>
    );
  }
  clickTrackHandler(e: any) {
    const bar: IBarFacNames = this.bar;
    const offset = Math.abs(
      e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client],
    );
    const thumbHalf = (this.$refs.thumb as any)[this.bar.offset] / 2;
    const thumbPositionPercentage =
      ((offset - thumbHalf) * 100) / (this.$el as any)[this.bar.offset];

    this.wrap[this.bar.scroll] =
      (thumbPositionPercentage * this.wrap[this.bar.scrollSize]) / 100;
  }
  clickThumbHandler(e: any) {
    // prevent click event of right button
    if (e.ctrlKey || e.button === 2) {
      return;
    }
    this.startDrag(e);
    this.X =
      e.currentTarget[this.bar.offset] -
      (e[this.bar.client] -
        e.currentTarget.getBoundingClientRect()[this.bar.direction]);
  }
  startDrag(e: any) {
    e.stopImmediatePropagation();
    this.cursorDown = true;

    Common.on(document, "mousemove", this.mouseMoveDocumentHandler);
    Common.on(document, "mouseup", this.mouseUpDocumentHandler);
    document.onselectstart = () => false;
  }
  mouseMoveDocumentHandler(e: any) {
    if (this.cursorDown === false) {
      return;
    }
    const prevPage = this.X;

    if (!prevPage) {
      return;
    }

    const offset =
      ((this.$el.getBoundingClientRect() as any)[this.bar.direction] -
        e[this.bar.client]) *
      -1;
    const thumbClickPosition =
      (this.$refs.thumb as any)[this.bar.offset] - prevPage;
    const thumbPositionPercentage =
      ((offset - thumbClickPosition) * 100) /
      (this.$el as any)[this.bar.offset];

    this.wrap[this.bar.scroll] =
      (thumbPositionPercentage * this.wrap[this.bar.scrollSize]) / 100;
  }
  mouseUpDocumentHandler(e: any) {
    this.cursorDown = false;
    this.X = 0;
    Common.off(document, "mousemove", this.mouseMoveDocumentHandler);
    document.onselectstart = null;
  }
  renderThumbStyle(obj: IBarFactory) {
    const style: any = {};
    const translate = `translate${obj.bar.axis}(${obj.move}%)`;

    style[obj.bar.size] = obj.size;
    style.transform = translate;
    style.msTransform = translate;
    style.webkitTransform = translate;
    return style;
  }
  destroyed() {
    Common.off(document, "mouseup", this.mouseUpDocumentHandler);
  }
}
