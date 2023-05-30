import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

interface Meta {
  title: string;
  keepAlive: boolean;
  requireAuth: boolean;
}

// @ts-ignore
const Index = () => import("./page/Index.vue");
// @ts-ignore
// const MIndex = () => import("./page/Home-M.vue");
// @ts-ignore
const Play = () => import("./page/Play.vue");
// @ts-ignore
const Mplay = () => import("./page/Mplay.vue");

// const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)


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
  },
  {
    path: "/mplay/:id",
    name: "mplay",
    meta: {
      title: "播放"
    },
    component: Mplay,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
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
