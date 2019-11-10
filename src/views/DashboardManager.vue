<template>
  <div class="dashboard">
    <div class="nav-buttons">
      <router-link class="btn btn-default" to="/organizacoes"><span>Organizações</span></router-link>
    </div>
    <div class="nav-buttons">
      <router-link class="btn btn-default" to="/usuarios" v-if="isAdmin"><span>Usuários</span></router-link>
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
