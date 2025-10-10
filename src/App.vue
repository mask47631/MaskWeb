<script setup>
import IndexHeader from "@/components/header/IndexHeader.vue";
import { isPartition } from "@/js/common.js";
import { onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import Index from "@/components/left/index.vue";

function checkPartition() {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  isPartition.value = window.innerWidth > 50 * rem;
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
    <div id="left-index">
      <index/>
    </div>
    <div id="right-index" :class="rightIndexClass">
      <router-view />
    </div>
  </main>
</template>

<style scoped>

.logo {
  display: block;
  width: 7rem;
  height: 7rem;
}
</style>
