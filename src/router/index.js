import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../views/HelloWorld.vue'
import MenuView from "@/views/MenuView.vue";

const routes = [
    { path: '/', name: 'Home', component: HelloWorld },
    { path: '/menu', name: 'Menu', component: MenuView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

