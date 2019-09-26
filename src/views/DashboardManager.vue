<template>
  <div class="dashboard">
    <ol class="breadcrumb">
      <li class="active">Painel do gestor</li>
    </ol>
    <div class="panel panel-headline data-list">
      <div class="panel-body">
        <div class="row">
          <div class="col-md-12">
            <div class="info-content">
              <div class="row">
                <div class="col-sm-4" v-if="potential_lists">
                  <div class="weekly-summary text-center">
                    <router-link to="/listas-de-potencial">
                      <span class="info-label">Potencial de coleta</span>
                      <span class="number">{{ total_potential | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' }) }}</span>
                      <br>
                      <span>{{ total_potential_qtd.toFixed(2) }} kg</span>
                      <br>
                      <small>{{ total_potential_species }} espécies</small>
                    </router-link>
                  </div>
                </div>
                <div class="col-sm-4" v-if="collectors_requests">
                  <div class="weekly-summary text-center">
                    <router-link to="/pedidos-para-coletores">
                      <span class="info-label">Pedidos</span>
                      <span class="number">{{ total_collectors_request | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' }) }}</span>
                      <br>
                      <span>{{ total_collectors_request_qtd.toFixed(2) }} kg</span>
                      <br>
                      <small>{{ total_collectors_request_species }} espécies</small>
                    </router-link>
                  </div>
                </div>
                <div class="col-sm-4" v-if="orders">
                  <div class="weekly-summary text-center">
                    <router-link to="/encomendas">
                      <span class="info-label">Encomendas</span>
                      <span class="number">{{ total_order | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' }) }}</span>
                      <br>
                      <span>{{ total_order_qtd.toFixed(2) }} kg</span>
                      <br>
                      <small>{{ total_order_species }} espécies</small>
                    </router-link>
                  </div>
                </div>
              </div>
              <hr>
              <br>
              <div class="text-center">
                <h4><i class="fa fa-cogs"></i>&nbsp;&nbsp;<span>Operacional</span></h4>
                <div class="nav-buttons">
                  <router-link class="btn btn-default" to="/estoque"><span>Estoque</span></router-link>
                  <router-link class="btn btn-default" to="/listas-de-potencial"><span>Potencial de coleta</span></router-link>
                  <router-link class="btn btn-default" to="/pedidos-para-coletores"><span>Pedidos para coletores</span></router-link>
                  <router-link class="btn btn-default" to="/encomendas"><span>Encomendas</span></router-link>
                  <router-link class="btn btn-default" to="/coletas"><span>Coleta de sementes</span></router-link>
                </div>
                <h4><i class="fa fa-list-alt"></i>&nbsp;&nbsp;<span>Cadastros</span></h4>
                <div class="nav-buttons">
                  <router-link class="btn btn-default" to="/usuarios" v-if="isAdmin"><span>Usuários</span></router-link>
                  <router-link class="btn btn-default" to="/clientes"><span>Clientes</span></router-link>
                  <router-link class="btn btn-default" to="/sementes"><span>Sementes</span></router-link>
                  <router-link class="btn btn-default" to="/coletores"><span>Coletores</span></router-link>
                  <router-link class="btn btn-default" to="/grupos-de-coletores"><span>Grupos de coletores</span></router-link>
                  <router-link class="btn btn-default" to="/casas-de-sementes"><span>Casas de sementes</span></router-link>
                  <router-link class="btn btn-default" to="/areas-de-coleta"><span>Áreas de coleta</span></router-link>
                  <router-link class="btn btn-default" to="/matrizes-de-sementes"><span>Matrizes</span></router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Dashboard',

  data() {
    return {
      potential_lists: null,
      collectors_requests: null,
      orders: null
    }
  },
  computed: {
    total_potential() {
      if (this.potential_lists) {
        var values = this.potential_lists.map(potential_list => {
          return potential_list.seed_items.map(seed_item => seed_item.qtd * seed_item.compensation_collect).reduce((a, b) => a + b)
        })
        return values && values.length ? values.reduce((a, b) => a + b) : 0
      }
      return 0
    },
    total_potential_qtd() {
      if (this.potential_lists) {
        var values = this.potential_lists.map(potential_list => {
          return potential_list.seed_items.map(seed_item => seed_item.qtd).reduce((a, b) => a + b)
        })
        return values && values.length ? values.reduce((a, b) => a + b) : 0
      }
      return 0
    },
    total_potential_species() {
      if (this.potential_lists) {
        var seeds = []
        this.potential_lists.forEach(potential_list => {
          potential_list.seed_items.forEach(seed_item => {
            if (!seeds.includes(seed_item.seed)) {
              seeds.push(seed_item.seed)
            }
          })
        })
        return seeds.length
      }
      return 0
    },
    total_collectors_request() {
      if (this.collectors_requests) {
        var values = this.collectors_requests.map(collectors_request => {
          return collectors_request.seed_items.map(seed_item => this.sumQtd(seed_item.qtd) * seed_item.compensation_collect).reduce((a, b) => a + b)
        })
        return values && values.length ? values.reduce((a, b) => a + b) : 0
      }
      return 0
    },
    total_collectors_request_qtd() {
      if (this.collectors_requests) {
        var values = this.collectors_requests.map(collectors_request => {
          return collectors_request.seed_items.map(seed_item => this.sumQtd(seed_item.qtd)).reduce((a, b) => a + b)
        })
        return values && values.length ? values.reduce((a, b) => a + b) : 0
      }
      return 0
    },
    total_collectors_request_species() {
      if (this.collectors_requests) {
        var seeds = []
        this.collectors_requests.forEach(collectors_request => {
          collectors_request.seed_items.forEach(seed_item => {
            if (!seeds.includes(seed_item.seed)) {
              seeds.push(seed_item.seed)
            }
          })
        })
        return seeds.length
      }
      return 0
    },
    total_order() {
      if (this.orders) {
        var values = this.orders.map(order => {
          return order.seed_items.map(seed_item => seed_item.qtd * (order.purchase_type == 'Atacado' ? seed_item.wholesale_price : seed_item.price)).reduce((a, b) => a + b)
        })
        return values && values.length ? values.reduce((a, b) => a + b) : 0
      }
      return 0
    },
    total_order_qtd() {
      if (this.orders) {
        var values = this.orders.map(order => {
          return order.seed_items.map(seed_item => seed_item.qtd).reduce((a, b) => a + b)
        })
        return values && values.length ? values.reduce((a, b) => a + b) : 0
      }
      return 0
    },
    total_order_species() {
      if (this.orders) {
        var seeds = []
        this.orders.forEach(order => {
          order.seed_items.forEach(seed_item => {
            if (!seeds.includes(seed_item.seed)) {
              seeds.push(seed_item.seed)
            }
          })
        })
        return seeds.length
      }
      return 0
    }
  },
  created () {
    axios.get('potential_lists').then(response => {
      this.potential_lists = response.data
    }).catch(this.showError)
    axios.get('collectors_requests').then(response => {
      this.collectors_requests = response.data
    }).catch(this.showError)
    axios.get('orders').then(response => {
      this.orders = response.data
    }).catch(this.showError)
  }
}
</script>
