<script setup>

import {top_title,partitionWidth} from "@/js/common.js";
import {ref} from "vue";

top_title.value = '设置'

</script>

<template>
  <div class="menu-view">
    <button>添加服务器</button>
    <div class="setting-div">
      <div class="setting-div-text">分屏宽度</div>
      <input v-model="partitionWidth" type="number">
    </div>
  </div>
</template>

<style scoped>

</style>