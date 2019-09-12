<script lang="tsx" src="./scroll-bar.tsx">
</script>
<style lang="scss" scoped>
@import "../../../common/styles/mixins/mixins";

.scrollbar__thumb {
  position: relative;
  display: block;
  width: 0;
  height: 0;
  cursor: pointer;
  border-radius: inherit;
  background-color: rgba(144, 146, 152, 0.5);
  transition: background-color 0.3s;
}

@include b(scrollbar) {
  overflow: hidden;
  position: relative;

  &:hover,
  &:active,
  &:focus {
    > .scrollbar__bar {
      opacity: 1;
      transition: opacity 340ms ease-out;
    }
  }

  @include e(wrap) {
    overflow: scroll;
    height: 100%;

    @include m(hidden-default) {
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
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
    // background-color: rgba($color: #909399, $alpha: 0.3);
    background-color: red;
    transition: 0.3s background-color;

    &:hover {
      background-color: rgba($color: #909399, $alpha: 0.5);
    }
  }

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
}
</style>
