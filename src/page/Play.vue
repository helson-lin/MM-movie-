<script lang="ts" setup>
import { ref, computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { Movie, getDetail } from "../api/source";
import type { PlayItem, Storage } from "../@types/source"

const route = useRoute();
const movie = ref<Movie>();
// play type: m3u8 or another type
const defaultType = ref("");
// playing item info
const activeItem = ref<PlayItem>();
const nextItem = ref<PlayItem>();
// storage play type and playitem
const storage = ref<Storage>({});
const vodId = route.params?.id;
/*
* @description get play information 
* @param id the id of the play item
*/
const getData = async (id: string) => {
  const res = await getDetail(id);
  if (res.code === 1) {
    if (res.list[0]) {
      movie.value = res.list[0];
      storage.value = handlerPlayUrl(movie.value);
    }
  }
};

if (vodId) getData(vodId as string);
/**
 * @description 设置默认播放类型：m3u8/yun
 * @param val string
 */
const changeType = (val: string) => (defaultType.value = val);
/**
 * @description 切换播放项
 */
const changePlay = (val: PlayItem, index: number) => {
  activeItem.value = val
  const next = list.value[index + 1];
  nextItem.value = next
}

/**
 * @description 处理播放地址
 * @param obj 
 */
const handlerPlayUrl = (obj: Movie) => {
  const { vod_play_from, vod_play_note, vod_play_url } = obj;
  const nameKey: { [key: string]: PlayItem[] } = {};
  const typeList: string[] = vod_play_from.split(vod_play_note);
  const videoList = vod_play_url.split(vod_play_note).map((urls) =>
    urls.split("#").map((i: string) => {
      const [name, url] = i.split("$");
      return { name, url };
    })
  );
  typeList.forEach((type, index) => {
    nameKey[type] = videoList[index];
  });
  defaultType.value = typeList[0];
  return nameKey;
};

const list = computed(() => {
  if (!defaultType.value) return [];
  activeItem.value = storage.value[defaultType.value][0];
  return storage.value[defaultType.value] || [];
});
const types = computed(() => Object.keys(storage.value));
const src = computed(() => {
  const baseUrl = "https://pan.helson-lin.cn/player/?url=";
  if (!activeItem.value) return "";
  const isM3u8 = activeItem.value.url.endsWith(".m3u8");
  if (isM3u8) {
    return baseUrl + activeItem.value.url + `${nextItem.value?.url ? `&next=${nextItem.value.url}` : ''}}`;
  } else {
    return activeItem.value.url;
  }
});

watchEffect(() => {
  if (activeItem.value && movie.value) {
    const titlle = document.title;
    if (titlle.endsWith(movie.value?.vod_name)) return
    document.title += `${movie.value?.vod_name}`
  }
})
</script>
<template>
  <div class="play">
    <div class="box flex-row">
      <div class="inner-player">
        <iframe :src="src" frameborder="0" allowfullscreen></iframe>
      </div>
      <div class="url-list flex-row">
        <div class="url" v-for="(item, index) in list" :key="item.name">
          <div @click="changePlay(item, index)" type="primary" :class="[
            'btn',
            activeItem?.name === item.name ? 'active' : 'default',
          ]">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="info">
      <img :src="movie?.vod_pic" alt="" srcset="" />
      <div class="info flex-column">
        <div class="name">{{ movie?.vod_name }}</div>
        <div class="remark">{{ movie?.vod_class }}</div>
        <div class="lang">
          {{ movie?.type_name }} / {{ movie?.vod_lang }} / {{ movie?.vod_year }} / {{ movie?.vod_remarks }}
        </div>
        <div class="content" v-html="movie?.vod_content"></div>
        <div class="types">
          播放源：
          <div class="play-type flex-row">
            <a-button @click="changeType(item)" type="text" v-for="item in types" :key="item" :class="[
              'type-item',
              defaultType === item ? 'active' : 'default',
            ]">{{ item }}</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.play {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  align-content: flex-start;
  align-items: flex-start;
  background-color: var(--color-neutral-1);

  .box {
    flex: 1;
    height: 500px;
    background-color: var(--color-bg-3);
    @include shadow-e2;

    .inner-player {
      width: 100%;
      height: 100%;
      background-color: var(--color-text-1);

      iframe {
        width: 100%;
        height: 100%;
        margin-left: auto;
        margin-right: auto;
      }
    }
  }

  .info {
    padding-top: 20px;
    display: flex;

    img {
      width: 160px;
      max-height: 240px;
    }

    .info {
      flex: 1;
      padding: 0 20px;
      box-sizing: border-box;

      .name {
        font-size: 22px;
        font-weight: bolder;
        line-height: 32px;
        color: var(--color-text-1);
      }

      .remark,
      .types,
      .lang,
      .content {
        color: var(--color-text-2);

        ::v-deep() p {
          padding: 0 !important;
          margin: 5px 0 !important;
          @include word-line-mission(5);

          &::before {
            content: "简介：";
          }
        }
      }
    }
  }

  .play-type {
    display: inline-flex;
    box-sizing: border-box;

    .type-item {
      cursor: pointer;
      color: var(--color-text-2);

      &.active {
        color: #f7ba1e;
      }
    }
  }

  .url-list {
    width: 500px;
    padding: 20px;
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
    flex-wrap: wrap;
    align-content: flex-start;
    border-top: 1px solid var(--color-border-2);

    .url {
      width: calc(100% /1);
      margin-bottom: 10px;
      background-color: var(--color-neutral-3);

      .btn {
        width: 100%;
        line-height: 30px;
        padding: 0 10px;
        box-sizing: border-box;
        text-align: left;
        border-radius: 5px;
        cursor: pointer;

        // background-color: var(--color-menu-dark-bg);
        &.active {
          background-color: #f7ba1e;
        }
      }
    }
  }
}
</style>
