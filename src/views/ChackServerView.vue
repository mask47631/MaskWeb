<script setup>

import {onMounted, ref} from "vue";
import {usingServer} from "@/js/server.js";
import {useRouter} from "vue-router";
import {top_title} from "@/js/common.js";
const router = useRouter();
const msg = ref("获取服务器信息")
top_title.value = '检测'
function stompCliented (){
  if (usingServer.value.connected){
    usingServer.value.StompCliented = function (){}
    router.push('/chatServer');
  }else {
    msg.value = "服务连接失败"
  }
}
onMounted(async () => {
  let info = await usingServer.value.getVersion();
  if (!info){
    msg.value = "获取服务器信息失败"
    return
  }
  top_title.value = usingServer.value.title+'[检测]'
  msg.value = "获取用户信息"
  info = await usingServer.value.apiClient.getSelf()
  if (!info || !info.success){
    msg.value = "获取用户信息失败"
    router.push('/loginServer');
    return
  }
  usingServer.value.userInfo = info.data
  msg.value = "服务初始化"
  if (usingServer.value.connected){
    router.push('/chatServer');
    return
  }
  usingServer.value.StompCliented = stompCliented
  usingServer.value.buildStompClient()
})

</script>

<template>
<div class="cs-msg">
  {{msg}}
</div>
</template>

<style scoped>
.cs-msg{
  flex:1;
  display: flex;
  justify-content: center;
  margin: auto;
}
</style>