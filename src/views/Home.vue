<template>
  <div class="a">
    <ul>
      <li v-for="(item, index) in messageList" :key="index">
        <p>
          <span>{{ item.user }}</span>
          <span>{{ new Date(item.dateTime) }}</span>
        </p>
        <p>消息：{{ item.msg }}</p>
      </li>
    </ul>
    <input type="text" placeholder="请输入消息" v-model="msg" />
    <button @click="submitMessage">发送</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: "",
      username: "",
      messageList: [],
      webSocket: null, // webSocket实例
      lockReconnect: false, // 重连锁，避免多次重连
      maxReconnect: 6, // 最大重连次数， -1 标识无限重连
      reconnectTime: 0, // 重连尝试次数
      heartbeat: {
        interval: 30 * 1000, // 心跳间隔时间
        timeout: 10 * 1000, // 响应超时时间
        pingTimeoutObj: null, // 延时发送心跳的定时器
        pongTimeoutObj: null, // 接收心跳响应的定时器
        pingMessage: JSON.stringify({ type: "ping" }), // 心跳请求信息
      },
    };
  },
  mounted() {
    this.username = localStorage.getItem("username");
    if (!this.username) {
      return this.$router.push("/login");
    }
    this.initWebSocket();
  },
  destroyed(){
    this.webSocket.close()
    this.clearTimeoutObj(this.heartbeat)
  },
  methods: {
    submitMessage() {
      const msg = this.msg;
      if (!msg.trim().length) {
        return;
      }
      this.webSocket.send(
        JSON.stringify({
          id: new Date().getTime(),
          user: this.username,
          dateTime: new Date().getTime(),
          msg: this.msg,
        })
      );
    },

    
    initWebSocket() {
      this.webSocket = new WebSocket("ws://10.231.7.28:8000");
      this.webSocket.addEventListener("open",this.handelWsOpen.bind(this),false);
      this.webSocket.addEventListener("close", this.handelWsClose.bind(this),false);
      this.webSocket.addEventListener("error",this.handelWsError.bind(this),false);
      this.webSocket.addEventListener("message",this.handelWsMessage.bind(this),false);
    },
    handelWsOpen(e) {
      console.log("WebSocket Open", e);
    },
    handelWsClose(e) {
      console.log("WebSocket Close", e);
    },
    handelWsError(e) {
      console.log("WebSocket Error", e);
    },
    handelWsMessage(e) {
      this.startHeartbeat();
      console.log("WebSocket Message", e.data);
      const msg = JSON.parse(e.data);
      this.messageList.push(msg);
    },


    reconnect() {
      if (!this.username) {return;}
      if (this.lockReconnect ||(this.maxReconnect !== -1 && this.reconnectTime > this.maxReconnect)) {
        return;
        }
      this.lockReconnect = true;
      setTimeout(() => {
        this.reconnectTime++;
        // 建立新连接
        this.initWebSocket();
        this.lockReconnect = false;
      }, 5000);
    },
    /**
     * 清空定时器
     */
    clearTimeoutObj: function (heartbeat) {
      heartbeat.pingTimeoutObj && clearTimeout(heartbeat.pingTimeoutObj);
      heartbeat.pongTimeoutObj && clearTimeout(heartbeat.pongTimeoutObj);
    },
    /**
     * 开启心跳
     */
    startHeartbeat() {
      const webSocket = this.webSocket;
      const heartbeat = this.heartbeat;
      // 清空定时器
      this.clearTimeoutObj(heartbeat);
      // 延时发送下一次心跳
      heartbeat.pingTimeoutObj = setTimeout(() => {
        // 如果连接正常
        if (webSocket.readyState === 1) {
          //这里发送一个心跳，后端收到后，返回一个心跳消息，
          webSocket.send(heartbeat.pingMessage);
          // 心跳发送后，如果服务器超时未响应则断开，如果响应了会被重置心跳定时器
          heartbeat.pongTimeoutObj = setTimeout(() => {
            webSocket.close();
          }, heartbeat.timeout);
        } else {
          // 否则重连
          this.reconnect();
        }
      }, heartbeat.interval);
    },
  },
};
</script>