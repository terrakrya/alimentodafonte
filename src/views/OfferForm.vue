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
            Publicar oferta
          </h4>
        </div>
        <div class="card-body">
          <b-form @submit.prevent="save" v-if="!isLoading">
            <div v-if="product_variation">
              <div class="col-md-12 mr-auto ml-auto">
                <div class="row">
                  <div class="col-sm-2">
                    <product-image :product="product_variation.product" :product_variation="product_variation" />
                  </div>
                  <div class="col-sm-10">
                    <h4>{{product_variation.name}}</h4>
                    <span>{{product_variation.description}}</span>
                    <tags :tags="product_variation.tags" />
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
                    <b-form-group label="Data de fabricação *" class="bmd-form-group">
                      <b-form-input v-model="form.manufacturing_date" type="date" v-validate="'required'" name="manufacturing_date" />
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
                    <b-form-group label="Lote *" class="bmd-form-group">
                      <b-form-input v-model="form.lot" v-validate="'required'" name="lot" />
                      <field-error :msg="veeErrors" field="lot" />
                    </b-form-group>
                  </div>
                  <div class="col-md-4">
                    <b-form-group label="Quantidade disponível *" class="bmd-form-group">
                      <b-form-input v-model="form.qtd" type="number" v-validate="'required'" name="qtd" :min="form.qtd_ordered" :disabled="isEditing()" />
                      <small v-if="isEditing() && form.qtd_ordered > 0">Já vendidos: {{form.qtd_ordered}}</small>
                      <field-error :msg="veeErrors" field="qtd" />
                    </b-form-group>
                  </div>
                  <div class="col-md-4">
                    <b-form-group label="Emissor da nota fiscal *" class="bmd-form-group">
                      <b-form-select class="form-control" v-model="form.invoice_issuer" :options="emissores_da_nota" v-validate="'required'" name="invoice_issuer" />
                      <field-error :msg="veeErrors" field="invoice_issuer" />
                    </b-form-group>
                  </div>
                </div>
                <div class="card-footer justify-content-center">
                  <form-submit :errors="error" :sending="isSending" :label="isEditing() ? 'Salvar oferta' : 'Publicar oferta'" />
                </div>
              </div>
            </div>
            <div v-else class="row justify-content-center">
              <div class="col-md-8">
                <h3>Selecione o produto</h3>
                <form-entity-select type="product_variations" :input="loadProductVariation" label="Selecione o produto" :form="form" field="product_variation" />
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
import emissores_da_nota from '@/data/emissores-da-nota.json';
import FieldError from '@/components/FieldError'

export default {

  name: 'OfferForm',
  data() {
    return {
      emissores_da_nota: emissores_da_nota,
      form: {
        product_variation: null,
        manufacturing_date: '',
        final_price: 0,
        lot: '',
        source_of_shipment: '',
        qtd: '',
        qtd_ordered: 0,
        invoice_issuer: '',
      },
      product_variation: null,
      offer: null,
    }
  },
  created() {

    if (this.isEditing()) {
      this.edit(this.$route.params.id)
    } else if (this.$route.query.product_variation) {
      axios.get('product_variations/' + this.$route.query.product_variation, {
        params: {
          populate: 'product supplier organization'
        }
      }).then(response => {
        this.setProductVariation(response.data)
      }).catch(this.showError);
    }

  },
  methods: {
    edit(id) {
      this.isLoading = true
      axios.get('offers/' + id, {
        params: {
          populate: 'product_variation product_variation.product'
        }
      }).then(response => {
        this.offer = response.data
        this.apiDataToForm(this.form, this.offer)
        this.setProductVariation(this.offer.product_variation)
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
    setProductVariation(product_variation) {
      this.form.product_variation = product_variation._id
      if (!this.form.final_price) {
        this.form.final_price = product_variation.final_price
      }
      this.product_variation = product_variation

      if (this.product_variation.supplier && this.product_variation.supplier.issue_invoice) {
        this.form.invoice_issuer = 'supplier'
      } else if (this.product_variation.organization && this.product_variation.organization.issue_invoice) {
        this.form.invoice_issuer = 'organization'
      } else {
        this.form.invoice_issuer = 'platform'
      }
    },
    loadProductVariation(product_variation) {
      axios.get('product_variations/' + product_variation.id, {
        params: {
          populate: 'product supplier organization'
        }
      }).then(response => {
        this.setProductVariation(response.data)
      }).catch(this.showError);

    },
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
