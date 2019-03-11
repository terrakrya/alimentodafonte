import Vue from 'vue'
import Vuex from 'vuex'
import { mutations } from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: JSON.parse(window.localStorage.getItem('currentUser')),
    showMenu: false,
    collectors_requests: false,
    collectors: false,
    collectors_groups: false,
    seeds_houses: false,
    seeds: false,
    product_variations: false,
    orders: false,
    clients: false,
  },
  actions,
  mutations
})