<script setup>

import {top_title} from "@/js/common.js";
import {getCurrentInstance, ref} from "vue";
import {usingServer} from "@/js/server.js";
import {useRouter} from "vue-router";
const router = useRouter();
const email = ref('')
const password = ref('')
const username = ref('')
const instance = getCurrentInstance()

top_title.value = usingServer.value.title+'[登录]'
async function login() {
  if (email.value == '' || password.value == ''){
    return
  }
  instance.appContext.config.globalProperties.$loading.show('登录中...')
  const info = await usingServer.value.apiClient.login(email.value, password.value)
  instance.appContext.config.globalProperties.$loading.hide()
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
  instance.appContext.config.globalProperties.$loading.show('注册中...')
  const info = await usingServer.value.apiClient.register(username.value, password.value, email.value)
  instance.appContext.config.globalProperties.$loading.hide()
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