<script setup>
import {usingServer} from "@/js/server.js";
import ChatCard from "@/components/chat/ChatCard.vue";

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

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function downloadFile(item) {
  // 使用 fetch 获取文件内容，然后创建 Blob URL 来确保文件名正确设置
  fetch(item.url)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = item.originalName; // 这里使用原始文件名
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(error => {
      console.error('下载文件时出错:', error);
      // 如果 fetch 方法失败，则回退到直接链接方式
      const link = document.createElement('a');
      link.href = item.url;
      link.download = item.originalName;
      link.target = '_blank';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
}
</script>

<template>
<div class="chat-mag-file" v-for="(item, index) in data.text" :key="index">
  <img v-if="item.contentType && item.contentType.startsWith('image')" :src="item.url" alt="">
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
</template>

<style scoped>
.chat-mag-file{
  min-width: 0;
  video, audio, img{
    max-width: 100%;
    max-height: 20rem;
    margin-bottom: 0.2rem;
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