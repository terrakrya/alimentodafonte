export default {
  login ({ commit }, currentUser) {
    commit('login', currentUser)
  },
  logout ({ commit }) {
    commit('logout')
  },
  toggleMenu ({ commit }) {
    commit('toggleMenu')
  },
  addToCart ({ commit }, item) {
    commit('addToCart', item)
  },
  removeFromCart ({ commit }, index) {
    commit('removeFromCart', index)
  },
  clearCart ({ commit }) {
    commit('clearCart')
  }
}
