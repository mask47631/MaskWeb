<script setup>
import { useRouter } from 'vue-router';
import ServerCard from "@/components/left/ServerCard.vue";
import {serverList, usingServer} from "@/js/server.js";

const router = useRouter();

function serverListClick(item) {
  console.log(item);
  usingServer.value = item;
  if (!item.connect){
    router.push('/chackServer');
  }else {
    router.push('/chatServer');
  }
}

</script>

<template>
<div class="server-index">
  <ServerCard v-for="(item, index) in serverList" :key="index" :data="item" @click="serverListClick(item)"/>
</div>
<!--<button @click="navigateToWelcome">跳转到 Welcome</button>-->
</template>

<style scoped>
.server-index{
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: auto;
  flex-direction: column;
  min-height: 0;
}
</style>