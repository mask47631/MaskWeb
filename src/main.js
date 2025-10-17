import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Loading from './components/Loading.vue'
import GlobalLoading from './components/GlobalLoading.js'

// 页面刷新时自动跳转到根路径
// 检查当前路径，如果不是根路径，则重定向到根路径
router.isReady().then(() => {
  if (router.currentRoute.value.path !== '/') {
    router.push('/');
  }
});

const app = createApp(App)
app.component('Loading', Loading)
app.use(router)

// 安装全局loading组件
app.use(GlobalLoading)

// 挂载应用
app.mount('#app')