import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/auth.js'
import store from '@/store/'

import About from '@/views/About.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Seeds from '@/views/Seeds.vue'
import SeedForm from '@/views/SeedForm.vue'
import Seed from '@/views/Seed.vue'
import Collectors from '@/views/Collectors.vue'
// import CollectorForm from '@/views/CollectorForm.vue'
// import Collector from '@/views/Collector.vue'

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
    { path: '/', name: 'home', component: Login },
    { path: '/about', component: About },
    { path: '/login', component: Login },
    { path: '/logout',
      beforeEnter (to, from, next) {
        auth.logout(() => {
            store.dispatch('logout')
            next('/')
        })      
      }
    },
    { path: '/painel', component: Dashboard, beforeEnter: requireAuth },
    
    { path: '/sementes', component: Seeds, beforeEnter: requireAuth },
    { path: '/cadastrar-semente', component: SeedForm, beforeEnter: requireAuth },
    { path: '/editar-semente/:id', component: SeedForm, beforeEnter: requireAuth },
    { path: '/semente/:id', component: Seed, beforeEnter: requireAuth },

    { path: '/coletores', component: Collectors, beforeEnter: requireAuth },
    // { path: '/cadastrar-coletor', component: CollectorForm, beforeEnter: requireAuth },
    // { path: '/editar-coletor/:id', component: CollectorForm, beforeEnter: requireAuth },
    // { path: '/coletor/:id', component: Collector, beforeEnter: requireAuth }
  ]
})
