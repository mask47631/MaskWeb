import {nextTick, reactive, ref, watch} from "vue";
import {ApiClient} from "@/js/api.js";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import Stomp from "stompjs";
export const serverList = ref([]);

export const usingServer = reactive({value:null});

// 从localStorage恢复数据
function loadFromLocalStorage() {
    const savedServers = localStorage.getItem('serverList');
    if (savedServers) {
        try {
            const parsedServers = JSON.parse(savedServers);
            serverList.value = parsedServers.map(server => 
                new Server(server.img, server.title, server.description, server.timestamp, server.baseURL, server.newChatMsg, server.token,server.watchId)
            );
        } catch (e) {
            console.error('解析localStorage中的serverList失败:', e);
            // 如果解析失败，使用默认数据
            // initializeDefaultServers();
        }
    } else {
        // 如果localStorage中没有数据，使用默认数据
        // initializeDefaultServers();
    }
}

function initializeDefaultServers() {
    serverList.value.push(new Server(
        'https://avatars.githubusercontent.com/u/185047164?s=48&v=4',
        '默认标题',
        '默认描述',
        0,
        'http://localhost:47631'
    ));
}

// 保存到localStorage的函数
function saveToLocalStorage() {
    try {
        const serializedData = serverList.value.map(server => ({
            img: server.img,
            title: server.title,
            description: server.description,
            timestamp: server.timestamp,
            baseURL: server.baseURL,
            newChatMsg: server.newChatMsg || '',
            token: server.token || '',
            watchId: server.watchId
        }));
        localStorage.setItem('serverList', JSON.stringify(serializedData));
    } catch (e) {
        console.error('保存serverList到localStorage失败:', e);
    }
}

// 监听serverList变化并保存到localStorage
watch(serverList, saveToLocalStorage, { deep: true });



export class Server {
    constructor(img, title, description, timestamp, baseURL, newChatMsg = '', token = '',watchId = 0) {
        this.img = img;
        this.title = title;
        this.description = description;
        this.timestamp = timestamp;
        this.baseURL = baseURL;
        this.apiClient = new ApiClient(baseURL);
        this.newChatMsg = newChatMsg;
        this.watchId = watchId
        this.chatList = []
        this.token = token;
        this.stompClient = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 10000;
        this.isconnerting = false
        this.newMagCount = 0
        // 如果提供了token，则设置到apiClient中
        if (token&&token.length>0) {
            this.apiClient.setToken(token);
        }
        this.userInfo = {}
        this.StompCliented = function (){}
        this.serverErrorMsg = ''
        this.apiClient.setSocketToken = (token)=>{
            this.token = token
        }

    }

    async initServer() {
        if (this.connected){
             return
        }
        let info = await this.getVersion();
        if (!info){
            return
        }
        info = await this.apiClient.getSelf()
        if (!info || !info.success){
            return
        }
        this.userInfo = info.data
        this.buildStompClient()
    }
    
    addServer() {
        serverList.value.push(this);
        // 添加后按时间戳从大到小排序
        serverList.value.sort((a, b) => b.timestamp - a.timestamp);
    }

    deleteServer() {
        if(this.connected){
            this.disconnect()
        }
        serverList.value.splice(serverList.value.indexOf(this), 1);
    }

    updateServer() {
        serverList.value[serverList.value.indexOf(this)] = this;
        // 更新后按时间戳从大到小排序
        serverList.value.sort((a, b) => b.timestamp - a.timestamp);
    }

    async getVersion() {
        const info = await this.apiClient.getVersion();
        console.log( info)
        if (info && info.success){
            this.title = info.data.name;
            this.description = info.data.description;
            this.img = info.data.avatarUrl;
            return true
        }else {
            return false
        }
    }
    
    // 获取服务器的token
    getToken() {
        return this.token;
    }
    
    // 设置服务器的token
    setToken(token) {
        this.token = token;
        this.apiClient.setToken(token);
    }

