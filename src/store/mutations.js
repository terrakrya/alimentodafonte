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
    if (state.showMenu) {
      document.documentElement.className = 'nav-open';
    } else {
      document.documentElement.className = '';
    }
  },
  addToCart (state, item) {
    state.cart.push(item)
    localStorage.setItem('cart', JSON.stringify(state.cart))
  },
  removeFromCart (state, index) {
    state.cart.splice(index, 1)
    localStorage.setItem('cart', JSON.stringify(state.cart))
  },
  clearCart (state) {
    state.cart = []
    localStorage.setItem('cart', JSON.stringify(state.cart))
  },

}
