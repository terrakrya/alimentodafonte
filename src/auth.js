import axios from 'axios'
import store from '@/store/'

export default {
  login (email, password, cb) {
    axios.post('users/login', {
      email: email,
      password: password
    }).then(function (response) {
      var currentUser = response.data
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      axios.defaults.headers.common['Authorization'] = 'Token '+currentUser.token
      store.dispatch('login', currentUser)
      cb({
        authenticated: true,
        currentUser: response.data
      })
    })
    .catch(function (error) {
      cb({ authenticated: false, error: 'Usuário ou senha inválidos', errorObject: error })
    });

  },

  getToken () {
    return localStorage.getItem('currentUser')
  },

  logout (cb) {
    localStorage.removeItem('currentUser')
    store.dispatch('login', null)
    axios.defaults.headers.common['Authorization'] = undefined
    if (cb) cb()
    this.onChange(false)
  },

  loggedIn () {
    return store.state.currentUser
  },

  onChange () {}
}
