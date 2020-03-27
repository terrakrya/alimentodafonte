<template>
  <div class="row">
    <div class="card card-plain">
      <div class="card-body">
        <h3 class="card-title">Resumo da compra</h3>
        <br/>
        <div class="table-responsive">
          <table class="table table-shopping">
            <thead>
              <tr>
                <th class="text-center"></th>
                <th>Oferta</th>
                <th class="th-description">Origem</th>
                <th class="th-description">Emissor da NF</th>
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
                  <small v-if="item.offer.producer"><br />{{item.offer.producer.name}}</small>
                  <!-- <small v-if="item.offer.organization"><br />{{item.offer.organization.name}}</small> -->
                </td>
                <td>
                  <small>{{item.offer.source_of_shipment}}</small>
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
        <div v-if="client">
          <h4 class="text-center">Confirme os dados abaixo para finalizar a compra</h4>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <b-form-group label="Nome *">
                <b-form-input v-model="form.name" v-validate="'required'" name="name" />
                <field-error :msg="veeErrors" field="name" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="CPF/CNPJ *">
                <b-form-input v-model="form.cnpj" v-validate="'required'" name="cnpj" v-mask="['###.###.###-##', '##.###.###/####-##']" />
                <field-error :msg="veeErrors" field="cnpj" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Telefone *">
                <b-form-input v-model="form.phone" v-validate="'required'" name="phone" placeholder="(99) 99999-9999" v-mask="['(##) ####-####', '(##) #####-####']" />
                <field-error :msg="veeErrors" field="phone" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Email *">
                <b-form-input v-model="form.email" v-validate="'email'" name="email" />
                <field-error :msg="veeErrors" field="email" />
                <div class="text-right" v-if="isEditing()">
                  <a class="pointer" @click="changePassword">Alterar senha</a>
                </div>
              </b-form-group>
            </div>
            <div class="col-sm-12">
              <b-form-group label="Endereço *">
                <b-form-textarea v-model="form.address" v-validate="'required'" name="address" />
                <field-error :msg="veeErrors" field="address" />
              </b-form-group>
            </div>
          </div>
        </div>
        <br>
        <button type="button" class="btn btn-info btn-round pull-right" @click="saveOrder">Finalizar compra <i class="material-icons">keyboard_arrow_right</i></button>
        <!-- <a @click="clearCart" class="btn btn-warning btn-round pull-right">Limpar carrinho</a> -->
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
import FieldError from '@/components/FieldError'

export default {

  name: 'Cart',
  data() {
    var client = this.$store.state.currentUser
    var form = {
      name: '',
      email: '',
      address: '',
      phone: '',
      cnpj: '',
      cart: []
    }
    if (client) {
      form.name = client.name
      form.cnpj = client.cnpj
      form.email = client.email
      form.address = client.address
      form.phone = client.phone
    }
    return {
      client: client,
      form: form
    }
  },
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
    },
    saveOrder() {
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.isSending = true
          this.form.cart = this.cart
          axios({
            method: 'POST',
            url: 'shop/order',
            data: this.form
          }).then(resp => {
            console.log(resp);
            var order = resp.data
            if (order && order._id) {
              this.notify("Seu pedido de compra foi realizado com o sucesso! Em breve entraremos em contato.")
              this.$store.dispatch('clearCart')
              this.$router.replace('/meu_pedido/'+order._id)
            }
            this.isSending = false
          }).catch((e, status, x) => {
            this.$router.replace('/entrar')
          })
        }
      })
    }

  },
  components: {
    Loading,
    NoItem,
    ProductImage,
    FieldError
  }
};
</script>
