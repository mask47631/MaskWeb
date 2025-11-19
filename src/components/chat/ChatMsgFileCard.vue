<script setup>
import {usingServer} from "@/js/server.js";
import { ref } from 'vue';
import ImageViewer from '@/components/ImageViewer.vue';
import mediaCache from '@/js/mediaCache.js';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      type: 0,
      text:[]
    })
  }
});

for (let i = 0; i < props.data.text.length; i++){
  props.data.text[i].url = usingServer.value.baseURL+'/file/private/'+props.data.text[i].id+'/'+usingServer.value.token
}

const imageViewerVisible = ref(false);
const currentImageUrl = ref('');

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function downloadFile(item) {
  try {
    // 首先尝试从缓存获取文件
    const cachedBlob = await mediaCache.getCachedMediaFile(item.url);
    if (cachedBlob) {
      // 使用缓存版本
      const blobUrl = window.URL.createObjectURL(cachedBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = item.originalName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      return;
    }

    // 如果缓存中没有，从网络获取
    const response = await fetch(item.url);
    if (!response.ok) throw new Error('网络响应不正常');
    
    const blob = await response.blob();
    
    // 缓存文件以供将来使用
    await mediaCache.cacheMediaFile(item.url, blob);
    
    // 创建下载链接
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = item.originalName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('下载文件时出错:', error);
    // 如果获取方法失败，回退到直接链接方式
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.originalName;
    link.target = '_blank';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

const showImagePreview = async (url) => {
  currentImageUrl.value = url;
  imageViewerVisible.value = true;
};

// 组件挂载时预加载媒体文件
import { onMounted } from 'vue';

onMounted(() => {
  // 预加载图片、视频和音频文件
  props.data.text.forEach(async (item) => {
    if (item.contentType && 
        (item.contentType.startsWith('image') || 
         item.contentType.startsWith('video') || 
         item.contentType.startsWith('audio'))) {
      // 检查是否已缓存，避免重复预加载
      const isCached = await mediaCache.isMediaFileCached(item.url);
      if (!isCached) {
        // 仅在未缓存时预加载
        mediaCache.preloadMediaFile(item.url);
      }
    }
  });
});
</script>

<template>
<div class="chat-mag-file" v-for="(item, index) in data.text" :key="index">
  <img v-if="item.contentType && item.contentType.startsWith('image')" :src="item.url" alt="" @click="showImagePreview(item.url)">
  <video v-else-if="item.contentType && item.contentType.startsWith('video')" controls>
    <source :src="item.url" :type="item.contentType">
  </video>
  <audio v-else-if="item.contentType && item.contentType.startsWith('audio')" controls>
    <source :src="item.url" :type="item.contentType">
  </audio>
  <div class="chat-mag-file-card" v-else>
    <div class="file-info">
      <div class="file-name">{{ item.originalName }}</div>
      <div class="file-size">{{ formatFileSize(item.fileSize) }}</div>
    </div>
    <button class="download-btn" @click="downloadFile(item)">下载</button>
  </div>
</div>

<ImageViewer 
  :image-url="currentImageUrl"
  :visible="imageViewerVisible"
  @close="imageViewerVisible = false"
  @update:visible="imageViewerVisible = $event"
/>
</template>

<style scoped>
.chat-mag-file{
  min-width: 0;
  video, audio, img{
    max-width: 100%;
    max-height: 20rem;
    margin-bottom: 0.2rem;
  }
  video, img{
    height: 10rem;
    object-fit: contain;
  }
  img {
    cursor: pointer;
  }
}

.chat-mag-file-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.file-info {
  flex-grow: 1;
  margin-right: 10px;
}

.file-name {
  font-weight: bold;
  word-break: break-all;
}

.file-size {
  font-size: 0.8em;
  color: #666;
}

.download-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.download-btn:hover {
  background-color: #0056b3;
}
</style>