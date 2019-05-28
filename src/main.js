import Vue from 'vue'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import money from 'v-money'
import Vue2Filters from 'vue2-filters'
import VeeValidate, { Validator } from 'vee-validate'
import VueTheMask from 'vue-the-mask'
import moment from 'vue-moment'


import ptBR from './locale/pt_BR'
import router from './router'
import store from './store/'
import mixin from './mixin'
import App from './App.vue'

Vue.config.productionTip = false

axios.defaults.headers.common['Authorization'] = 'Basic c2VtZW50ZXMtYWRtaW46bjNqdWtqZjk4NG4='
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.baseURL = (process.env.NODE_ENV == 'development')
  ? "http://sementes.docker.localhost:8000/"
  : window.location.protocol + "//admin" + window.location.hostname+"/"

Vue.use(BootstrapVue)

Vue.use(money, { prefix: 'R$ ', decimal: ',', thousands: '', masked: false })
Vue.use(Vue2Filters)
Vue.use(VeeValidate, { locale: 'pt_BR', fieldsBagName: 'veeFields',  errorBagName: 'veeErrors' })
Vue.use(VueTheMask)
Vue.use(moment);

Validator.localize('pt_BR', ptBR)

Vue.mixin(mixin)

new Vue({
	router,
  store,
  render: h => h(App)
}).$mount('#app')
