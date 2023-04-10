<script lang="ts" setup>
import { ref } from "vue";
import { search } from "../api/source";
import useSource from "../store/source";
const wd = ref("");
const source = useSource();
const searchData = async () => {
  const res = await search(wd.value);
  if (res.code === 1) {
    source.setData(res.list);
    console.log(res.list);
  }
};
</script>
<template>
  <div class="search">
    <a-input-search
      :style="{ width: '320px' }"
      placeholder="请输入关键词"
      search-button
      @press-enter="searchData"
      v-model="wd"
    />
  </div>
</template>

<style lang="scss" scoped>
.search {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  box-sizing: border-box;
}
</style>
