<template>
  <div class="loading-demo">
    <h1>全局Loading组件演示</h1>
    <div class="demo-section">
      <button @click="showLocalLoading">显示局部Loading</button>
      <div class="local-loading-container">
        <Loading :show="localLoading" text="局部加载中..." />
        <p>这是一个局部加载区域的内容</p>
      </div>
    </div>
    
    <div class="demo-section">
      <button @click="showGlobalLoading">显示全局Loading (3秒后自动关闭)</button>
      <p>点击按钮后整个页面会被遮罩覆盖</p>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import Loading from '@/components/Loading.vue'

const localLoading = ref(false)

// 获取当前实例以访问全局属性
const instance = getCurrentInstance()

const showLocalLoading = () => {
  localLoading.value = true
  setTimeout(() => {
    localLoading.value = false
  }, 2000)
}

const showGlobalLoading = () => {
  // 使用全局loading
  if (instance) {
    instance.appContext.config.globalProperties.$loading.show('全局加载中...')
    setTimeout(() => {
      instance.appContext.config.globalProperties.$loading.hide()
    }, 3000)
  }
}
</script>

<style scoped>
.loading-demo {
  padding: 2rem;
}

.demo-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
}

.local-loading-container {
  position: relative;
  margin-top: 1rem;
  padding: 1rem;
  min-height: 100px;
  border: 1px dashed #ccc;
}

button {
  padding: 0.5rem 1rem;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #337ecc;
}
</style>