<script lang="ts" setup>
import { Movie, getDetail } from "../api/source";
import type { PlayItem, Storage } from "../@types/source";
import { ref, computed, watchEffect, watch } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "@arco-design/web-vue";
import router from "../route";
const IconFont = Icon.addFromIconFontCn({
  src: "https://at.alicdn.com/t/c/font_4035714_3hcacpu5wbz.js",
});
const reverse = ref(false);
const changeReverse = () => (reverse.value = !reverse.value);
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
  console.log("changePlay", val, index)
  activeItem.value = val;
  const next = list.value[index + 1];
  nextItem.value = next;
};
const splitType = (val: string, vod_play_note: string) => {
  if (!vod_play_note) {
    return [val]
  } else {
    return val.split(vod_play_note)
  }
}
/**
 * @description 处理播放地址
 * @param obj
 */
const handlerPlayUrl = (obj: Movie) => {
  const { vod_play_from, vod_play_note, vod_play_url } = obj;
  const nameKey: { [key: string]: PlayItem[] } = {};
  // console.log(obj, "obj")
  const typeList: string[] = vod_play_from.split(vod_play_note || '$');
  // console.log(vod_play_url.split(vod_play_note || '#'), "typeList", vod_play_url)
  const videoList = splitType(vod_play_url, vod_play_note).map((urls) =>
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
  // activeItem.value = storage.value[defaultType.value][0];
  // console.log("default play", activeItem.value)
  const list = storage.value[defaultType.value] || [];
  return reverse.value ? list.reverse() : list;
});
const types = computed(() => Object.keys(storage.value));
const src = computed(() => {
  const baseUrl = "https://pan.helson-lin.cn/player/?url=";
  if (!activeItem.value || !activeItem) return "";
  const isM3u8 = activeItem.value.url?.endsWith(".m3u8");
  if (isM3u8) {
    return (
      baseUrl +
      activeItem.value.url +
      `${nextItem.value?.url ? `&next=${nextItem.value.url}` : ""}`
    );
  } else {
    return activeItem.value.url;
  }
});
watch(list, (val) => {
  if (!defaultType.value) return;
  if (!storage.value) return;
  activeItem.value = storage.value[defaultType.value][0];
})
watchEffect(() => {
  if (activeItem.value && movie.value) {
    // console.log(route)
    router.push({ query: { ...route.query, type: defaultType.value, ix: activeItem.value.name } })
    // 设置路由参数
    const titlle = document.title;
    if (titlle.endsWith(movie.value?.vod_name)) return;
    document.title += `${movie.value?.vod_name}`;
  }
});
</script>
<template>
  <div class="play">
    <div class="box flex-row">
      <div class="inner-player">
        <iframe :src="src" frameborder="0" allowfullscreen></iframe>
      </div>
      <div class="slider">
        <div class="slider-header">
          <div class="name">剧集</div>
          <icon-font type="icon-paixu1" :size="20" class="click" @click="changeReverse" />
        </div>
        <div class="url-list flex-row">
          <div class="url" v-for="(item, index) in list" :key="item.name">
            <div @click="changePlay(item, index)" type="primary" :class="[
              'btn',
              activeItem?.name === item.name ? 'active' : 'default',
            ]">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="info" v-show="movie">
      <img :src="movie?.vod_pic" alt="" srcset="" />
      <div class="flex-column info-detail">
        <div class="name">{{ movie?.vod_name }}</div>
        <div class="remark">{{ movie?.vod_class }}</div>
        <div class="lang">
          {{ movie?.type_name }} / {{ movie?.vod_lang }} /
          {{ movie?.vod_year }} / {{ movie?.vod_remarks }}
        </div>
        <div class="content" v-html="movie?.vod_content.trim()"></div>
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
@media only screen and (max-width: 71.25em) {
  .play {
    position: relative;

    .box {
      height: auto !important;
      display: flex;
      flex-direction: column !important;

      .inner-player {
        width: 100% !important;
        height: 350px !important;
      }
    }

    .slider {
      position: absolute;
      top: 240px;
      width: 100%;
      padding: 20px !important;
      z-index: 2;

      .url-list {
        --row-nm: 8;
        --block-size: 100px;
        height: 200px !important;
      }
    }

    .info {
      position: absolute;
      top: 350px;
      padding: 10px 20px !important;

      .img {
        max-height: 190px !important;
      }
    }
  }
}

@media only screen and (max-width: 48em) {
  .play {
    .box {
      height: auto !important;
      display: flex;
      flex-direction: column !important;

      .inner-player {
        height: 200px !important;
      }
    }

    .slider {
      position: absolute;
      top: 240px;
      width: 100%;
      padding: 0 !important;
      height: 210px !important;

      &-header {
        padding-bottom: 10px !important;
      }

      .url-list {
        --row-nm: 4;
        --block-size: 85px;
        height: 180px !important;
        overflow-y: visible;
      }
    }

    .info {
      position: absolute;
      top: 200px;
      width: 100%;
      padding: 10px !important;
      border-top: 1px var(--color-text-1);
      background-color: #fff;
      box-sizing: border-box;

      img {
        width: 35% !important;
        max-height: 190px !important;
      }

      &-detail {
        flex: none !important;
        width: 65% !important;
      }

      .content ::v-deep() p {
        @include word-line-mission(4);
      }
    }
  }
}

.play {
  margin: 0 auto;
  max-width: var(--play-max-width);
  width: 100%;
  height: 100%;
  padding: var(--play-page-padding);
  padding-bottom: 100px;
  box-sizing: border-box;
  align-content: flex-start;
  align-items: flex-start;
  background-color: var(--color-neutral-1);
  overflow-y: auto;

  .box {
    flex: 1;
    height: 500px;
    background-color: var(--color-bg-3);
    // @include shadow-e2;

    .inner-player {
      width: 889px;
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

    &-detail {
      flex: 1;
      padding: 0 20px;
      box-sizing: border-box;

      .name {
        font-size: var(--name-size);
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
          display: contents;
          padding: 0 !important;
          margin: 5px 0 !important;
          // @include word-line-mission(3);
        }
      }

      .content {
        max-height: 63px;
        overflow: hidden;

        &::before {
          content: "简介：";
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
        color: var(--color-text-0);
        background-color: var(--color-fill-3);
        border-color: transparent;
      }
    }
  }

  .slider {
    position: relative;
    flex: 1;
    height: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    border: 6px;

    .slider-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      padding-bottom: 20px;
      box-sizing: border-box;
      background-color: var(--color-fill-1);
      border-radius: 6px 6px 0px 0px;

      .click:hover {
        fill: chartreuse;
      }
    }
  }

  .url-list {
    --row-nm: 1;
    --block-size: 280px;
    --row-mc: 5px;
    --row-mr: calc((100% - (var(--block-size) * var(--row-nm))) / (var(--row-nm) * 2));
    flex: 1;
    box-sizing: border-box;
    height: calc(100% - 45px);
    padding: 10px 10px;
    overflow-y: auto;
    flex-wrap: wrap;
    align-content: flex-start;
    border-top: 1px solid var(--color-border-2);
    background-color: var(--color-fill-1);
    border-radius: 0 0 6px 6px;

    .url {
      margin: var(--row-mc) var(--row-mr);
      width: var(--block-size);

      &:hover {
        background-color: #fff;
        border-radius: 6px;
      }

      .btn {
        width: 100%;
        line-height: 30px;
        padding: 0 10px;
        box-sizing: border-box;
        text-align: left;
        border-radius: 6px;
        cursor: pointer;

        &.active {
          background-color: #fff;
        }
      }
    }
  }
}
</style>
