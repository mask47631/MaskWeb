<script setup>
import {computed, onMounted, ref} from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      img: '',
      title: '默认标题',
      description: '默认描述',
      timestamp: 0,//时间戳
      url: '',
      newChatMsg:''
    })
  }
});

const emit = defineEmits(['delete']);

const showContextMenu = ref(false);
const touchStartTime = ref(0);
const longPressTimeout = ref(null);

const formattedTimestamp = computed(() => {
  const date = new Date(props.data.timestamp);
  const now = new Date();
  
  if (date.getFullYear() !== now.getFullYear()) {
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
  } else if (date.getMonth() !== now.getMonth() || date.getDate() !== now.getDate()) {
    return `${date.getMonth() + 1}-${date.getDate()}`;
  } else {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
});

onMounted(()=>{
  if (props.data.token && props.data.token !== ''){
    props.data.initServer()
  }
})

// 处理右键事件
function handleRightClick(event) {
  event.preventDefault();
  showContextMenu.value = true;
  positionContextMenu(event);
}

// 处理触摸开始事件（用于长按）
function handleTouchStart(event) {
  touchStartTime.value = Date.now();
  longPressTimeout.value = setTimeout(() => {
    showContextMenu.value = true;
    positionContextMenu(event.touches[0]);
  }, 2000); // 2000ms长按触发
}

// 处理触摸结束事件
function handleTouchEnd() {
  clearTimeout(longPressTimeout.value);
}

// 处理鼠标按下事件
function handleMouseDown(event) {
  if (event.button === 2) { // 右键
    handleRightClick(event);
  }
}

// 定位上下文菜单
function positionContextMenu(event) {
  // 菜单定位将在模板中通过CSS处理
  // 这里可以添加更复杂的定位逻辑如果需要的话
}

// 确认删除
function confirmDelete() {
  emit('delete', props.data);
  showContextMenu.value = false;
}

// 取消删除
function cancelDelete() {
  showContextMenu.value = false;
}

// 点击其他地方关闭菜单
function handleClickOutside(event) {
  if (showContextMenu.value && !event.target.closest('.context-menu')) {
    showContextMenu.value = false;
  }
}

// 在组件挂载时添加全局点击监听器
document.addEventListener('click', handleClickOutside);

// 在组件卸载前移除监听器
onMounted(() => {
  // 清理函数会在组件卸载前执行
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
});
</script>

<template>
<div class="server-card" 
     @mousedown="handleMouseDown" 
     @touchstart="handleTouchStart" 
     @touchend="handleTouchEnd"
     @contextmenu.prevent="handleRightClick">
  <img :src="data.img"  alt=""/>
  <div class="server-card-divider">
    <div class="server-card-right">
      <div class="server-card-right-top">
        <div class="server-card-right-top-left">{{ data.title }}</div>
        <div class="server-card-right-top-right">{{ formattedTimestamp }}</div>
      </div>
      <div class="server-card-but">
        <div class="server-card-right-but">{{ data.newChatMsg }}</div>
        <div v-if="data.newMagCount && data.newMagCount>0" class="server-card-but-count">{{ data.newMagCount }}</div>
      </div>
    </div>
    <div class="divider"></div>
  </div>
  
  <!-- 删除确认对话框 -->
  <div v-if="showContextMenu" class="context-menu" :class="{ show: showContextMenu }">
    <div class="context-menu-content">
      <p>确定要删除这个服务器吗？</p>
      <div class="context-menu-buttons">
        <button class="confirm-btn" @click="confirmDelete">是</button>
        <button class="cancel-btn" @click="cancelDelete">否</button>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.server-card-right-top-left{
  flex: 1;
  font-size: 1.3rem;
  display: flex;
  overflow: hidden;
}
.server-card-right-top-right{
  color: #999999;
}
.server-card{
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  height: 4rem;
  position: relative;
  img{
    width: 4rem;
    height: 4rem;
    margin-right: 0.5rem;
  }
}
.divider {
  height: 1px;
  background-color: #e0e0e0;
  margin-top: auto;
  width: 100%;
}
.server-card-divider{
  display: flex;
  flex: 1;
  flex-direction: column;
}
.server-card-right{
  display: flex;
  flex: 1;
  flex-direction: column;
}
.server-card-right-top{
  flex: 1;
  display: flex;
}
.server-card-right-but{
  flex: 1;
  overflow: hidden;
  color: #999999;
}
.server-card-but{
  flex: 1;
  overflow: hidden;
  display: flex;
}
.server-card-but-count{
  min-width: 2rem;
  border-radius: 1rem;
  background: red;
  color: white;
  text-align: center;
  padding: 0.25rem;
}

.context-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.context-menu-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 250px;
}

.context-menu-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.confirm-btn, .cancel-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn {
  background-color: #ff4d4f;
  color: white;
}

.cancel-btn {
  background-color: #d9d9d9;
  color: #333;
}
</style>