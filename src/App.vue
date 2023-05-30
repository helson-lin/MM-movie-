<script lang="ts" setup>
import SourceChanger from "./components/SourceChanger.vue";
import { useRouter } from "vue-router";
import { getCurrentInstance } from "vue";
const instance = getCurrentInstance();
// console.log(instance?.appContext?.config.globalProperties.$helper)
window.onload = () => instance?.appContext?.config.globalProperties.$helper.lockScreen();
const router = useRouter();
const goHome = () => {
  router.push({ path: "/" })
}
</script>
<template>
  <div class="full">
    <div class="header flex-row">
      <div class="logo" @click="goHome">MMo</div>
      <div class="right">
        <SourceChanger />
      </div>
    </div>
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
  padding: 0 1.5rem;
  box-sizing: border-box;
  justify-content: space-between;
  @include shadow-e2;
}

.view {
  height: calc(100% - 50px);
}

.logo {
  height: 50px;
  box-sizing: border-box;
  line-height: 50px;
  will-change: filter;
  transition: filter 300ms;
  font-family: Russo One, sans-serif;
  font-style: italic;
  user-select: none;
  cursor: pointer;
  filter: drop-shadow(0 10px 10px #646cffaa);
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
