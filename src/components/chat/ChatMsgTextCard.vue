<script setup>
import {ref, computed, getCurrentInstance} from "vue";
import MagnetLinkPreview from './MagnetLinkPreview.vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      type: 0,
      text:''
    })
  }
});

const showPreviewBox = ref(false);
const isMagnetLink = computed(() => {
  return props.data.text.startsWith('magnet:?');
});

const showPreview = async () => {
  showPreviewBox.value = true;
};

const closePreview = () => {
  showPreviewBox.value = false;
};
</script>

<template>
  <div class="CMTC">
    {{data.text}}
    <button v-if="isMagnetLink" @click="showPreview" >
      磁链预览
    </button>
    <MagnetLinkPreview 
      :magnet-link="data.text" 
      :visible="showPreviewBox" 
      @close="closePreview"
      @update:visible="showPreviewBox = $event"
    />
  </div>
</template>

<style scoped>
.CMTC{
  width: 100%;
  word-break: break-all;
  word-wrap: break-word;
  white-space: normal;
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>