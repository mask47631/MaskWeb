<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      img: '../../assets/哈士奇.png',
      title: '默认标题',
      description: '默认描述',
      timestamp: 0,//时间戳
      url: 'https://www.baidu.com'
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
</script>

<template>
<div class="server-card">
  <img :src="data.img"  alt=""/>
  <div class="server-card-divider">
    <div class="server-card-right">
      <div class="server-card-right-top">
        <div class="server-card-right-top-left">{{ data.title }}</div>
        <div class="server-card-right-top-right">{{ formattedTimestamp }}</div>
      </div>
      <div class="server-card-right-but">{{ data.description }}</div>
    </div>
    <div class="divider"></div>
  </div>
</div>
</template>

<style scoped>
.server-card-right-top-left{
  flex: 1;
  font-size: 1.3rem;
  display: flex;
  overflow: hidden;
}
.server-card-right-top-right{
  color: #999999;
}
.server-card{
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  height: 4rem;
  img{
    width: 4rem;
    height: 4rem;
    margin-right: 0.5rem;
  }
}
.divider {
  height: 1px;
  background-color: #e0e0e0;
  margin-top: auto;
  width: 100%;
}
.server-card-divider{
  display: flex;
  flex: 1;
  flex-direction: column;
}
.server-card-right{
  display: flex;
  flex: 1;
  flex-direction: column;
}
.server-card-right-top{
  flex: 1;
  display: flex;
}
.server-card-right-but{
  flex: 1;
  overflow: hidden;
  color: #999999;
}
</style>