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
    };
  },
  mounted() {
    this.username = localStorage.getItem("username");
    if (!this.username) {
      return this.$router.push("/login");
    }
  },
  methods: {
    submitMessage() {
      const msg = this.msg;
      if (!msg.trim().length) {
        return;
      }
      this.subscribe();
    },

    async subscribe() {
      let response = await fetch("/index" + Math.random());
      if (response.status == 502) {
        // 连接超时
        // 连接挂起时间过长时发生
        // 重新连接
        await this.subscribe();
      } else if (response.status != 200) {
        // 抛错
        this.showMessage(response.statusText);
        // 一秒钟后重新连接
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.subscribe();
      } else {
        // 获取信息
        let message = await response.text();
        this.showMessage(message);
        await this.subscribe();
      }
    },
    showMessage(message) {
      const msg = message;
      this.messageList.push(msg);
    },
  },
};
</script>