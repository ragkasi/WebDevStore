import Vue from 'vue';
import VueExcelXlsx from 'vue-excel-xlsx';

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import App from './App.vue';
import store from './store';
import router from './router';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';

import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
import Multiselect from 'vue-multiselect';

Vue.component('multiselect', Multiselect);
Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead);

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueExcelXlsx);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
