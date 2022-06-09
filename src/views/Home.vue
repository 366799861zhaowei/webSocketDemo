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
const ws = new WebSocket("ws://192.168.31.123:8000");
export default {
  data() {
    return {
      msg: "",
      username: "",
      messageList: [],
    };
  },
  mounted() {
    this.username = localStorage.getItem("username");
    if (!this.username) {
      return this.$router.push("/login");
    }

    ws.addEventListener("open", this.handelWsOpen.bind(this), false);
    ws.addEventListener("close", this.handelWsClose.bind(this), false);
    ws.addEventListener("error", this.handelWsError.bind(this), false);
    ws.addEventListener("message", this.handelWsMessage.bind(this), false);
  },
  methods: {
    submitMessage() {
      const msg = this.msg;
      if (!msg.trim().length) {
        return;
      }
      ws.send(
        JSON.stringify({
          id: new Date().getTime(),
          user: this.username,
          dateTime: new Date().getTime(),
          msg: this.msg,
        })
      );
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
      console.log("WebSocket Message", e.data);
		const msg = JSON.parse(e.data)
		this.messageList.push(msg)
    },
  },
};
</script>