<template>
<div class="offer-form">
  <div class="col-md-12 mr-auto ml-auto">
    <div class="wizard-container">
      <div class="card card-wizard active" data-color="purple" id="wizardProfile">
        <div class="card-header card-header-icon card-header-rose">
          <div class="card-icon">
            <router-link to="/ofertas">
              <i class="material-icons">local_offer</i>
            </router-link>
          </div>
          <h4 class="card-title">
            Anunciar oferta
          </h4>
        </div>
        <div class="card-body">
          <b-form @submit.prevent="save" v-if="!isLoading">
            <h5 class="info-text"> Qual tipo de oferta você deseja fazer? </h5>
            <div class="row justify-content-center">
              <div class="col-md-10">
                <div class="row">
                  <div v-for="(offer_type, index) in tipos_de_oferta" :key="index" class="col-sm-6 text-center">
                    <label class="choice" :class="{ active: form.offer_type == offer_type.value }">
                      <input type="radio" v-model="form.offer_type" :value="offer_type.value" v-validate="'required'" name="offer_type">
                      <div class="icon">
                        <i :class="offer_type.icon"></i>
                      </div>
                      <h6>{{offer_type.text}}</h6>
                    </label>
                  </div>
                </div>
              </div>
              <field-error :msg="veeErrors" field="category" />
            </div>
            <br>
            <br>
            <div v-if="form.offer_type == 'single_product'">
              <div v-if="product">
                <div class="col-md-12 mr-auto ml-auto">
                  <div class="row">
                    <div class="col-sm-2">
                      <product-image :product="product" />
                    </div>
                    <div class="col-sm-10">
                      <h4>{{product.name}}</h4>
                      <span>{{product.description}}</span>
                      <tags :tags="product.tags" />
                    </div>
                  </div>
                  <br>
                </div>
              </div>
              <div v-else class="row justify-content-center">
                <div class="col-md-8">
                  <h3>Selecione o produto</h3>
                  <form-entity-select type="products" :input="loadProduct" label="Selecione o produto" :form="form" field="product" />
                </div>
              </div>
              <br>
              <br>
              <br>
            </div>
            <div v-if="form.offer_type == 'product_basket'">
              <div class="row justify-content-center">
                <div class="col-md-12 product-form">
                  <h3>Adicionar produto</h3>
                  <div class="row">
                    <div class="col-sm-6">
                      <form-entity-select type="products" label="Selecione o produto" :form="product_form" field="product" />
                    </div>
                    <div class="col-sm-2">
                      <input type="number" class="form-control qtd" v-model="product_form.qtd" :min="1">
                    </div>
                    <div class="col-sm-4">
                      <a class="btn btn-rose btn-round btn-sm" @click="addToBasket()">Adicionar na cesta &#xA0;<i class="material-icons">shopping_cart</i></a>
                    </div>

                  </div>
                  <br>

                </div>
              </div>
              <div v-if="form.basket && form.basket.length > 0">
                <h3>Produtos da cesta:</h3>
                <table class="table">
                  <thead>
                    <th>Produto</th>
                    <th>Valor unitário</th>
                    <th>Quantidade</th>
                    <th>Total</th>
                    <th></th>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in form.basket" :key="index">
                      <td>
                        <product-image :product="item.product" />
                        <h4>{{item.product.name}}</h4>
                      </td>
                      <td>
                        {{item.price | moeda}}
                      </td>
                      <td>
                        {{item.qtd}}
                      </td>
                      <td>
                        <strong>{{item.total | moeda}}</strong>
                      </td>
                      <td>
                        <button type="button" rel="tooltip" data-placement="left" title="Remove item" class="btn btn-danger btn-sm" @click="removeFromBasket(index)">
                          <i class="material-icons">close</i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <th colspan="3" class="text-right">
                        <small>Somatória dos produtos da cesta:</small>
                      </th>
                      <th>
                        <strong>{{form.basket.reduce((a,b) => a + b.total, 0) | moeda}}</strong>
                      </th>
                      <th></th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-if="form.product || (form.basket && form.basket.length > 0) ">
              <div class="row justify-content-center">
                <div class="col-md-12" v-if="form.offer_type == 'product_basket'">
                  <b-form-group label="Nome da cesta" class="bmd-form-group">
                    <b-form-input v-model="form.name" name="name" />
                  </b-form-group>
                </div>
                <div class="col-md-4">
                  <b-form-group label="Preço final *" :description="'Valor '+(form.product ? 'do produto' : 'da cesta') +' (incluindo frete e impostos)'" class="bmd-form-group">
                    <money v-model="form.final_price" class="form-control" v-validate="'required'" name="final_price"></money>
                    <field-error :msg="veeErrors" field="final_price" />
                  </b-form-group>
                </div>
                <div class="col-md-4">
                  <b-form-group label="Cod. de Referência" description="Código de referência do produtor" class="bmd-form-group">
                    <b-form-input v-model="form.lot" name="lot" />
                  </b-form-group>
                </div>
                <div class="col-md-4">
                  <b-form-group label="Quantidade disponível *" class="bmd-form-group">
                    <b-form-input v-model="form.qtd" type="number" v-validate="'required'" name="qtd" :min="form.qtd_ordered" :disabled="isEditing()" />
                    <small v-if="isEditing() && form.qtd_ordered > 0">Já vendidos: {{form.qtd_ordered}}</small>
                    <field-error :msg="veeErrors" field="qtd" />
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-form-group label="Origem do envio *" description="Lugar onde o produto está aguardando para envio" class="bmd-form-group">
                    <b-form-input v-model="form.source_of_shipment" v-validate="'required'" name="source_of_shipment" />
                    <field-error :msg="veeErrors" field="source_of_shipment" />
                  </b-form-group>
                </div>
                <div class="col-md-6">
                  <b-form-group label="Data da colheita/fabricação" class="bmd-form-group">
                    <b-form-input v-model="form.manufacturing_date" type="date" name="manufacturing_date" />
                    <field-error :msg="veeErrors" field="manufacturing_date" />
                  </b-form-group>
                </div>
                <div class="col-md-6">
                  <b-form-group label="Tipos de entrega *" class="bmd-form-group">
                    <b-form-checkbox-group v-model="form.shipping_types" :options="tipos_de_entrega" v-validate="'required'" name="shipping_types" />
                    <field-error :msg="veeErrors" field="shipping_types" />
                  </b-form-group>
                </div>
                <div class="col-md-12" v-if="form.offer_type == 'product_basket'">
                  <b-form-group label="Observações" class="bmd-form-group">
                    <b-form-textarea v-model="form.description" name="description" />
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-form-group label="Oferta ativa *" description="Se esta opção estiver marcada a oferta vai aparecer na lista de ofertas e os clientes poderão comprar." class="bmd-form-group">
                    <b-form-checkbox v-model="form.published" />
                  </b-form-group>
                </div>
                <div class="col-md-12" v-if="form.offer_type == 'product_basket'">
                  <pictures-upload :form="form" field="images" url="uploads/images" :multiple="true" />
                </div>
              </div>
              <div class="card-footer justify-content-center">
                <form-submit :errors="error" :sending="isSending" :label="isEditing() ? 'Salvar oferta' : 'Anunciar oferta'" />
              </div>
            </div>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import FormSubmit from '@/components/FormSubmit'
