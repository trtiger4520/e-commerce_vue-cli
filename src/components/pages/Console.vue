<template>
  <div>
    <!-- Top Nav -->
    <Top-Nav :sidebardisplay="sideBarDisplay" @sidebartoggle="SideBarToggle">
    </Top-Nav>
    <div id="wrapper">
      <!-- Sidebar -->
      <Side-Bar :sidebardisplay="sideBarDisplay"></Side-Bar>
      <!-- Main -->
      <div id="content-wrapper">
        <div class="container-fluid">
          <!-- Breadcrumbs-->
          <b-breadcrumb :items="matched" />
        </div>
        <transition name="fade">
          <router-view></router-view>
        </transition>
        <!-- /.container-fluid -->
        <!-- Sticky Footer -->
        <footer class="sticky-footer">
          <div class="container my-auto">
            <div class="copyright text-center my-auto">
              <span>Copyright © Trtiger4520 in 2019</span>
            </div>
          </div>
        </footer>
      </div>
    </div>

    <!-- Scroll to Top Button -->
    <a class="scroll-to-top rounded" href="#page-top">
      <i class="fas fa-angle-up"></i>
    </a>


    <!-- Logout Modal -->
    <b-modal id="logout_modal" size="sm" hide-header @ok.prevent="LoginOut">
      <p class="my-4">您確定要登出嗎?</p>
      <span slot="modal-ok">登出</span>
      <span slot="modal-cancel">算了</span>
    </b-modal>
  </div>
</template>
<script>
  import _Methods from "@/_methods";
  import _nav from "@/components/pages/_nav";
  import _sidebar from "@/components/pages/_sidebar";
  
  export default {
    name: "Login",
    extends: _Methods,
    components: {
      "Top-Nav": _nav,
      "Side-Bar": _sidebar
    },
    data() {
      return {
        sideBarDisplay: false,
      };
    },
    created() {
      this.ToggleBodyClass('sidebar-toggled', !this.sideBarDisplay)
    },
    destroyed() {
      this.ToggleBodyClass('sidebar-toggled', !this.sideBarDisplay)
    },
    methods: {
      SideBarToggle: function() {
        this.sideBarDisplay = !this.sideBarDisplay;
        this.ToggleBodyClass('sidebar-toggled', !this.sideBarDisplay)
      },
      ToggleBodyClass(classname, toggle) {
        const body = document.querySelector('body');
        this.toggleClass(body, classname, toggle);
      },
      LoginOut: function() {
        const vm = this;
        vm._postJson(`${process.env.HOSTPATH}/logout`)
          .then(json => {
            console.log(json.message);
            vm.$router.push("/login");
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    computed: {
      matched(){
        return this.$route.meta.breadcrumb;
      }
    }
  };
</script>