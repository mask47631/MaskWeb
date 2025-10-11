<script setup>
import IndexHeader from "@/components/header/IndexHeader.vue";
import { isPartition,partitionWidth } from "@/js/common.js";
import {onMounted, onUnmounted, computed, ref} from "vue";
import { useRoute } from "vue-router";
import Index from "@/components/left/index.vue";

const rightStyle = ref({});
const leftStyle = ref({});

function checkPartition() {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  isPartition.value = window.innerWidth > partitionWidth.value * rem;
  if (isPartition.value){
    rightStyle.value = {}
    leftStyle.value = {}
  }else {
    rightStyle.value = {
      'position': 'absolute',
      'top': 0,
      'left': 0,
      'width': '100%'
    }
      leftStyle.value = {
        'width': '100%',
        'min-width': '30rem'
    }
  }
}

onMounted(() => {
  checkPartition();
  window.addEventListener("resize", checkPartition);
});
onUnmounted(() => {
  window.removeEventListener("resize", checkPartition);
});

const route = useRoute();
const rightIndexClass = computed(() => {
  return {
    'right-index--hidden': !isPartition.value && route.path === '/'
  };
});
</script>

<template>
  <header>
    <IndexHeader />
  </header>
  <main>
    <div id="left-index" :style="leftStyle">
      <index/>
    </div>
    <div id="right-index" :class="rightIndexClass" :style="rightStyle">
      <router-view />
    </div>
  </main>
</template>

<style scoped>

</style>
