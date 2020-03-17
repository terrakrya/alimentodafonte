import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/auth.js'
import store from '@/store/'

import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Login from '@/views/Login.vue'
import Panel from '@/views/Panel.vue'
import Dashboard from '@/views/Dashboard.vue'
import Users from '@/views/Users.vue'
import UserForm from '@/views/UserForm.vue'
import User from '@/views/User.vue'

import Organizations from '@/views/Organizations.vue'
import Organization from '@/views/Organization.vue'
import OrganizationForm from '@/views/OrganizationForm.vue'
import OrganizationRegisterForm from '@/views/OrganizationRegisterForm.vue'

import Suppliers from '@/views/Suppliers.vue'
import SupplierForm from '@/views/SupplierForm.vue'
import SupplierRegisterForm from '@/views/SupplierRegisterForm.vue'

import Products from '@/views/Products.vue'
import ProductForm from '@/views/ProductForm.vue'
import ProductVariationForm from '@/views/ProductVariationForm.vue'

import Offers from '@/views/Offers.vue'
import OfferForm from '@/views/OfferForm.vue'

import Ecommerce from '@/views/Ecommerce.vue'
import ClientLogin from '@/views/ClientLogin.vue'
import Shop from '@/views/Shop.vue'
import Offer from '@/views/Offer.vue'
import Cart from '@/views/Cart.vue'
import ClientOrders from '@/views/ClientOrders.vue'
import ClientOrder from '@/views/ClientOrder.vue'

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
    { path: '/login', component: Login },
    { path: '/logout',
      beforeEnter (to, from, next) {
        auth.logout(() => {
            store.dispatch('logout')
            next('/')
        })
      }
    },
    { path: '/panel',
      component: Panel,
      beforeEnter: requireAuth,
      children: [
        { path: '/painel', component: Dashboard, beforeEnter: requireAuth },
        { path: '/usuarios', component: Users, beforeEnter: requireAuth },
        { path: '/cadastrar-usuario', component: UserForm, beforeEnter: requireAuth },
        { path: '/editar-usuario/:id', component: UserForm, beforeEnter: requireAuth },
        { path: '/usuario/:id', component: User, beforeEnter: requireAuth },

        { path: '/organizacoes', component: Organizations, beforeEnter: requireAuth },
        { path: '/cadastrar-organizacao', component: OrganizationRegisterForm, beforeEnter: requireAuth },
        { path: '/editar-organizacao/:id', component: OrganizationForm, beforeEnter: requireAuth },
        { path: '/organizacao/:id', component: Organization, beforeEnter: requireAuth },

        { path: '/fornecedores', component: Suppliers, beforeEnter: requireAuth },
        { path: '/cadastrar-fornecedor', component: SupplierRegisterForm, beforeEnter: requireAuth },
        { path: '/editar-fornecedor/:id', component: SupplierForm, beforeEnter: requireAuth },

        { path: '/produtos', component: Products, beforeEnter: requireAuth },
        { path: '/cadastrar-produto', component: ProductForm, beforeEnter: requireAuth },
        { path: '/editar-produto/:id', component: ProductForm, beforeEnter: requireAuth },

        { path: '/cadastrar-variacao-de-produto', component: ProductVariationForm, beforeEnter: requireAuth },
        { path: '/editar-variacao-de-produto/:id', component: ProductVariationForm, beforeEnter: requireAuth },

        { path: '/ofertas', component: Offers, beforeEnter: requireAuth },
        { path: '/cadastrar-oferta', component: OfferForm, beforeEnter: requireAuth },
        { path: '/editar-oferta/:id', component: OfferForm, beforeEnter: requireAuth },
      ]
    },
    { path: '/ecommerce',
      component: Ecommerce,
      children: [
        { path: '/entrar', component: ClientLogin },
        { path: '/loja', component: Shop },
        { path: '/oferta/:id', component: Offer },
        { path: '/carrinho', component: Cart },
        { path: '/meus_pedidos', component: ClientOrders },
        { path: '/meu_pedido/:id', component: ClientOrder },
      ]
    },

  ]
})
