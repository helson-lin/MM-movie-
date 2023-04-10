import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const Index = () => import("./page/Index.vue");
const Play = () => import("./page/Play.vue");
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    meta: {
      title: "首页",
      keepAlive: true,
      requireAuth: true,
    },
    component: Index,
  },
  {
    path: "/play/:id",
    name: "play",
    meta: {
        title: "播放"
    },
    component: Play,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
