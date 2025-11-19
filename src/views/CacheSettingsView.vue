<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { top_title } from "@/js/common.js";
import mediaCache from '@/js/mediaCache.js';

top_title.value = '缓存设置';

const router = useRouter();
const cacheStats = ref({
  supported: false,
  entries: 0,
  size: 0
});

const sessionCacheInfo = ref({
  entries: 0
});

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const loadCacheStats = async () => {
  cacheStats.value = await mediaCache.getCacheStats();
  // 获取会话缓存信息
  sessionCacheInfo.value.entries = mediaCache.sessionCache ? mediaCache.sessionCache.size : 0;
};

const clearCache = async () => {
  if (confirm('确定要清除所有媒体缓存吗？')) {
    const success = await mediaCache.clearCache();
    if (success) {
      // 清除后重新加载统计信息
      await loadCacheStats();
      alert('缓存已清除');
    } else {
      alert('清除缓存失败');
    }
  }
};

onMounted(() => {
  loadCacheStats();
});
</script>

<template>
  <div class="cache-settings-view">
    <div class="setting-item">
      <h3>媒体文件缓存</h3>
      <p>缓存媒体文件以提高加载速度并支持离线查看</p>
      
      <div class="cache-stats" v-if="cacheStats.supported">
        <div class="stat-item">
          <span class="stat-label">缓存文件数:</span>
          <span class="stat-value">{{ cacheStats.entries }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">缓存大小:</span>
          <span class="stat-value">{{ formatBytes(cacheStats.size) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">会话缓存数:</span>
          <span class="stat-value">{{ sessionCacheInfo.entries }}</span>
        </div>
      </div>
      
      <div class="cache-stats" v-else>
        <p>当前浏览器不支持缓存功能</p>
      </div>
      
      <button @click="loadCacheStats" class="secondary-btn">刷新统计</button>
      <button @click="clearCache" class="danger-btn">清除缓存</button>
    </div>
  </div>
</template>

<style scoped>
.cache-settings-view {
  flex: 1;
  padding: 1rem;
}

.setting-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.setting-item h3 {
  margin-top: 0;
}

.cache-stats {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-weight: bold;
}

.stat-value {
  color: #007bff;
}

button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.secondary-btn {
  background-color: #6c757d;
  color: white;
}

.secondary-btn:hover {
  background-color: #5a6268;
}

.danger-btn {
  background-color: #dc3545;
  color: white;
}

.danger-btn:hover {
  background-color: #c82333;
}
</style>