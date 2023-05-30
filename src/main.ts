import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import * as helper from './helper'
import './style.css'
import router from './route'
// @ts-ignore
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.$helper = helper
app.use(ArcoVue)
app.use(router)
app.use(createPinia())
app.mount('#app')
