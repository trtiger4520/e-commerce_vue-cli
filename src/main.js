// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import { MethodsCore } from "@/_methods";
import BootstrapVue from 'bootstrap-vue'

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import AlertMessage from "@/components/pages/_alert";
import { currency } from './_filters'

// Vue Loading Overlay
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';


library.add(fas);
library.add(fab);
library.add(far);

Vue.use(BootstrapVue);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('Loading', Loading);
Vue.component('Alert-Msg', AlertMessage)

Vue.filter('currency', currency);

dom.watch();
Vue.config.productionTip = false

/* eslint-disable no-new */
const Application = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  // check Need Full Screen
  if (to.meta.fullScreen !== undefined) {
    MethodsCore.toggleFullScreen(to.meta.fullScreen);
  }

  // check Auth
  if (to.meta.requiresAuth) {
    MethodsCore.adminCheck().then(json => {
      if (!json.success) {
        next({ path: '/login' });
        return;
      }
    });
  }
  next();
})