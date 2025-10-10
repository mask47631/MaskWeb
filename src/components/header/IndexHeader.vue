<script setup>

import {isPartition, top_title} from "@/js/common.js";
import IconLeft from "@/components/icons/IconLeft.vue";
import IconAdd from "@/components/icons/IconAdd.vue";
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
<div class="index-header">
  <div class="index-header-left" >
    <IconLeft width="100%" height="100%" v-if="!isPartition && $route.path !== '/'" @click="router.push('/')"/>
  </div>
  <div class="index-header-text">{{top_title}}</div>
  <div class="index-header-right">
    <IconAdd width="100%" height="100%"/>
  </div>
</div>
</template>

<style scoped>
.index-header-text{
  font-size: 2rem;
  text-align: center;
  overflow: hidden;
  margin: auto;
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