<script lang="ts" setup>
import Search from "../components/Search.vue";
</script>
<template>
  <div class="index">
    <Search class="search-comp"/>
  </div>
</template>
<style lang="scss" scoped>
.index {
    padding: 0 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .search-comp {width: var(--search-width);}
}
</style>