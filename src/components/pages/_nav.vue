<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark static-top">
    <router-link class="navbar-brand" :to="{ name:'HelloWorld' }">Home</router-link>

    <b-button variant="link" class="text-white order-1 order-sm-0 ml-2" @click.prevent="toggleSideBar">
      <font-awesome-icon fas :icon="sidebardisplay ? 'bars' : 'list'" />
    </b-button>

    <!-- Navbar -->
    <b-navbar-nav class="ml-auto">
      <b-nav-form class="mr-3">
        <b-input-group size="sm">
          <b-form-input type="text" placeholder="Search"/>
          <b-input-group-append>
            <b-button type="submit">
              <font-awesome-icon fas icon="search" />
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-nav-form>

      <b-nav-item-dropdown right no-caret>
        <template slot="button-content">
          <font-awesome-icon fas icon="user" />
          <span class="d-none d-sm-inline"><small>使用者名稱</small></span>
        </template>
        <b-dropdown-item class="py-3" href="#">個人資訊</b-dropdown-item>
        <b-dropdown-item class="py-3" href="#" v-b-modal.logout_modal>登出</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </nav>
</template>

<script>
export default {
    name:"topnav",
    props: {
      sidebardisplay: {
        default: true,
        type: Boolean
      }
    },
    methods: {
      toggleSideBar: function() {
        this.$emit('sidebartoggle');
      }
    },
}
</script>