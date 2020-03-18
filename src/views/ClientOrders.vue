<template>
<div class="client-orders">
  <router-link class="btn btn-warning logout" v-if="currentUser" to="/logout">
    Sair
  </router-link>
  <div class="row">
    <div class="card card-plain">
      <div class="card-body">
        <h3 class="card-title">Meus pedidos</h3>
        <br />
        <div class="table-responsive">
          <table class="table table-shopping">
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
                  <router-link :to="'/meu_pedido/'+order._id">
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
                  {{status_do_pedido[order.status]}}
                  <p v-if="order.status == 'created'">
                    <small>Nossa equipe entrará em contato para proceder com o pedido</small>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'
import status_do_pedido from '@/data/status-do-pedido.json';

export default {

  name: 'ClientOrders',
  data() {
    return {
      status_do_pedido: status_do_pedido,
      orders: null
    }
  },
  created() {
    axios.get('shop/orders').then(response => {
      this.orders = response.data
    }).catch(this.showError)
  },
  methods: {
    orderTotal(order) {
      return order.items.reduce((a, b) => {
        return a + b.total
      }, 0)
    }
  },
  components: {
    Loading,
    NoItem,
  }
};
</script>
