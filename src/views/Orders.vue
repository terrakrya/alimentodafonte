<template>
<div class="orders">
  <div class="card">
    <div class="card-header card-header-icon card-header-rose">
      <div class="card-icon">
        <i class="material-icons">list_alt</i>
      </div>
      <h4 class="card-title ">Pedidos</h4>
    </div>
    <div class="card-body">
      <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
      <loading :loading="!orders && !error" msg="Carregando lista de pedidos" />
      <no-item :list="orders" />
      <table class="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Data</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders">
            <td>
              <router-link :to="'/pedido/'+order._id">
                Pedido {{order.code}}
              </router-link>
            </td>
            <td>
              <small>{{order.createdAt | data}}</small>
            </td>
            <td>
              {{order.items.length}}
            </td>
            <td>
              {{orderTotal(order) | moeda}}
            </td>
            <td>
              <b-form-select class="form-control" v-model="order.status" :options="status_do_pedido" @input="changeStatus(index)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'

export default {

  name: 'Orders',
  data() {
    return {
      orders: null
    }
  },
  created() {
    axios.get('orders').then(response => {
      this.orders = response.data
    }).catch(this.showError)
  },
  methods: {
    orderTotal(order) {
      return order.items.reduce((a, b) => {
        return a + b.total
      }, 0)
    },
    changeStatus(index) {
      axios.put('orders/'+this.orders[index]._id, {status: this.orders[index].status}).then(response => {
        if (response.data) {
          this.notify("Status atualizado com sucesso!")
        }
      }).catch(this.showError)
    }
  },

  components: {
    Loading,
    NoItem,
  }
};
</script>
