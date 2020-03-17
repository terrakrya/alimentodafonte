<template>
  <div class="row">
    <div class="card card-plain">
      <div class="card-body">
        <h3 class="card-title">Carrinho de compras</h3>
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
              {{cart}}
            </tbody>
          </table>
        </div>
        <br>
        <button type="button" class="btn btn-info btn-round pull-right">Finalizar compra <i class="material-icons">keyboard_arrow_right</i></button>
        <a @click="clearCart" class="btn btn-warning btn-round pull-right">Limpar carrinho</a>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'
import ProductImage from '@/components/ProductImage'
import slugify from 'slugify'

export default {

  name: 'Cart',

  computed: {
    cart() {
      return this.$store.state.cart
    },
    total() {
      return this.$store.state.cart.reduce(function(a,item){
        return a + (Number(item.qtd) * Number(item.offer.final_price))
      }, 0);
    }
  },
  methods: {
    removeFromCart(index) {
      this.$store.dispatch('removeFromCart', index)
    },
    clearCart() {
      this.$store.dispatch('clearCart')
      this.notify("Carrinho limpo!")
      this.$router.replace('/loja')
    }

  },
  components: {
    Loading,
    NoItem,
    ProductImage
  }
};
</script>
