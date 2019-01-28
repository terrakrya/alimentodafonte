import axios from 'axios'
import store from '@/store/'

export default {
  login (email, pass, cb) {
    axios.post('user/login?_format=json', {
      name: email,
      pass: pass
    }, {
        headers: {
            'Authorization': null,
        }
    })
    .then(function (response) {
      localStorage.setItem('currentUser', JSON.stringify(response.data))
      store.dispatch('login', response.data)
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
    if (cb) cb()
    this.onChange(false)
  },

  loggedIn () {
    return store.state.currentUser
  },

  onChange () {}
}