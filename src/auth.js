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
      var currentUser = response.data
      Object.assign(currentUser, { auth_token: btoa(email+':'+pass) })
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      axios.defaults.headers.common['Authorization'] = 'Basic '+currentUser.auth_token
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
    if (cb) cb()
    this.onChange(false)
  },

  loggedIn () {
    return store.state.currentUser
  },

  onChange () {}
}
