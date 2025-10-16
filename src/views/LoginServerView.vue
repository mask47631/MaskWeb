<script setup>

import {top_title} from "@/js/common.js";
import {ref} from "vue";
import {usingServer} from "@/js/server.js";
import {useRouter} from "vue-router";
const router = useRouter();
const email = ref('')
const password = ref('')
const username = ref('')
top_title.value = usingServer.value.title+'[登录]'
async function login() {
  if (email.value == '' || password.value == ''){
    return
  }
  const info = await usingServer.value.apiClient.login(email.value, password.value)
  console.log( info)
  if (info && info.success){
    usingServer.value.setToken(info.data.token)
    router.push('/chackServer');
  }
}
async function stompCliented() {
  if (username.value == '' || email.value == '' || password.value == ''){
    return
  }
  const info = await usingServer.value.apiClient.register(username.value, password.value, email.value)
  console.log( info)
  if (info && info.success){
    usingServer.value.setToken(info.data.token)
    router.push('/chackServer');
  }
}
</script>

<template>
  <div class="menu-view">
    <div class="setting-div">
      <div class="setting-div-text">邮箱</div>
      <input v-model="email">
    </div>
    <div class="setting-div">
      <div class="setting-div-text">密码</div>
      <input v-model="password" type="password">
    </div>
    <button @click="login">登录</button>
    <div class="setting-div">
      <div class="setting-div-text">昵称</div>
      <input v-model="username">
    </div>
    <button @click="stompCliented">注册</button>
  </div>
</template>

<style scoped>

</style>