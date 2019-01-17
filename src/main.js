import Vue from 'vue'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import store from './store/'
import App from './App.vue'

Vue.config.productionTip = false

// axios.defaults.baseURL = "http://sementes.docker.localhost:8000/";
axios.defaults.baseURL = "http://sementes.nyx.tc/";

Vue.use(BootstrapVue);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
