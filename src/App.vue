<script lang="ts" setup>
import SourceChanger from "./components/SourceChanger.vue";
import { useRouter, useRoute } from "vue-router";
import { getCurrentInstance, computed, watch } from "vue";
const instance = getCurrentInstance();
window.onload = () => instance?.appContext?.config.globalProperties.$helper.lockScreen();
const router = useRouter();
const route = useRoute()

const path = computed(() => route.path)
const goHome = () => {
  // router query 只需要source
  delete route.query?.type;
  delete route.query?.ix;
  const queryParams = route.query
  const query: { [key: string]: string } = {}
  if (queryParams.source) query['source'] = queryParams.source as string
  const newRoute = router.resolve({ path: "/", query, replace: true })
  const fullPath = window.location.origin + '/' + newRoute.href
  // console.log(window.location.origin + '/' + newRoute.href,"newRoute")
  // window.location = (window.location.origin + '/' + newRoute.href) as unknown as Location
  // location.href = fullPath
  router.push({ path: '/', query, replace: true })
}
</script>
<template>
  <div class="full">
    <!-- header -->
    <header class="header flex-row">
      <div class="logo" @click="goHome">MMo</div>
      <div class="right">
        <SourceChanger />
      </div>
    </header>
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
