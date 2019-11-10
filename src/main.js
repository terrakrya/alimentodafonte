import Vue from 'vue'
import axios from 'axios'
import money from 'v-money'
import Vue2Filters from 'vue2-filters'
import VeeValidate, { Validator } from 'vee-validate'
import VueTheMask from 'vue-the-mask'
import moment from 'vue-moment'
import BootstrapVue from 'bootstrap-vue'
import Notifications from 'vue-notification'

import ptBR from './locale/pt_BR'
import router from './router'
import store from './store/'
import mixin from './mixin'
import App from './App.vue'

Vue.config.productionTip = false

if (store.state && store.state.currentUser) {
  axios.defaults.headers.common['Authorization'] = 'Token '+store.state.currentUser.token
}
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.baseURL = (process.env.NODE_ENV == 'development')
  ? "http://localhost:3000/api/"
  : "/api/"

Vue.use(BootstrapVue)
Vue.use(Notifications)

Vue.use(money, { prefix: 'R$ ', decimal: ',', thousands: '', masked: false })
Vue.use(Vue2Filters)
Vue.use(VeeValidate, { locale: 'pt_BR', fieldsBagName: 'veeFields',  errorBagName: 'veeErrors' })
Vue.use(VueTheMask)
Vue.use(moment);

Validator.localize('pt_BR', ptBR)

Vue.filter("moeda", value => {
    return Vue.options.filters.currency(value, 'R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' })
});

Vue.filter("kg", value => {
    var kg = Vue.options.filters.currency(value, '', 2, { decimalSeparator: ',', thousandsSeparator: '.' }) + ' Kg'
    return kg.replace(',00', '')
});

Vue.mixin(mixin)

new Vue({
	router,
  store,
  render: h => h(App)
}).$mount('#app')
