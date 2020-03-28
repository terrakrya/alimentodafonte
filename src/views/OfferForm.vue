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
                <div>
                  <div class="row justify-content-center">
                    <div class="col-md-6">
                      <b-form-group label="Origem do envio *" description="Lugar onde o produto está estocado aguardando para envio" class="bmd-form-group">
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
                    <div class="col-md-4">
                      <b-form-group label="Preço final *" description="Valor do produto + impostos + frete" class="bmd-form-group">
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
                    <div class="col-md-6">
                      <b-form-group label="Tipos de entrega *" class="bmd-form-group">
                        <b-form-checkbox-group v-model="form.shipping_types" :options="tipos_de_entrega" v-validate="'required'" name="shipping_types" />
                        <field-error :msg="veeErrors" field="shipping_types" />
                      </b-form-group>
                    </div>
                    <div class="col-md-6">
                      <b-form-group label="Oferta ativa *" description="Se esta opção estiver marcada a oferta vai aparecer na lista de ofertas e os clientes poderão comprar." class="bmd-form-group">
                        <b-form-checkbox v-model="form.published" />
                      </b-form-group>
                    </div>
                  </div>
                  <div class="card-footer justify-content-center">
                    <form-submit :errors="error" :sending="isSending" :label="isEditing() ? 'Salvar oferta' : 'Anunciar oferta'" />
                  </div>
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

export default {

  name: 'OfferForm',
  data() {
    return {
      tipos_de_entrega: tipos_de_entrega,
      tipos_de_oferta: tipos_de_oferta,
      form: {
        offer_type: '',
        product: null,
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
          populate: 'product'
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
    displayAddress(address) {
      return address.display_name
      .split(', ')
      .filter(name => (name.indexOf('Região ') < 0 && name.indexOf('Microrregião ') < 0 && name.indexOf('Mesorregião ') < 0 && name != "Brasil"))
      .join(', ')
    }
  },
  components: {
    FormSubmit,
    ProductImage,
    FormEntitySelect,
    Tags,
    FieldError
  }
};
</script>
