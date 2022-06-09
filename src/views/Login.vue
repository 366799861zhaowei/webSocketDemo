<template>
  <div class="a">
    <input type="text" placeholder="请输入Id" v-model="username" />
    <button @click="handelLogin">enter</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
        username:'',
    };
  },
  mounted() {},
  methods:{
      handelLogin(){
          const username = this.username.trim()
          if(username.length<6){
              return alert("用户名不能小于6位")
          }
          localStorage.setItem("username",username)
          this.$router.push({path:"/Home"})
      }
  }
};
</script>