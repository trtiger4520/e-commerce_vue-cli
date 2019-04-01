<template>
  <div class="app_center text-center">
    <div class="header">
      <a href="#" class="btn btn-link text-secondary" v-on:click="handleLog">{{ isLogin ? '登出' : '登入' }}</a>
    </div>
    <div class="hello">
      <img src="@/assets/logo.png">
      <h1 class="adv-larg">{{ msg }}</h1>
      <router-link class="btn btn-link" :to="{ name: 'Console' }">開始使用系統</router-link>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    text-align: right;
    padding: 5px;
  }
</style>

<script>
import _Methods from "@/_methods";
import { EventBus } from '@/_eventbus';

export default {
  name: "HelloWorld",
  extends: _Methods,
  data() {
    return {
      msg: "Vue 電商後台系統",
      isLogin: false
    };
  },
  created() {
    if (this.$route.meta.fullScreen !== undefined) {
      this.toggleFullScreen(this.$route.meta.fullScreen);
    }
    this.checkUser();
  },
  methods: {
    async checkUser() {
      this.isLogin = await this.adminCheck().then(res => res.success);
    },
    handleLog() {
      if (this.isLogin) {
        return this.LoginOut();
      }
      this.$router.push({ name: 'Login'});
    },
    LoginOut() {
      const vm = this;
      vm.adminLogout().then(res => {
          console.log(res.message);
          if (res.success) {
            EventBus.$emit('addalertmsg', '您已經登出', 'success');
            this.isLogin = false;
          } else {
            EventBus.$emit('addalertmsg', res.message, 'danger');
          }
      })
      .catch(error => {
          console.log(error);
      });
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  margin: auto;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
