import axios from 'axios'

export default {
  login (email, pass, cb) {
    axios.post('user/login?_format=json', {
      name: email,
      pass: pass
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(function (response) {
      localStorage.currentUser = response
      cb({
        authenticated: true,
        currentUser: response
      })
    })
    .catch(function (error) {
      localStorage.currentUser = error
      cb({ authenticated: false, error: error })
    });

    // cb = arguments[arguments.length - 1]
    // if (localStorage.currentUser) {
    //   if (cb) cb(true)
    //   this.onChange(true)
    //   return
    // }
    // pretendRequest(email, pass, (res) => {
    //   if (res.authenticated) {
    //     localStorage.currentUser = res.currentUser
    //     if (cb) cb(true)
    //     this.onChange(true)
    //   } else {
    //     if (cb) cb(false)
    //     this.onChange(false)
    //   }
    // })
  },

  getToken () {
    return localStorage.currentUser
  },

  logout (cb) {
    delete localStorage.currentUser
    if (cb) cb()
    this.onChange(false)
  },

  loggedIn () {
    return !!localStorage.currentUser
  },

  onChange () {}
}

// function pretendRequest (email, pass, cb) {
//   setTimeout(() => {
//     axios.post('user/login?_format=json', {
//       name: email,
//       pass: pass
//     })
//     .then(function (response) {
//       cb({
//         authenticated: true,
//         currentUser: response
//       })
//     })
//     .catch(function (error) {
//       cb({ authenticated: false, error: error })
//     });
//     // if (email === 'joe@example.com' && pass === 'password1') {
//     //   cb({
//     //     authenticated: true,
//     //     currentUser: Math.random().toString(36).substring(7)
//     //   })
//     // } else {
//     //   cb({ authenticated: false })
//     // }
//   }, 0)
// }
