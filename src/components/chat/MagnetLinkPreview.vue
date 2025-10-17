<script setup>
import { ref, getCurrentInstance, computed, watch } from "vue";
import ImageViewer from '../ImageViewer.vue';

const props = defineProps({
  magnetLink: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'close']);

const previewData = ref(null);
const instance = getCurrentInstance();
const showImageViewer = ref(false);
const currentImageUrl = ref('');

const showPreviewBox = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const loadPreview = async () => {
  if (!props.magnetLink) return;
  
  instance.appContext.config.globalProperties.$loading.show('正在解析...')
  
  try {
    // 获取磁力链接信息
    const response = await fetch("https://whatslink.info/api/v1/link?url=" + props.magnetLink)
    if (!response.ok){
      alert("磁力链接解析失败")
      return
    }
    previewData.value = await response.json();
  } catch (error) {
    alert("磁力链接解析失败: " + error.message)
  }
  instance.appContext.config.globalProperties.$loading.hide()
};

// 当组件显示时加载预览数据
if (props.visible) {
  loadPreview();
}

const closePreview = () => {
  emit('close');
  emit('update:visible', false);
};

// 监听visible变化，当变为true时加载数据
watch(() => props.visible, (newVal) => {
  if (newVal) {
    loadPreview();
  }
});

const showImagePreview = (imageUrl) => {
  currentImageUrl.value = imageUrl;
  showImageViewer.value = true;
};
</script>

<template>
  <div v-if="showPreviewBox" class="preview-overlay" @click="closePreview">
    <div class="preview-box" @click.stop>
      <div v-if="previewData">
        <h3>{{ previewData.name }}</h3>
        <p>类型: {{ previewData.type }} ({{ previewData.file_type }})</p>
        <p>大小: {{ previewData.size }} 字节</p>
        <p>文件数量: {{ previewData.count }}</p>
        <div v-if="previewData.screenshots && previewData.screenshots.length > 0" class="screenshots">
          <h4>预览图:</h4>
          <div class="screenshot-grid">
            <img 
              v-for="(screenshot, index) in previewData.screenshots" 
              :key="index"
              :src="screenshot.screenshot" 
              :alt="`Preview ${index + 1}`"
              class="screenshot-image"
              @click="showImagePreview(screenshot.screenshot)"
            />
          </div>
        </div>
        <p>Powered by: <a href="https://whatslink.info/" target="_blank">WhatsLink</a></p>
      </div>
    </div>
  </div>
  
  <ImageViewer 
    :image-url="currentImageUrl" 
    :visible="showImageViewer" 
    @close="showImageViewer = false"
    @update:visible="showImageViewer = $event"
  />
</template>

<style scoped>
.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.preview-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;
  position: relative;
}

.screenshots {
  margin-top: 15px;
}

.screenshot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.screenshot-image {
  width: 100%;
  height: auto;
  border-radius: 4px;
}
</style>