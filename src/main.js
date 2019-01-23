import Vue from 'vue'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import store from './store/'
import App from './App.vue'
import money from 'v-money'

Vue.config.productionTip = false

// axios.defaults.baseURL = "http://sementes.docker.localhost:8000/";
axios.defaults.baseURL = "http://sementes.nyx.tc/";
axios.defaults.headers.common['Authorization'] = 'Basic c2VtZW50ZXMtYWRtaW46bjNqdWtqZjk4NG4=';
axios.defaults.headers.common['Content-Type'] = 'application/json';

Vue.use(BootstrapVue);
Vue.use(money, {
          decimal: '.',
          thousands: '',
          masked: false
        })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
