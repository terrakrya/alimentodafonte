<template>
  <div class="row">
    <div class="card card-plain">
      <div class="card-body">
        <h3 class="card-title">Meus pedidos</h3>
        <br/>
        <div class="table-responsive">
          <table class="table table-shopping">
            <thead>
              <tr>
                <th class="text-center"></th>
                <th>Oferta</th>
                <th class="th-description">Origem</th>
                <th class="text-center">Valor</th>
                <th class="text-center">Qtd</th>
                <th class="text-left">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in cart">
                <td>
                  <div class="img-container">
                    <product-image :product="item.offer.product" :product_variation="item.offer.product_variation" />
                  </div>
                </td>
                <td class="td-name">
                  <router-link :to="'/oferta/'+item.offer._id">
                    {{item.offer.product_variation.name}}
                  </router-link>
                  <small v-if="item.offer.supplier"><br />{{item.offer.supplier.name}}</small>
                  <!-- <small v-if="item.offer.organization"><br />{{item.offer.organization.name}}</small> -->
                </td>
                <td>
                  <small>{{item.offer.source_of_shipment}}</small>
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
                <td class="td-actions">
                  <button type="button" rel="tooltip" data-placement="left" title="Remove item" class="btn btn-link" @click="removeFromCart(index)">
                    <i class="material-icons">close</i>
                  </button>
                </td>
              </tr>
              <tr>
                <td colspan="4"></td>
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
        </div>
        <br>
        <button type="button" class="btn btn-info btn-round pull-right" @click="saveOrder">Finalizar compra <i class="material-icons">keyboard_arrow_right</i></button>
        <a @click="clearCart" class="btn btn-warning btn-round pull-right">Limpar carrinho</a>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'

export default {

  name: 'Cart',

  created() {
    axios.get('shop/orders').then(response => {
      this.orders = response.data
    }).catch(this.showError)
  },
  components: {
    Loading,
    NoItem,
  }
};
</script>
