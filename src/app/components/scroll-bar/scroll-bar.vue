<script lang="tsx" src="./scroll-bar.tsx">
</script>
<style lang="scss" scoped>
.scrollbar {
  overflow: hidden;
  position: relative;
}
.scrollbar__wrap {
  overflow: scroll;
  height: 100%;
}
.scrollbar__bar {
  &.is-horizontal {
    height: 6px;
    left: 2px;
    > div {
      height: 100%;
    }
  }
  &.is-vertical {
    width: 6px;
    top: 2px;
  }
}
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
</style>
