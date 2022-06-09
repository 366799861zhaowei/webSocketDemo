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

    //创建一个EventSource对象  并绑定事件
    var source = new EventSource("/index");
    source.onmessage = function (e) {
      console.log(e.data);
    }; // 或者
    source.addEventListener("message", this.handleMessage().bind(this));

    if (!!window.EventSource) {
      var source = new EventSource("http://127.0.0.1/sses/");
    }
    //新生成的EventSource实例对象，有一个readyState属性，表明连接所处的状态。  
    // 0，相当于常量EventSource.CONNECTING，表示连接还未建立，或者连接断线。
    // 1，相当于常量EventSource.OPEN，表示连接已经建立，可以接受数据。
    // 2，相当于常量EventSource.CLOSED，表示连接已断，且不会重连。


    //open事件  连接一旦建立，就会触发open事件，可以定义相应的回调函数。
      source.addEventListener("open", function(event) { console.log(event);}, false);

    //message事件  收到数据就会触发message事件。
       source.addEventListener("message", function(event) { var data = event.data ;console.log(data);}, false); //参数对象event有如下属性data：服务器端传回的数据（文本格式）。origin： 服务器端URL的域名部分，即协议、域名和端口。lastEventId：数据的编号，由服务器端发送。如果没有编号，这个属性为空。

    //error事件  如果发生通信错误（比如连接中断），就会触发error事件。
      source.addEventListener("error", function(event) { console.log(event); }, false);

    //自定义事件  服务器可以与浏览器约定自定义事件。这种情况下，发送回来的数据不会触发message事件。
      source.addEventListener("foo", function(event) { var data = event.data; var origin = event.origin; var lastEventId = event.lastEventId; }, false);

    //close方法  close方法用于关闭连接。
      source.close();
  },
  methods: {
    submitMessage() {
      const msg = this.msg;
      if (!msg.trim().length) {
        return;
      }
    },
    handleMessage(e) {
      console.log(e);
    },
  },
};
</script>