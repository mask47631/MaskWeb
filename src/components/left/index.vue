<script setup>
import { useRouter } from 'vue-router';
import ServerCard from "@/components/left/ServerCard.vue";
import {serverList, usingServer} from "@/js/server.js";
import {nextTick, ref} from "vue";
import ServerCardList from "@/components/left/ServerCardList.vue";
import IconHouse from "@/components/icons/IconHouse.vue";
import IconGoods from "@/components/icons/IconGoods.vue";
import ToolBoxList from "@/components/left/ToolBoxList.vue";

const router = useRouter();
const btBarSelect = ref('ServerCardList');

</script>

<template>
<div class="left-index">
  <ServerCardList v-show="btBarSelect === 'ServerCardList'"/>
  <ToolBoxList v-show="btBarSelect === 'ToolBoxList'"></ToolBoxList>
  <div class="btBar-index">
    <div class="btBar-btn" @click="btBarSelect = 'ServerCardList'">
      <IconHouse class="btBar-icon"/>
      <div>服务器</div>
    </div>
    <div class="btBar-btn" @click="btBarSelect = 'ToolBoxList'">
      <IconGoods class="btBar-icon"/>
      <div>工具箱</div>
    </div>
  </div>
</div>
<!--<button @click="navigateToWelcome">跳转到 Welcome</button>-->
</template>

<style scoped>
.left-index{
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  flex-direction: column;
  min-height: 0;
}
.btBar-index{
  display: flex;
  width: 100%;
  min-height: 0;
  margin-top: auto;
  justify-content: space-evenly;
  border-top: 1px solid #e0e0e0;
}
.btBar-icon{
  width: 3rem;
  height: 3rem;
}
</style>