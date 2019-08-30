import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/auth.js'
import store from '@/store/'

import About from '@/views/About.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Users from '@/views/Users.vue'
import UserForm from '@/views/UserForm.vue'
import User from '@/views/User.vue'
import Seeds from '@/views/Seeds.vue'
import SeedForm from '@/views/SeedForm.vue'
import SeedImport from '@/views/SeedImport.vue'
import Seed from '@/views/Seed.vue'
import Collectors from '@/views/Collectors.vue'
import CollectorForm from '@/views/CollectorForm.vue'
import Collector from '@/views/Collector.vue'
import Clients from '@/views/Clients.vue'
import ClientForm from '@/views/ClientForm.vue'
import Client from '@/views/Client.vue'
import CollectorsGroups from '@/views/CollectorsGroups.vue'
import CollectorsGroupForm from '@/views/CollectorsGroupForm.vue'
import CollectorsGroupImport from '@/views/CollectorsGroupImport.vue'
import CollectorsGroup from '@/views/CollectorsGroup.vue'
import SeedsHouses from '@/views/SeedsHouses.vue'
import SeedsHouseForm from '@/views/SeedsHouseForm.vue'
import SeedsHouse from '@/views/SeedsHouse.vue'
import CollectionAreas from '@/views/CollectionAreas.vue'
import CollectionAreaForm from '@/views/CollectionAreaForm.vue'
import CollectionArea from '@/views/CollectionArea.vue'
import SeedsMatrixes from '@/views/SeedsMatrixes.vue'
import SeedsMatrixForm from '@/views/SeedsMatrixForm.vue'
import SeedsMatrix from '@/views/SeedsMatrix.vue'
import Collections from '@/views/Collections.vue'
import CollectionForm from '@/views/CollectionForm.vue'
import Collection from '@/views/Collection.vue'
import CollectorsRequests from '@/views/CollectorsRequests.vue'
import CollectorsRequestForm from '@/views/CollectorsRequestForm.vue'
import CollectorsRequestImport from '@/views/CollectorsRequestImport.vue'
import CollectorsRequest from '@/views/CollectorsRequest.vue'
import Orders from '@/views/Orders.vue'
import OrderForm from '@/views/OrderForm.vue'
import Order from '@/views/Order.vue'
import Stock from '@/views/Stock.vue'
import StockInForm from '@/views/StockInForm.vue'
import StockOutForm from '@/views/StockOutForm.vue'
import PotentialList from '@/views/PotentialList.vue'
import PotentialListForm from '@/views/PotentialListForm.vue'
import PotentialListImport from '@/views/PotentialListImport.vue'
import PotentialLists from '@/views/PotentialLists.vue'
import CollectorSeeds from '@/views/CollectorSeeds.vue'
import CollectorRequests from '@/views/CollectorRequests.vue'
import CollectorStockIns from '@/views/CollectorStockIns.vue'

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

    { path: '/usuarios', component: Users, beforeEnter: requireAuth },
    { path: '/cadastrar-usuario', component: UserForm, beforeEnter: requireAuth },
    { path: '/editar-usuario/:id', component: UserForm, beforeEnter: requireAuth },
    { path: '/usuario/:id', component: User, beforeEnter: requireAuth },

    { path: '/sementes', component: Seeds, beforeEnter: requireAuth },
    { path: '/cadastrar-semente', component: SeedForm, beforeEnter: requireAuth },
    { path: '/editar-semente/:id', component: SeedForm, beforeEnter: requireAuth },
    { path: '/semente/:id', component: Seed, beforeEnter: requireAuth },
    { path: '/importar-sementes', component: SeedImport, beforeEnter: requireAuth },

    { path: '/coletores', component: Collectors, beforeEnter: requireAuth },
    { path: '/cadastrar-coletor', component: CollectorForm, beforeEnter: requireAuth },
    { path: '/editar-coletor/:id', component: CollectorForm, beforeEnter: requireAuth },
    { path: '/coletor/:id', component: Collector, beforeEnter: requireAuth },

    { path: '/clientes', component: Clients, beforeEnter: requireAuth },
    { path: '/cadastrar-cliente', component: ClientForm, beforeEnter: requireAuth },
    { path: '/editar-cliente/:id', component: ClientForm, beforeEnter: requireAuth },
    { path: '/cliente/:id', component: Client, beforeEnter: requireAuth },

    { path: '/grupos-de-coletores', component: CollectorsGroups, beforeEnter: requireAuth },
    { path: '/cadastrar-grupo-de-coletores', component: CollectorsGroupForm, beforeEnter: requireAuth },
    { path: '/editar-grupo-de-coletores/:id', component: CollectorsGroupForm, beforeEnter: requireAuth },
    { path: '/grupo-de-coletores/:id', component: CollectorsGroup, beforeEnter: requireAuth },
    { path: '/importar-grupo-de-coletores', component: CollectorsGroupImport, beforeEnter: requireAuth },

    { path: '/casas-de-sementes', component: SeedsHouses, beforeEnter: requireAuth },
    { path: '/cadastrar-casa-de-sementes', component: SeedsHouseForm, beforeEnter: requireAuth },
    { path: '/editar-casa-de-sementes/:id', component: SeedsHouseForm, beforeEnter: requireAuth },
    { path: '/casa-de-sementes/:id', component: SeedsHouse, beforeEnter: requireAuth },

    { path: '/areas-de-coleta', component: CollectionAreas, beforeEnter: requireAuth },
    { path: '/cadastrar-area-de-coleta', component: CollectionAreaForm, beforeEnter: requireAuth },
    { path: '/editar-area-de-coleta/:id', component: CollectionAreaForm, beforeEnter: requireAuth },
    { path: '/area-de-coleta/:id', component: CollectionArea, beforeEnter: requireAuth },

    { path: '/matrizes-de-sementes', component: SeedsMatrixes, beforeEnter: requireAuth },
    { path: '/cadastrar-matriz-de-sementes', component: SeedsMatrixForm, beforeEnter: requireAuth },
    { path: '/editar-matriz-de-sementes/:id', component: SeedsMatrixForm, beforeEnter: requireAuth },
    { path: '/matriz-de-sementes/:id', component: SeedsMatrix, beforeEnter: requireAuth },

    { path: '/coletas', component: Collections, beforeEnter: requireAuth },
    { path: '/cadastrar-coleta', component: CollectionForm, beforeEnter: requireAuth },
    { path: '/editar-coleta/:id', component: CollectionForm, beforeEnter: requireAuth },
    { path: '/coleta/:id', component: Collection, beforeEnter: requireAuth },

    { path: '/pedidos-para-coletores', component: CollectorsRequests, beforeEnter: requireAuth },
    { path: '/cadastrar-pedido-para-coletores', component: CollectorsRequestForm, beforeEnter: requireAuth },
    { path: '/editar-pedido-para-coletores/:id', component: CollectorsRequestForm, beforeEnter: requireAuth },
    { path: '/pedido-para-coletores/:id', component: CollectorsRequest, beforeEnter: requireAuth },
    { path: '/importar-pedido-para-coletores', component: CollectorsRequestImport, beforeEnter: requireAuth },

    { path: '/encomendas', component: Orders, beforeEnter: requireAuth },
    { path: '/cadastrar-encomenda', component: OrderForm, beforeEnter: requireAuth },
    { path: '/editar-encomenda/:id', component: OrderForm, beforeEnter: requireAuth },
    { path: '/encomenda/:id', component: Order, beforeEnter: requireAuth },

    { path: '/listas-de-potencial', component: PotentialLists, beforeEnter: requireAuth },
    { path: '/cadastrar-lista-de-potencial', component: PotentialListForm, beforeEnter: requireAuth },
    { path: '/editar-lista-de-potencial/:id', component: PotentialListForm, beforeEnter: requireAuth },
    { path: '/lista-de-potencial/:id', component: PotentialList, beforeEnter: requireAuth },
    { path: '/importar-lista-de-potencial', component: PotentialListImport, beforeEnter: requireAuth },

    { path: '/estoque', component: Stock, beforeEnter: requireAuth },
    { path: '/entrada-de-estoque', component: StockInForm, beforeEnter: requireAuth },
    { path: '/saida-de-estoque', component: StockOutForm, beforeEnter: requireAuth },

    { path: '/sementes-do-coletor', component: CollectorSeeds, beforeEnter: requireAuth },
    { path: '/pedidos-do-coletor', component: CollectorRequests, beforeEnter: requireAuth },
    { path: '/entregas-do-coletor', component: CollectorStockIns, beforeEnter: requireAuth },

  ]
})
