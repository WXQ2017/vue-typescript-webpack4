<script lang="tsx" src="./scroll-bar.tsx">
</script>
<style lang="scss" scoped>
@import "../../../common/styles/mixins/mixins";

@include b(scrollbar) {
  overflow: hidden;
  position: relative;

  &:hover,
  &:active,
  &:focus {
    > .wxq-scrollbar__bar {
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
}
</style>
