<script setup>
import {top_title,partitionWidth} from "@/js/common.js";
import {ref} from "vue";
import {useRouter} from "vue-router";

top_title.value = '设置'
const router = useRouter();

// 读取 package.json 中的版本号
import pkg from '../../package.json'
const version = pkg.version;

const addServer = async () => {
  router.push('/addServer');
};

</script>

<template>
  <div class="menu-view">
    <button @click="addServer">添加服务器</button>
    <div class="setting-div">
      <div class="setting-div-text">分屏宽度</div>
      <input v-model="partitionWidth" type="number">
    </div>
    <div class="setting-div">
      <div class="setting-div-text">版本号：{{ version }}</div>
    </div>
  </div>
</template>

<style scoped>

</style>