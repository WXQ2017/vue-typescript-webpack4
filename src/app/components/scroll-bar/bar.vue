<script lang="tsx", src="./bar.tsx"></script>
<style lang="scss" scoped>
@import "../../../common/styles/mixins/mixins";
@include b(scrollbar) {
  @include e(bar) {
    position: absolute;
    right: 2px;
    bottom: 2px;
    z-index: 1;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 120ms ease-out;

    @include when(vertical) {
      width: 6px;
      top: 2px;
      > div {
        width: 100%;
      }
    }

    @include when(horizontal) {
      height: 6px;
      left: 2px;

      > div {
        height: 100%;
      }
    }
  }
  @include e(thumb) {
    position: relative;
    display: block;
    width: 0;
    height: 0;
    cursor: pointer;
    border-radius: inherit;
    background-color: rgba($color: #909399, $alpha: 0.3);
    transition: 0.3s background-color;

    &:hover {
      background-color: rgba($color: #909399, $alpha: 0.5);
    }
  }
}
</style>

