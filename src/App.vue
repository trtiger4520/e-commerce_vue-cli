<template>
  <div class="app">
    <Alert-Msg></Alert-Msg>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  @import "./assets/all";
</style>

