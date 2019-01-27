import Vue from 'vue'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import money from 'v-money'
import Vue2Filters from 'vue2-filters'
// import messages from 'vee-validate/dist/locale/pt_BR';
import VeeValidate, { Validator } from 'vee-validate'

import messages from './locale/pt_BR'
import router from './router'
import store from './store/'
import App from './App.vue'

Vue.config.productionTip = false

axios.defaults.baseURL = "http://sementes.docker.localhost:8000/";
// axios.defaults.baseURL = "http://sementes.nyx.tc/";
axios.defaults.headers.common['Authorization'] = 'Basic c2VtZW50ZXMtYWRtaW46bjNqdWtqZjk4NG4=';
axios.defaults.headers.common['Content-Type'] = 'application/json';

Vue.use(BootstrapVue);
Vue.use(money, { prefix: 'R$ ', decimal: ',', thousands: '', masked: false })
Vue.use(Vue2Filters)
Vue.use(VeeValidate, { locale: 'pt_BR', fieldsBagName: 'veeFields' });

Validator.localize('pt_BR', messages);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
