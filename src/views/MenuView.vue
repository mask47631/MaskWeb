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
.menu-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  button{
    margin-bottom: 0.5rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
}
.setting-div{
  display: flex;
  height: 3rem;
  margin-bottom: 0.5rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  .setting-div-text{
    font-size: 1.5rem;
    margin: auto;
    white-space: nowrap;
  }
  input{
    flex: 1;
    margin-left: 0.5rem;
    text-align: center;
  }
}
</style>