import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
  },
  {
    path: '/content',
    name: 'Content',
    component: () => import(/* webpackChunkName: "content" */ '../views/Content.vue'),
  },
  {
    path: '/send',
    name: 'Send',
    component: () => import(/* webpackChunkName: "send" */ '../views/Send.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
