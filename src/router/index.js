import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../views/HelloWorld.vue'
import MenuView from "@/views/MenuView.vue";
import ChackServerView from "@/views/ChackServerView.vue";
import LoginServerView from "@/views/LoginServerView.vue";
import ChatServerView from "@/views/ChatServerView.vue";

const routes = [
    { path: '/', name: 'Home', component: HelloWorld },
    { path: '/menu', name: 'Menu', component: MenuView },
    { path: '/chackServer', name: 'ChackServer', component: ChackServerView },
    { path: '/loginServer', name: 'LoginServer', component: LoginServerView },
    { path: '/chatServer', name: 'ChatServer', component: ChatServerView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 页面刷新时自动跳转到根路径
router.beforeEach((to, from, next) => {
  // 检查是否是首次加载（from路由没有name）
  if (!from.name) {
    // 首次加载时，如果不是访问根路径，则重定向到根路径
    if (to.path !== '/') {
      next('/');
    } else {
      next();
    }
  } else {
    // 正常的路由跳转
    next();
  }
});

export default router