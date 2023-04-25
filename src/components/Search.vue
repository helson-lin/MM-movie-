<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { search } from "../api/source";
import useSource from "../store/source";
import emitter from "../hooks/useMitt"
import CardList from "./CardList.vue";
const source = useSource();
const { wd } = storeToRefs(source);
const searchData = async () => {
  if(!wd.value) return;
  const res = await search();
  if (res.code === 1) {
    source.setData(res.list);
  }
};
const clearData = () => {
  source.setData([]);
};
emitter.on("search", searchData);
</script>

<template>
  <div class="search">
    <a-input-search 
    class="search-input"
    size="large"
    placeholder="请输入关键词" 
    search-button 
    :allow-clear="true"
    @clear="clearData"
    @change="searchData" 
    v-model="wd" />
    <div class="fixed-search">
      <CardList />
    </div>
  </div>
</template>


<style lang="scss" scoped>
.search {
  margin: 0 auto;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20px 0;
  padding-top: 100px;
  box-sizing: border-box;

  .fixed-search {
    position: fixed;
    top: 210px;
    width: inherit;
  }
  .search-input {
    width: 100%;
  }
}
</style>
