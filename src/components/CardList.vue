<script lang="ts" setup>
import { computed } from "vue";
import useSource from "../store/source";
import { useRouter } from "vue-router";
import type { Movie } from "../api/source";
const source = useSource();
const router = useRouter();
const play = ({ vod_id }: Movie) => {
   const path = window.location.origin + router.resolve({ path: `/play/${vod_id}` }).path    //   router.push({ path: `/paly/${vod_id}` });
    window.open(path, '_blank')
};
const list = computed(() => source.getterList);
</script>

<template>
  <div class="card-list" v-show="list.length >= 1">
    <div
      class="card"
      v-for="card in list"
      :key="card.vod_id"
      @click="play(card)"
    >
      <span class="name">{{ card.vod_name }}</span>
      <span class="remarks">{{ card.vod_remarks }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-list {
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  padding: 20px 0;
  border-radius: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: rgba(196, 189, 189, 0.293);
  .card {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 13px;
    padding: 10px 20px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 255, 255, .5);
      filter: drop-shadow(0 0 2em #646cffaa);
    }
  }
}
</style>
