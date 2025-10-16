<script setup>

import {partitionWidth} from "@/js/common.js";
import {usingServer} from "@/js/server.js";
import {useRouter} from "vue-router";
import {ref} from "vue";
import md5 from "js-md5";
const router = useRouter();
const logout = () => {
  usingServer.value.setToken('')
  usingServer.value.disconnect()
  router.push('/');
}
const fileInputRef = ref(null);
let avatar = 'user'
const changeAvatar =async () => {
  if (fileInputRef.value) {
    avatar = 'user'
    fileInputRef.value.click();
  }
}

const changeServerAvatar =async () => {
  if (fileInputRef.value) {
    avatar = 'server'
    fileInputRef.value.click();
  }
}

// 文件上传处理
const handleFileUpload = async (event) => {
  const files = event.target.files;
  if (files.length === 0) return;
  const res = await usingServer.value.apiClient.uploadFile(files[0])
  if (res && res.success){
    if (avatar === 'user'){
      usingServer.value.apiClient.updateSelf({
        avatarUrl: res.data.id
      })
    }else {
      let aurl = usingServer.value.baseURL+'/file/public/'+res.data.id
      let re = await usingServer.value.apiClient.updateFilePublicStatus(res.data.id, true)
      if (re && re.success){
        re= await usingServer.value.apiClient.saveConfig([{
          key: 'app.avatarUrl',
          value: aurl,
          remark:'服务器图标'
        }])
        if (re && re.success){
          usingServer.value.getVersion()
        }
      }

    }
  }

  // 清空文件输入框
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};
const changeusername =async () => {
  const res = await usingServer.value.apiClient.updateSelf({
    username: usingServer.value.userInfo.username
  })
  if (res && res.success){
    const info = await usingServer.value.apiClient.getSelf()
    if (!info || !info.success){
      return
    }
    usingServer.value.userInfo = info.data
  }
}

const changeemail =async () => {
  const res = await usingServer.value.apiClient.updateSelf({
    email: usingServer.value.userInfo.email
  })
  if (res && res.success){
    const info = await usingServer.value.apiClient.getSelf()
    if (!info || !info.success){
      return
    }
    usingServer.value.userInfo = info.data
  }
}

const changepassword =async () => {
  const res = await usingServer.value.apiClient.updateSelf({
    password: md5(usingServer.value.userInfo.password)
  })
  if (res && res.success){
    const info = await usingServer.value.apiClient.getSelf()
    if (!info || !info.success){
      return
    }
    usingServer.value.userInfo = info.data
  }
}

const changeServerName =async () => {
  const re= await usingServer.value.apiClient.saveConfig([{
    key: 'app.name',
    value: usingServer.value.title,
    remark:'服务器名称'
  }])
  if (re && re.success){
    usingServer.value.getVersion()
  }
}

</script>

<template>
  <div class="menu-view">
    <!-- 隐藏的文件输入框 -->
    <input
        type="file"
        ref="fileInputRef"
        accept="image/*"
        style="display: none"
        @change="handleFileUpload"
    >
    <div class="setting-div">
      <div class="setting-div-text">
        用户ID：{{usingServer.value.userInfo.id}}
      </div>
    </div>

    <div class="setting-div">
      <div class="setting-div-text">昵称</div>
      <input v-model="usingServer.value.userInfo.username">
      <button @click="changeusername">修改</button>
    </div>
    <div class="setting-div">
      <div class="setting-div-text">邮箱</div>
      <input v-model="usingServer.value.userInfo.email">
      <button @click="changeemail">修改</button>
    </div>
    <div class="setting-div">
      <div class="setting-div-text">密码</div>
      <input v-model="usingServer.value.userInfo.password" type="password">
      <button @click="changepassword">修改</button>
    </div>
    <button @click="changeAvatar">修改头像</button>
    <div v-if="usingServer.value.userInfo.role === 'admin'" class="setting-div">
      <div class="setting-div-text">服务器名称</div>
      <input v-model="usingServer.value.title">
      <button @click="changeServerName">修改</button>
    </div>
    <button v-if="usingServer.value.userInfo.role === 'admin'" @click="changeServerAvatar">修改服务头像</button>
    <button @click="logout" style="background: red;color: white">登出</button>
  </div>
</template>

<style scoped>
</style>