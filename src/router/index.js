import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../views/HelloWorld.vue'
import TheWelcome from '../views/TheWelcome.vue'

const routes = [
  { path: '/', name: 'Home', component: HelloWorld },
  { path: '/welcome', name: 'Welcome', component: TheWelcome }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

