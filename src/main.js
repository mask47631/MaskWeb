import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 页面刷新时自动跳转到根路径
// 检查当前路径，如果不是根路径，则重定向到根路径
router.isReady().then(() => {
  if (router.currentRoute.value.path !== '/') {
    router.push('/');
  }
});

createApp(App).use(router).mount('#app')