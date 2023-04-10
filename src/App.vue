<script lang="ts" setup>
import Search from "./components/Search.vue";
</script>
<template>
  <div class="full">
    <div class="header"></div>
    <router-view class="view"></router-view>
  </div>
</template>

<style lang="scss" scoped>
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--background-color);
}
.full {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.header {
  width: 100%;
  height: 50px;
  @include shadow-e2;
}
.view {
  height: calc(100% - 50px);
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
#app {
  width: 100vw;
  height: 100vh;
}
</style>
