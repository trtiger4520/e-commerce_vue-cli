<template>
  <b-navbar-nav vertical class="sidebar text-light" :class="{ 'toggled': !sidebardisplay }">

      <b-nav-text class="text-center mt-3">
        <small>管理員</small>
      </b-nav-text>
      <b-nav-item exact :to="{ name: 'Console' }">
        <font-awesome-icon class="mx-1" fas fa-fw icon="home"/>
        <span>控制台</span>
      </b-nav-item>
      <b-nav-item exact :to="{ name: 'Products' }">
        <font-awesome-icon class="mx-1" fas icon="box"/>        
        <span>產品</span>
      </b-nav-item>
      <b-nav-item exact :to="{ name: 'Order' }">
        <font-awesome-icon class="mx-1" fas icon="list-alt"/>        
        <span>訂單列表</span>
      </b-nav-item>
      <b-nav-item exact :to="{ name: 'Coupon' }">
        <font-awesome-icon class="mx-1" fas icon="ticket-alt"/>        
        <span>優惠卷</span>
      </b-nav-item>

      <b-nav-text class="text-center mt-5">
        <small>測試區</small>
      </b-nav-text>
      <b-nav-item exact :to="{ name: 'Shop_TestPage' }">
        <font-awesome-icon class="mx-1" fas icon="shopping-cart"/>        
        <span>商品購買</span>
      </b-nav-item>
  </b-navbar-nav>
</template>
<script>
export default {
  name: "sidebar",
  props: {
    sidebardisplay : {
      default: true,
      type: Boolean,
    }
  }
};
</script>