import ProductImage from '@/components/ProductImage';
import FormEntitySelect from '@/components/FormEntitySelect';
import Tags from '@/components/Tags';
import tipos_de_entrega from '@/data/tipos-de-entrega.json';
import tipos_de_oferta from '@/data/tipos-de-oferta.json'
import FieldError from '@/components/FieldError'
import PicturesUpload from '@/components/PicturesUpload'

export default {

  name: 'OfferForm',
  data() {
    return {
      tipos_de_entrega: tipos_de_entrega,
      tipos_de_oferta: tipos_de_oferta,
      product_form: {
        product: null,
        qtd: 1
      },
      form: {
        name: '',
        description: '',
        images: [],
        offer_type: null,
        product: null,
        basket: [],
        manufacturing_date: '',
        final_price: 0,
        lot: '',
        source_of_shipment: '',
        qtd: '',
        qtd_ordered: 0,
        shipping_types: [],
        published: true,
      },
      product: null,
      offer: null,
    }
  },
  created() {

    if (this.isEditing()) {
      this.edit(this.$route.params.id)
    } else if (this.$route.query.product) {
      axios.get('products/' + this.$route.query.product, {
        params: {
          populate: 'product producer organization'
        }
      }).then(response => {
        this.setProduct(response.data)
      }).catch(this.showError);
    }

  },
  methods: {
    edit(id) {
      this.isLoading = true
      axios.get('offers/' + id, {
        params: {
          populate: 'product basket.product'
        }
      }).then(response => {
        this.offer = response.data
        this.apiDataToForm(this.form, this.offer)
        this.form.published = this.offer.published
        this.setProduct(this.offer.product)
        this.isLoading = false
      }).catch(this.showError);
    },
    save() {
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.isSending = true
          this.error = false
          axios({
            method: (this.isEditing() ? 'PUT' : 'POST'),
            url: (this.isEditing() ? 'offers/' + this.offer._id : 'offers'),
            data: this.form
          }).then(resp => {
            var offer = resp.data
            if (offer && offer._id) {
              this.notify("Oferta publicada com sucesso!")
              window.scrollTo(0, 0);
              this.$router.replace('/ofertas')
            }
            this.isSending = false
          }).catch(this.showError)
        }
      })
    },
    calcFinalPrice() {
      this.form.final_price = this.form.producer_price + this.form.taxes
    },
    setProduct(product) {
      this.form.product = product._id
      if (!this.form.final_price) {
        this.form.final_price = product.final_price
      }
      this.product = product
      if (product && product.producer && product.producer.address) {
        this.form.source_of_shipment = this.displayAddress(product.producer.address)
      }
    },
    loadProduct(product) {
      axios.get('products/' + product.id, {
        params: {
          populate: 'producer organization'
        }
      }).then(response => {
        this.setProduct(response.data)
      }).catch(this.showError);
    },
    addToBasket() {
      axios.get('products/' + this.product_form.product, {
        params: {
          populate: 'producer organization'
        }
      }).then(response => {
        var product = response.data
        this.form.basket.push({
          product: product,
          qtd: this.product_form.qtd,
          price: product.final_price,
          total: product.final_price * this.product_form.qtd
        })
        this.form.final_price = this.form.basket.reduce((a,b) => a + b.total, 0)
        this.form.source_of_shipment = product.producer.address.display_name
      }).catch(this.showError);
    },
    displayAddress(address) {
      return address.display_name
      .split(', ')
      .filter(name => (name.indexOf('Região ') < 0 && name.indexOf('Microrregião ') < 0 && name.indexOf('Mesorregião ') < 0 && name != "Brasil"))
      .join(', ')
    },
    removeFromBasket(index) {
      this.form.basket.splice(index, 1)
    }
  },
  components: {
    FormSubmit,
    ProductImage,
    FormEntitySelect,
    Tags,
    FieldError,
    PicturesUpload
  }
};
</script>
<style lang="sass" scoped>
  .product-form
    .qtd
      font-size: 18px

</style>
