<script setup>
import {computed, reactive} from "vue";
import {top_title} from "@/js/common.js";
import {usingServer} from "@/js/server.js";
import ChatMsgTextCard from "@/components/chat/ChatMsgTextCard.vue";
import ChatMsgFileCard from "@/components/chat/ChatMsgFileCard.vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      fromId: 0,
      fromName:'',
      id: 0,
      content: null,
      timestamp: 0,//时间戳
      fromAvatar:''
    })
  }
});
const formattedTimestamp = computed(() => {
  const date = new Date(props.data.timestamp);
  const now = new Date();

  if (date.getFullYear() !== now.getFullYear()) {
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
  } else if (date.getMonth() !== now.getMonth() || date.getDate() !== now.getDate()) {
    return `${date.getMonth() + 1}-${date.getDate()}`;
  } else {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
});
if (!props.data.content || !props.data.content.type){
  if (typeof props.data.content === 'string'){
    try {
      props.data.content = JSON.parse(props.data.content);
      if (!props.data.content.type){
        props.data.content = {
          type: 'text',
          text: JSON.stringify(props.data.content)
        }
      }
    }catch (e){
      console.log(e);
      props.data.content = {
        type: 'text',
        text: props.data.content
      }
    }
  }
}
</script>

<template>
<div class="chat-card-view">
  <div class="chat-card-tx">
    <img :src="usingServer.value.baseURL+'/file/private/'+data.fromAvatar+'/'+usingServer.value.token" alt="" v-if="usingServer.value.userInfo.id !== data.fromId"/>
  </div>
  <div class="chat-card-nr">
    <div class="chat-card-username" :style="usingServer.value.userInfo.id === data.fromId?{
      // 'text-align': 'right',
      // 'margin-left': 'auto',
      // 'margin-right': '0.5rem'
      'margin-left': '0.5rem'
    }:{
      'margin-left': '0.5rem'
    }">
      {{ data.fromName }}
    </div>
    <div class="chat-card-text" :style="''">
      <ChatMsgTextCard v-if="data.content.type === 'text'" :data="data.content"/>
      <ChatMsgFileCard v-if="data.content.type === 'file'" :data="data.content"/>
    </div>
    <div class="chat-card-divider">
      <div class="divider"></div>
      {{ formattedTimestamp }}
    </div>

  </div>
  <div class="chat-card-tx">
    <img :src="usingServer.value.baseURL+'/file/private/'+data.fromAvatar+'/'+usingServer.value.token" alt="" v-if="usingServer.value.userInfo.id === data.fromId"/>
  </div>
</div>
</template>

<style scoped>
.chat-card-view{
  display: flex;
  margin: 0.25rem;
}
.chat-card-tx{
  width: 4rem;
  min-height: 4rem;
  img{
    max-width: 100%;
    max-height: 100%;
  }
}
.chat-card-nr{
  flex: 1;
  display: flex;
  flex-direction: column;
}
.divider {
  height: 1px;
  background-color: #d6d6d6;
  margin-top: auto;
  flex: 1;
}
.chat-card-divider{
  display: flex;
  font-size: 0.7rem;
  color: #cccccc;
}
.chat-card-username{
  display: flex;
  font-size: 0.7rem;
  color: #8c8c8c;
}
.chat-card-text{
  flex: 1;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  min-width: 0;
  min-height: 0;
}
</style>