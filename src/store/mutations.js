export const STORAGE_KEY = 'todos-vuejs'

// for testing
if (navigator.userAgent.indexOf('PhantomJS') > -1) {
  window.localStorage.clear()
}
export const mutations = {
  login (state, currentUser) {
    state.currentUser = currentUser
  },

  logout (state) {
    state.currentUser = undefined
  },

  toggleMenu (state) {
    state.showMenu = !state.showMenu
  },

}
