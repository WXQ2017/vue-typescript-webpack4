<template>
  <div class="temp">
    111

    <scroll-bar :viewClass="['aa']">
      <div class="test-height">
        <p>11111111</p>
        <p>11111111</p>
        <p>11111111</p>
        <p>11111111</p>
        <p>11111111</p>
        <p>11111111</p>
        <p>11111111</p>
        <p>11111111</p>
      </div>
    </scroll-bar>
  </div>
</template>
<script src="./test.ts" lang="ts"></script>
<style lang="scss" scoped>
.temp {
  width: 666px;
  min-height: 100px;
  margin: 60px auto;
  text-align: center;
  h1 {
    color: #36c6d3;
  }
  img {
    width: 400px;
  }
}

.test-height {
}
</style>


