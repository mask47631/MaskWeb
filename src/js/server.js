import {ref} from "vue";

export const serverList = ref([])
serverList.value.push({
    img: 'https://avatars.githubusercontent.com/u/185047164?s=48&v=4',
    title: '默认标题',
    description: '默认描述',
    timestamp: 0,//时间戳
});
serverList.value.push({
    img: '../../assets/哈士奇.png',
    title: '默认标题',
    description: '默认描述',
    timestamp: 0,//时间戳
});