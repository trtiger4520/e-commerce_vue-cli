<template>
  <div class="app_center text-center">
      <form class="form-signin" v-on:submit.prevent="checkLogin">
    <img
      class="mb-4"
      src="@/assets/logo.png"
      alt
      width="72"
      height="72"
    >
    <h1 class="h3 mb-3 font-weight-normal">登入</h1>
    <label for="inputEmail" class="sr-only">Email address</label>
    <input
      type="email"
      id="inputEmail"
      class="form-control"
      placeholder="Email address"
      required
      autofocus
      v-model="emailaddress"
    >
    <label for="inputPassword" class="sr-only">Password</label>
    <input 
        type="password" 
        id="inputPassword" 
        class="form-control" 
        placeholder="Password" 
        required
        v-model="password"
    >
    <small class="errorMsg text-danger">{{ error }}</small>
    <div class="checkbox mb-3">
      <label>
        <input type="checkbox" value="remember-me" v-model="remember"> Remember me
      </label>
    </div>
    <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
    <router-link class="btn btn-link mt-3" :to="{name:'HelloWorld'}">← back</router-link>
    <p class="mt-5 mb-3 text-muted">© 2018-2019</p>
  </form>
  </div>
</template>

<style lang="scss" scoped>
.form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;

    .checkbox {
        font-weight: 400;
    }
    .form-control {
        position: relative;
        box-sizing: border-box;
        height: auto;
        padding: 10px;
        font-size: 16px;
    }
    .form-control:focus {
        z-index: 2;
    }
    input[type="email"] {
        margin-bottom: -1px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }
    input[type="password"] {
        margin-bottom: 10px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
}
</style>
<script>
import _Methods from "@/_methods";
import { EventBus } from '@/_eventbus';

export default {
    name: 'Login',
    extends: _Methods,
    data() {
        return {
            emailaddress: '',
            password: '',
            remember: false,
            error: '',
        }
    },
    methods: {
        checkLogin: function(e) {
            const vm = this;
            const { 
                emailaddress: username, 
                password, 
                remember 
                } = vm;

            vm.adminLogin({ username, password }).then(json => {
                if (!json.success) {
                    this.error = '帳號或密碼錯誤，請再試一次！！';
                    return;
                }
                vm.$router.push({ name: 'Console' });
                EventBus.$emit('addalertmsg', '您已登入', 'success');
            }).catch(error => {
                this.error = '登入時發生錯誤！！';
            });
        }
    }
};
</script>