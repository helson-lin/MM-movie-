import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

interface Meta {
  title: string;
  keepAlive: boolean;
  requireAuth: boolean;
}

// @ts-ignore
const Index = () => import("./page/Index.vue");
// @ts-ignore
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

router.beforeEach((to, from, next) => {
  const { title } = to.meta as unknown as Meta;
  if (title) {
    document.title = `MMO | ${title}`;
  }
  next()
})
export default router;
