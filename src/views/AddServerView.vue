<script setup>

import {Server, serverList} from "@/js/server.js";
import {top_title} from "@/js/common.js";
import {ref} from "vue";
import {useRouter} from "vue-router";
top_title.value = '添加服务器'
const serverUrl = ref('')
const msg = ref("")
const router = useRouter();
const canAdd = ref(true)
const addServer = async () => {
  canAdd.value = false
  msg.value = ''
  if (!serverUrl.value || serverUrl.value === '') {
    canAdd.value = true
    return;
  }
  for (let i = 0; i < serverList.value.length; i++){
    if (serverList.value[i].baseURL === serverUrl.value){
      canAdd.value = true
      msg.value = "服务器已存在"
      return
    }
  }
  const server = new Server('', '未命名', '', 0,serverUrl.value)
  let info = await server.getVersion()
  if (!info){
    canAdd.value = true
    msg.value = "获取服务器信息失败"
    return
  }
  server.addServer()
  router.push('/')
}
</script>

<template>
  <div class="menu-view">
    <div class="setting-div">
      <div v-if="msg&&msg!==''" class="setting-div-text" style="color: red">{{msg}}</div>
    </div>
    <div class="setting-div">
      <div class="setting-div-text">服务器url</div>
      <input v-model="serverUrl">
    </div>
    <button :disabled="!canAdd" @click="addServer">添加</button>
  </div>
</template>

<style scoped>

</style>