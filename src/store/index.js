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
    collectors: [],
    collectors_groups: [],
    seeds_houses: [],
    seeds: [],
    product_variations: []
  },
  actions,
  mutations
})