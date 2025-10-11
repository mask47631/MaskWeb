<script setup>

import {isPartition, top_title} from "@/js/common.js";
import IconLeft from "@/components/icons/IconLeft.vue";
import { useRouter } from 'vue-router';
import IconSetting from "@/components/icons/IconSetting.vue";

const router = useRouter();

const handleIconLeftClick = () => {
  top_title.value = '会话列表';
  router.push('/');
};

</script>

<template>
<div class="index-header">
  <div class="index-header-left" >
    <IconLeft width="100%" height="100%" v-if="!isPartition && $route.path !== '/'" @click="handleIconLeftClick"/>
  </div>
  <div class="index-header-text">{{top_title}}</div>
  <div class="index-header-right">
    <IconSetting width="100%" height="100%" @click="router.push('/menu')"/>
  </div>
</div>
</template>

<style scoped>
.index-header-text{
  font-size: 1.5rem;
  text-align: center;
  overflow: hidden;
  margin: auto;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 20rem;
}
.index-header-left, .index-header-right{
  width: 3rem;
  height: 3rem;
  overflow: hidden;
}
.index-header{
  display: flex;
  flex: 1;
}
</style>