    // 对chatList进行排序和去重
    sortAndDeduplicateChatList() {
        // 创建一个Map来存储唯一的消息，以id为键
        const uniqueMessages = new Map();
        
        // 遍历chatList，用id作为键存储消息，自动去重
        this.chatList.forEach(msg => {
            uniqueMessages.set(msg.id, msg);
        });
        
        // 将Map的值转换为数组，并按id排序
        this.chatList = Array.from(uniqueMessages.values()).sort((a, b) => a.id - b.id);
        if (this.chatList.length>0){
            let content = this.chatList[this.chatList.length-1].content
            try {
                content = JSON.parse(content);
                if (!content.type){
                    content = {
                        type: 'text',
                        text: JSON.stringify(content)
                    }
                }
            }catch (e){
                console.log(e);
                content = {
                    type: 'text',
                    text: content
                }
            }
            if (content.type=='text'){
                this.newChatMsg = this.chatList[this.chatList.length-1].fromName+':'+content.text
            }else {
                this.newChatMsg = this.chatList[this.chatList.length-1].fromName+':'+'['+content.type+']'
            }
            this.timestamp = this.chatList[this.chatList.length-1].timestamp
            if (usingServer.value === this){
                this.watchId = this.chatList[this.chatList.length-1].id
            }
            this.newMagCount = this.chatList[this.chatList.length-1].id-this.watchId
            if (this.newMagCount<0){
                this.newMagCount = 0
            }
        }

    }

    buildStompClient () {
        if (this.isconnerting){
             return
        }
        this.isconnerting =  true
        // 如果已经连接，先断开连接
        if (this.stompClient && this.connected) {
            this.stompClient.disconnect();
        }

        const socket = new SockJS(this.baseURL + '/ws');
        this.stompClient = Stomp.over(socket);
        // 设置连接头部包含认证信息
        var headers = {
            'Authorization': this.getToken()
        };

        this.stompClient.connect(headers, (frame) => {
            console.log('Connected: ' + frame);
            this.connected = true;
            this.isconnerting =  false
            this.StompCliented()
            this.reconnectAttempts = 0; // 重置重连次数
            this.serverErrorMsg = ''
            let msgId = 0
            if (this.chatList.length>0){
                msgId = this.chatList[this.chatList.length-1].id
            }
            this.apiClient.getMessagesAfterId(msgId).then( (info) => {
                if (info && info.success){
                    this.chatList.push(...info.data)
                    // 对chatList进行排序和去重
                    this.sortAndDeduplicateChatList();
                }
            })
            // 订阅公共聊天频道
            this.stompClient.subscribe('/topic/messages', (message) => {
                console.log(JSON.parse(message.body));
                this.chatList.push(JSON.parse(message.body));
                // 对chatList进行排序和去重
                this.sortAndDeduplicateChatList();
            });
            // 订阅私聊频道
            this.stompClient.subscribe('/user/queue/messages', (message) => {
                console.log(JSON.parse(message.body));
                // 对chatList进行排序和去重
                this.sortAndDeduplicateChatList();
            });
        }, (error) => {
            console.log('STOMP error: ' + error);
            this.connected = false;
            // 尝试重连
            this.handleReconnect();
        });
    }

    disconnect() {
        this.reconnectAttempts = this.maxReconnectAttempts
        this.stompClient.disconnect();
    }
    
    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            this.serverErrorMsg = `正在重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`;
            // 延迟重连
            setTimeout(() => {
                this.buildStompClient();
            }, this.reconnectDelay);
        } else {
            this.isconnerting =  false
            this.StompCliented()
            console.log('达到最大重连次数，停止重连');
            this.serverErrorMsg = '连接失败，已达到最大重连次数'
        }
    }



     sendMessage(content) {
        if (!this.connected) {
            alert('请先连接到服务器');
            return;
        }
         if (content) {
             if (typeof content !== 'string'){
                 content = JSON.stringify(content)
             }
             const message = {
                 content: content
             };
             this.stompClient.send("/app/chat", {}, JSON.stringify(message));
        }
    }
}

/**
 * 更新服务器列表，并按时间戳从大到小排序
 * @param {Array} updatedList - 更新后的服务器列表
 */
export function updateServer(updatedList) {
    // 更新列表
    serverList.value = [...updatedList];
    
    // 按时间戳从大到小排序
    serverList.value.sort((a, b) => b.timestamp - a.timestamp);
}

// 初始化时加载数据
loadFromLocalStorage();