<script setup>
import ChatCard from "@/components/chat/ChatCard.vue";
import {top_title} from "@/js/common.js";
import {serverList, usingServer} from "@/js/server.js";
import IconAdd from "@/components/icons/IconAdd.vue";
import IconSend from "@/components/icons/IconSend.vue";
import ServerCard from "@/components/left/ServerCard.vue";
import {ref, onMounted, nextTick, watch, getCurrentInstance} from 'vue';
import {useRouter} from "vue-router";
const router = useRouter();

top_title.value = usingServer.value.title
if (!usingServer.value){
  router.push('/');
}
// 获取 textarea 元素的引用
const textareaRef = ref(null);
const chatListViewRef = ref(null);
const fileInputRef = ref(null);

// 添加键盘事件处理函数
const handleKeydown = (event) => {
  // 如果按下的是 Ctrl+Enter，则插入换行符
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault();
    const textarea = event.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    // 在光标位置插入换行符
    textarea.value = text.substring(0, start) + '\n' + text.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + 1;
    
    // 触发输入事件以调整高度
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }
  
  // 如果按下的是 Enter 且没有按住 Ctrl，则发送消息
  if (event.key === 'Enter' && !event.ctrlKey) {
    event.preventDefault();
    sendMessage();
  }
};

// 自动调整 textarea 高度
const adjustTextareaHeight = () => {
  const textarea = textareaRef.value;
  if (textarea) {
    // 保存当前滚动位置
    const scrollTop = textarea.scrollTop;
    
    // 重置高度以获取正确的 scrollHeight
    textarea.style.height = '1.5rem';
    console.log(textarea.scrollHeight)
    // 设置新高度，最小为 1.5rem (单行高度)，最大为 6rem
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 24), 96);
    textarea.style.height = newHeight + 'px';

    // 恢复滚动位置
    textarea.scrollTop = scrollTop;
  }
};
const content = ref('');
const instance = getCurrentInstance()
// 文件上传处理
const handleFileUpload = async (event) => {
  const files = event.target.files;
  if (files.length === 0) return;
  let fileList = []

  // 处理有效的文件上传
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // 这里可以添加文件上传逻辑
    console.log('上传文件:', file.name);
    // 例如，可以将文件信息发送到服务器或添加到聊天记录中
    instance.appContext.config.globalProperties.$loading.show('正在上传('+(i+1)+'/'+files.length+')')
    const res = await usingServer.value.apiClient.uploadFile(file)
    instance.appContext.config.globalProperties.$loading.hide()
    if (res && res.success){
      fileList.push(res.data)
    }
  }
  usingServer.value.sendMessage(JSON.stringify({
    text: fileList,
    type: 'file'
  }));

  // 清空文件输入框
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

// 触发文件选择
const triggerFileSelect = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

// 发送消息
async function sendMessage() {
  if (!content.value || content.value === '') {
    return;
  }
  usingServer.value.sendMessage(JSON.stringify({
    text: content.value,
    type:'text'
  }));
  // 发送消息后重置 textarea 高度
  await nextTick();
  const textarea = document.getElementById('message-input');
  if (textarea) {
    textareaRef.value = textarea;
    textarea.value = '';
    // 重置为单行高度
    textarea.style.height = '1.5rem';
  }
  content.value = '';
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatListViewRef.value) {
      chatListViewRef.value.scrollTop = chatListViewRef.value.scrollHeight;
    }
  });
};
try {
  usingServer.value.watchId = usingServer.value.chatList[usingServer.value.chatList.length-1].id
  usingServer.value.newMagCount = 0
}catch ( e){
  console.log( e)
}
// 监听 chatList 长度变化
watch(
  () => usingServer.value.chatList.length,
  () => {
    scrollToBottom();
  }
);

// 组件挂载后初始化 textarea 高度
onMounted(() => {

  const textarea = document.getElementById('message-input');
  const chatListView = document.querySelector('.chat-list-view');
  
  if (textarea) {
    textareaRef.value = textarea;
    // 监听输入事件以自动调整高度
    textarea.addEventListener('input', adjustTextareaHeight);
    // 添加键盘事件监听器
    textarea.addEventListener('keydown', handleKeydown);
    // 初始化高度为单行
    textarea.style.height = '1.5rem';
  }
  
  if (chatListView) {
    chatListViewRef.value = chatListView;
  }
  
  // 初始滚动到底部
  scrollToBottom();
});

// 清理事件监听器
// onUnmounted(() => {
//   if (textareaRef.value) {
//     textareaRef.value.removeEventListener('input', adjustTextareaHeight);
//     textareaRef.value.removeEventListener('keydown', handleKeydown);
//   }
// });

</script>

<template>
<div class="chat-server-view">
  <!-- 隐藏的文件输入框 -->
  <input 
    type="file" 
    ref="fileInputRef"
    multiple 
    style="display: none" 
    @change="handleFileUpload"
  >
  <div class="chat-list-view" ref="chatListViewRef">
    <ChatCard v-for="(item, index) in usingServer.value.chatList" :key="index" :data="item"></ChatCard>
    <div v-if="usingServer.value.chatList.length<=0" class="chat-list-null">|･ω･｀)</div>
  </div>
  <div class="chat-input-view">
    <IconAdd class="chat-input-btn" @click="triggerFileSelect"/>
    <textarea 
      v-model="content" 
      class="mo-textarea" 
      id="message-input" 
      ref="textareaRef"
      @keydown="handleKeydown"
    />
    <IconSend class="chat-input-btn" @click="sendMessage"/>
  </div>
</div>
</template>

<style scoped>
.chat-list-null{
  margin: auto;
  text-align: center;
}
.chat-server-view{
  flex: 1;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  min-height: 0;
}
.chat-list-view{
  min-height: 0;
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.chat-input-view{
  margin: 0.5rem;
  display: flex;
  background-color: #fff;
  textarea {
    flex: 1;
    border: none;
    outline: none;
    padding: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    font-size: 1.5rem;
    min-height: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    resize: none;
    box-sizing: border-box;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 0;
    margin-right: 0;
  }

  textarea:focus {
    outline: none;
  }

  /* 自定义样式 */
  .mo-textarea {
    display: inline-block;
    padding: 0 15px;
    line-height: 1.5rem;
    box-sizing: border-box;
    color: #606266;
    background-color: #fff;

    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    height: 1.5rem;
    min-height: 1.5rem;
  }

  /* 提示文字 */
  .mo-textarea::placeholder {
    color: #c0c4cc;
  }

  /* 鼠标hover */
  .mo-textarea:hover {
    border-color: #c0c4cc;
  }

  /* 获得焦点 */
  .mo-textarea:focus {
    border-color: #3677f0;
  }
}
.chat-input-btn{
  width: 3rem;
  height: 3rem;
  cursor: pointer;
}
</style>