<script lang="ts" setup>
import { IconLiveBroadcast } from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import { computed, watchEffect } from 'vue';
import useSource from '../store/source';
import emitter from "../hooks/useMitt"
import type { SOURCES } from '../@types/source'
const source = useSource();
/*
* @description 源列表
*/
const list = computed<SOURCES[]>(() => {
    const source = window?.SOURCES;
    if (!source || typeof source !== 'object') return [];
    return Object.entries(source).map(i => {
        return {
            name: i[0],
            url: i[1],
        }
    });
})
/*
* @description 搜索内容
*/
const handleSelect = (val: SOURCES) => {
    if (val.url) {
        // 1.设置源 2.清空列表 3.重新搜索
        source.setBaseUrl(val.url);
        source.setData([]);
        emitter.emit('search');
        Message.success(`换源成功：${val.name}`)
    }
}
/*
* @description 初始化源列表的时候，初始化baseurl
*/
watchEffect(() => {
    if (list.value) {
        source.setBaseUrl(list.value[0].url)
    }
});
</script>
<template>
    <a-dropdown @select="handleSelect">
        <a-button>
            <template #icon>
                <icon-live-broadcast />
            </template>
            源
        </a-button>
        <template #content>
            <a-doption v-for="option in list" :key="option.name" :value="option">{{ option.name }}</a-doption>
        </template>
    </a-dropdown>
</template>
