<script lang="ts" setup>
// import urlcat, { query } from 'urlcat'
import { IconLiveBroadcast } from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import { useRoute, useRouter } from "vue-router";
import { computed, watchEffect, ref, onMounted } from "vue";
import useSource from "../store/source";
import emitter from "../hooks/useMitt";
import type { SOURCES } from "../@types/source";
const route = useRoute()
const router = useRouter()
const source = useSource();
const sourceName = ref("");
const addRouterSource = (val: string) => {
  router.push({
    query: {
      source: val.replaceAll('/', '')
    }
  })
}
function getUrlParam(name: string) {
  const url = window.location.href
  var reg = /[?&]([^?&#]+)=([^?&#]+)/g;
  var param: {[key: string]: string} = {};
  var ret = reg.exec(url);
  while (ret) { // 当ret为null时表示已经匹配到最后了，直接跳出
    param[ret[1]] = ret[2];
    ret = reg.exec(url);
  }
  return param[name]
}
const changeBtnDisabled = computed<boolean>(() => {
  const path = route.path
  if (path !== '/') return true
  return false
})
/*
 * @description 源列表
 */
const list = computed<SOURCES[]>(() => {
  const source = window?.SOURCES;
  if (!source || typeof source !== "object") return [];
  return Object.entries(source).map((i) => {
    return {
      name: i[0],
      url: i[1],
    };
  });
});
/*
 * @description 搜索内容
 */
const handleSelect = (val: SOURCES) => {
  if (val.url) {
    // 1.设置源 2.清空列表 3.重新搜索
    sourceName.value = val.name
    addRouterSource(val.url)
    source.setBaseUrl(val.url);
    source.setData([]);
    if (source.wd) {
      emitter.emit("search");
    }
    Message.success(`换源成功：${val.name}`);
  }
};
/*
 * @description 初始化源列表的时候，初始化baseurl
 */
watchEffect(
  () => {
    setTimeout(() => {
      const routeSource = getUrlParam('source') ?? null
      if (!routeSource && list.value) {
        addRouterSource(list.value[0].url)
        source.setBaseUrl(list.value[0].url);
        sourceName.value = list.value[0].name;
      } else if (routeSource && list.value) {
        const item = list.value.find(i => i.url.indexOf(routeSource as string) !== -1)
        if (!item) return
        source.setBaseUrl(item.url);
        sourceName.value = item.name;
      }
    })
  }
);
</script>
<template>
  <div class="source-name"> 当前源：{{ sourceName }}</div>
  <a-dropdown @select="handleSelect" :disabled="changeBtnDisabled">
    <a-button>
      <template #icon>
        <icon-live-broadcast />
      </template>
      源
    </a-button>
    <template #content>
      <a-doption v-for="option in list" :key="option.name" :value="option">{{
        option.name
      }}</a-doption>
    </template>
  </a-dropdown>
</template>
<style lang="scss" scoped>
.source-name {
  display: inline-block;
  margin-right: 20px;
}
</style>