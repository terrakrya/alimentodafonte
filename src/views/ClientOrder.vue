<template>
<div class="client-order">
  <router-link class="btn btn-warning logout" v-if="currentUser" to="/logout">
    Sair
  </router-link>
  <div class="row" v-if="order">
    <div class="card card-plain">
      <div class="card-body">
        <h3 class="card-title">Pedido {{order.code}} - <small>{{orderStatus(order.status)}}</small></h3>
        <br />
        <div class="table-responsive">
          <table class="table table-shopping">
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
                  <small v-if="item.offer.producer">{{item.offer.producer.name}}</small>
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
                  {{itemStatus(item.status)}}
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
        <br>
      </div>
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

export default {

  name: 'ClientOrder',
  computed: {
    total() {
      return this.order.items.reduce(function(a, item) {
        return a + Number(item.total)
      }, 0);
    }
  },
  created() {
    axios.get('shop/order/' + this.$route.params.id).then(response => {
      this.order = response.data
    }).catch(this.showError)
  },
  data() {
    return {
      order: null
    }
  },
  components: {
    Loading,
    NoItem,
    ProductImage
  }
};
</script>
