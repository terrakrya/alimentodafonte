import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/auth.js'
import store from '@/store/'

import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import App from '@/App.vue'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/Login.vue'

Vue.use(Router)

function requireAuth (to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

export default new Router({
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/about', component: About },
    { path: '/dashboard', component: Dashboard, beforeEnter: requireAuth },
    { path: '/login', component: Login },
    { path: '/logout',
      beforeEnter (to, from, next) {
        auth.logout(() => {
            store.dispatch('logout')
            next('/')
        })
      
      }
    }
  ]
})
