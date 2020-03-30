<template>
<div class="order" v-if="order">
  <div class="card">
    <div class="card-header card-header-icon card-header-rose">
      <div class="card-icon">
        <router-link to="/pedidos">
          <i class="material-icons">list_alt</i>
        </router-link>
      </div>
      <h4 class="card-title ">Pedido {{order.code}}</h4>
    </div>
    <div class="card-body">
      <table class="table">
        <thead>
          <tr>
            <th>Oferta</th>
            <th class="th-description">Origem</th>
            <th class="th-description">Produtor</th>
            <th class="th-description">Emissor da NF</th>
            <th class="text-center">Valor</th>
            <th class="text-center">Qtd</th>
            <th class="text-left">Total</th>
            <th class="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in order.items">
            <td>
              <div class="img-container">
                <product-image :product="item.offer.product" />
              </div>
              <router-link :to="'/oferta/'+item.offer._id">
                {{item.offer.product.name}}
              </router-link>
            </td>
            <td>
              <small>{{item.offer.source_of_shipment}}</small>
            </td>
            <td>
              <small v-if="item.offer.producer">{{item.offer.producer.nickname || item.offer.producer.name}}</small>
            </td>
            <td>
              <small>{{invoiceIssuer(item.offer.invoice_issuer)}}</small>
            </td>
            <td class="text-center">
              {{item.offer.final_price | moeda}}
            </td>
            <td class="text-center">
              {{item.qtd}}
            </td>
            <td>
              {{item.offer.final_price * item.qtd | moeda}}
            </td>
            <td>
              <b-form-select class="form-control" v-model="item.status" :options="status_do_item" @input="changeStatus()" />
            </td>
          </tr>
          <tr>
            <td colspan="5"></td>
            <td>
              Total
            </td>
            <td colspan="1">
              <strong>{{total | moeda}}</strong>
            </td>
            <td colspan="1"></td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr v-if="order.name">
            <td>Nome:</td>
            <th class="text-right">{{order.name}}</th>
          </tr>
          <tr v-if="order.cnpj">
            <td>CNPJ:</td>
            <th class="text-right">{{order.cnpj}}</th>
          </tr>
          <tr v-if="order.email">
            <td>Email:</td>
            <th class="text-right">{{order.email}}</th>
          </tr>
          <tr v-if="order.phone">
            <td>Telefone:</td>
            <th class="text-right">{{order.phone}}</th>
          </tr>
          <tr v-if="order.address">
            <td>Endereço:</td>
            <th class="text-right">{{order.address}}</th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import slugify from 'slugify'
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'
import ProductImage from '@/components/ProductImage'
import status_do_item from '@/data/status-do-item.json';

export default {
  name: 'Order',
  data() {
    return {
      status_do_item: status_do_item,
      order: null
    }
  },
  computed: {
    total() {
      return this.order.items.reduce(function(a, item) {
        return a + Number(item.total)
      }, 0);
    }
  },
  created() {
    axios.get('orders/' + this.$route.params.id).then(response => {
      this.order = response.data
    }).catch(this.showError)
  },
  methods: {
    orderTotal(order) {
      return order.items.reduce((a, b) => {
        return a + b.total
      }, 0)
    },
    changeStatus() {
      axios.put('orders/'+this.order._id, {items: this.order.items}).then(response => {
        if (response.data) {
          this.notify("Status atualizado com sucesso!")
        }
      }).catch(this.showError)
    }
  },
  components: {
    Loading,
    NoItem,
    ProductImage
  }
};
</script>
