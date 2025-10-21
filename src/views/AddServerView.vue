<script setup>

import {Server, serverList} from "@/js/server.js";
import {top_title} from "@/js/common.js";
import {getCurrentInstance, ref} from "vue";
import {useRouter} from "vue-router";
top_title.value = '添加服务器'
const serverUrl = ref('')
const msg = ref("")
const router = useRouter();
const canAdd = ref(true)
const instance = getCurrentInstance()
const chackAddServer = async () => {
  for (let i = 0; i < serverList.value.length; i++){
    if (serverList.value[i].baseURL === serverUrl.value){
      canAdd.value = true
      msg.value = "服务器已存在"
      return false
    }
  }
  instance.appContext.config.globalProperties.$loading.show('获取服务器信息...')
  const server = new Server('', '未命名', '', 0,serverUrl.value)
  let info = await server.getVersion()
  instance.appContext.config.globalProperties.$loading.hide()
  if (!info){
    canAdd.value = true
    msg.value = "获取服务器信息失败"
    return false
  }
  server.addServer()
  router.push('/')
  return  true
}
const addServer = async () => {
  canAdd.value = false
  msg.value = ''
  if (!serverUrl.value || serverUrl.value === '') {
    canAdd.value = true
    return;
  }
  // 如果serverUrl.value以/结尾，则删除/
  if (serverUrl.value.endsWith('/')) {
    serverUrl.value = serverUrl.value.slice(0, -1);
  }
  let ok = await chackAddServer()
  if (!ok && !serverUrl.value.startsWith('http')) {
    serverUrl.value = 'http://' + serverUrl.value
    ok = await chackAddServer()
  }
  if (!ok && !serverUrl.value.startsWith('https')) {
    serverUrl.value ='https://'+ serverUrl.value.slice(7, serverUrl.value.length)
    await chackAddServer()
  }
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