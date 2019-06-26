export default {
  login ({ commit }, currentUser) {
    commit('login', currentUser)
  },

  logout ({ commit }) {
    commit('logout')
  },

  toggleMenu ({ commit }) {
    commit('toggleMenu')
  }
}
