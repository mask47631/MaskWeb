import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Loading from './components/Loading.vue'
import GlobalLoading from './components/GlobalLoading.js'

// 页面刷新时自动跳转到根路径
// 检查当前路径，如果不是根路径，则重定向到根路径
router.isReady().then(() => {
  if (router.currentRoute.value.path !== '/' && !router.currentRoute.value.path.startsWith('/tool/')) {
    router.push('/');
  }
});

const app = createApp(App)
app.component('Loading', Loading)
app.use(router)

// 安装全局loading组件
app.use(GlobalLoading)

// 注册service worker以启用PWA功能
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// 挂载应用
app.mount('#app')