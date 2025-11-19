<script setup>

import ServerCard from "@/components/left/ServerCard.vue";
import IconSorting from "@/components/icons/IconSorting.vue";
import {ref} from "vue";

const toolList = ref([
  {
    svg: IconSorting,
    title: '字符串转Unicode',
    url: '/tool/stringToUnicode'
  }
])

</script>

<template>
  <div class="server-index">
    <div class="tool-list-card"
         v-for="(item, index) in toolList"
         :key="index"
        @click="$router.push(item.url)"
    >
      <component  v-if="item.svg" :is="item.svg" class="tool-list-card-img"/>
      <div>{{item.title}}</div>
    </div>
  </div>
</template>

<style scoped>
.server-index{
  display: flex;
  flex: 1;
  width: 100%;
  overflow: auto;
  flex-direction: column;
  min-height: 0;
}
.tool-list-card{
  .tool-list-card-img{
    height: 3rem;
    width: 3rem;
    margin-right: 0.5rem;
  }
  width: 100%;
  margin-top: 0.2rem;
  border-bottom: 1px solid #e0e0e0;
  font-size: 2rem;
  display: flex;

}
</style>