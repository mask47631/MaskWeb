<script setup>
import { ref, defineProps, defineEmits, watch, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'update:visible']);

const show = ref(false);
const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const startTranslateX = ref(0);
const startTranslateY = ref(0);
const imageElement = ref(null);

const closeViewer = () => {
  show.value = false;
  emit('close');
  emit('update:visible', false);
  // 重置变换
  resetTransform();
};

const resetTransform = () => {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
};

// 图片变换样式
const imageStyle = computed(() => ({
  transform: `scale(${scale.value}) translate(${translateX.value}px, ${translateY.value}px)`,
  cursor: isDragging.value ? 'grabbing' : (scale.value > 1 ? 'grab' : 'default')
}));

// 缩放功能
const zoomIn = () => {
  scale.value *= 1.2;
};

const zoomOut = () => {
  if (scale.value > 0.1) {
    scale.value /= 1.2;
  }
};

const fitToScreen = () => {
  resetTransform();
};

// 鼠标事件处理
const handleMouseDown = (e) => {
  // 阻止默认的拖拽行为
  e.preventDefault();
  
  if (scale.value <= 1) return;
  
  isDragging.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
  startTranslateX.value = translateX.value;
  startTranslateY.value = translateY.value;
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

const handleMouseMove = (e) => {
  if (!isDragging.value) return;
  
  const dx = e.clientX - startX.value;
  const dy = e.clientY - startY.value;
  
  translateX.value = startTranslateX.value + dx / scale.value;
  translateY.value = startTranslateY.value + dy / scale.value;
};

const handleMouseUp = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};

// 滚轮缩放
const handleWheel = (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  scale.value *= delta;
};

// 阻止图片拖拽的默认行为
const handleDragStart = (e) => {
  e.preventDefault();
};

// 监听 visible prop 变化
watch(() => props.visible, (newVal) => {
  show.value = newVal;
  if (!newVal) {
    resetTransform();
  }
}, { immediate: true });

// 组件挂载时添加事件监听器
onMounted(() => {
  // 添加滚轮事件监听器到图像容器上
  const container = document.querySelector('.image-viewer-container');
  if (container) {
    container.addEventListener('wheel', handleWheel, { passive: false });
  }
});

// 组件卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  
  const container = document.querySelector('.image-viewer-container');
  if (container) {
    container.removeEventListener('wheel', handleWheel);
  }
});
</script>

<template>
  <div v-if="show" class="image-viewer-overlay" @click="closeViewer">
    <div class="image-viewer-container" @click.stop>
      <!-- 控制按钮 -->
      <div class="image-viewer-controls">
        <button class="control-button" @click="zoomIn">+</button>
        <button class="control-button" @click="zoomOut">-</button>
        <button class="control-button" @click="fitToScreen">↺</button>
        <button class="control-button close-button" @click="closeViewer">✕</button>
      </div>
      
      <!-- 图片 -->
      <img 
        ref="imageElement"
        :src="imageUrl" 
        class="image-viewer-image" 
        :style="imageStyle"
        @mousedown="handleMouseDown"
        @dragstart="handleDragStart"
      />
    </div>
  </div>
</template>

<style scoped>
.image-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.image-viewer-container {
  max-width: 90%;
  max-height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-viewer-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  transition: transform 0.2s ease;
  user-select: none;
  -webkit-user-drag: none; /* 防止Safari中的拖拽 */
}

.image-viewer-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10001;
  display: flex;
  gap: 10px;
}

.control-button {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.3s;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-button {
  background: rgba(255, 0, 0, 0.5);
}

.close-button:hover {
  background: rgba(255, 0, 0, 0.7);
}
</style>