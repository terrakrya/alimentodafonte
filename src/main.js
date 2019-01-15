import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import axios from 'axios'

Vue.config.productionTip = false
// axios.defaults.baseURL = "http://sementes.docker.localhost:8000/";
axios.defaults.baseURL = "http://sementes.nyx.tc/";
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
