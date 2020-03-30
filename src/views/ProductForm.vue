<template>
<div class="product-form">
  <div class="col-md-12 mr-auto ml-auto">
    <div class="wizard-container">
      <div class="card card-wizard active" data-color="purple" id="wizardProfile">
        <div class="card-header card-header-rose card-header-icon" v-if="product">
          <div class="card-icon">
            <router-link to="/produtos">
              <i class="material-icons">shopping_cart</i>
            </router-link>
          </div>
          <h4 class="card-title">
            {{product.name}}
          </h4>
        </div>
        <div class="card-header card-header-icon card-header-rose text-center" v-else>
          <div class="card-icon">
            <router-link to="/produtos">
              <i class="material-icons">shopping_cart</i>
            </router-link>
          </div>
          <h3 class="card-title">
            Cadastro de produtos
          </h3>
          <h5 class="card-description">Preencha os dados abaixo para continuar</h5>
        </div>
        <br>
        <br>
        <div class="card-body">
          <b-form @submit.prevent="save" v-if="!isLoading">
            <!-- <h5 class="info-text"> Em qual fase este produto está? </h5>
                <div class="row justify-content-center">
                  <div class="col-md-10">
                    <div class="row">
                      <div v-for="(category, index) in categorias_de_produtos" :key="index" class="col-sm-4">
                        <label class="choice" :class="{ active: form.category == category.value }">
                          <input type="radio" v-model="form.category" :value="category.value" v-validate="'required'" name="category">
                          <div class="icon">
                            <i :class="category.icon"></i>
                          </div>
                          <h6>{{category.text}}</h6>
                        </label>
                      </div>
                    </div>
                  </div>
                  <field-error :msg="veeErrors" field="category" />
                </div>
                <br>
                <br> -->
            <b-form-group label="Produtor *" class="bmd-form-group" v-if="isManager">
              <form-entity-select type="producers" :form="form" field="producer" :validate="'required'" />
            </b-form-group>
            <b-form-group label="Nome do produto *" class="bmd-form-group">
              <b-form-input v-model="form.name" v-validate="'required'" name="name" description="Yuka" />
              <field-error :msg="veeErrors" field="name" />
            </b-form-group>
            <b-form-group label="Descrição *" description="Texto que irá aparecer na apresentação do produto." class="bmd-form-group">
              <b-form-textarea v-model="form.description" v-validate="'required'" name="description" />
              <field-error :msg="veeErrors" field="description" />
            </b-form-group>
            <b-form-group label="Categorias" class="bmd-form-group">
              <form-tags :form="form" field="tags" :tags="tags" />
            </b-form-group>
            <b-form-group label="Período de oferta" class="bmd-form-group">
              <form-months :form="form" field="seasonality" />
            </b-form-group>
            <h5> VALORES </h5>
            <div class="row justify-content-center">
              <div class="col-md-4">
                <b-form-group label="Preço do produto / unidade" class="bmd-form-group">
                  <money v-model="form.producer_price" class="form-control" @input="calcFinalPrice"></money>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group label="Taxa de entrega" class="bmd-form-group">
                  <money v-model="form.taxes" class="form-control" @input="calcFinalPrice"></money>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group label="Preço final" class="bmd-form-group">
                  <h4>{{form.final_price | moeda}}</h4>
                </b-form-group>
              </div>
            </div>

            <pictures-upload :form="form" field="images" url="uploads/images" :multiple="true" />
            <div class="card-footer justify-content-center" v-if="tab == 0">
              <form-submit :errors="error" :sending="isSending" label="Continuar" icon="arrow_forward" />
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
import FormEntitySelect from '@/components/FormEntitySelect'
import FieldError from '@/components/FieldError'
import PicturesUpload from '@/components/PicturesUpload'
import FormEditor from '@/components/FormEditor';
import FormTags from '@/components/FormTags';
import FormMonths from '@/components/FormMonths';
import ProductImage from '@/components/ProductImage';
import categorias_de_produtos from '@/data/categorias-de-produtos.json'


export default {

  name: 'ProductForm',
  data() {
    return {
      categorias_de_produtos: categorias_de_produtos,
      tab: 0,
      form: {
        producer: null,
        category: '',
        name: '',
        images: [],
        description: '',
        history: '',
        tags: [],
        seasonality: [],
        producer_price: '',
        taxes: '',
        final_price: 0
      },
      product: null,
      tags: [],
    }
  },
  created() {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab
    }
    if (this.isEditing()) {
      this.edit()
    }
    axios.get('shop/tags').then(response => {
      this.tags = response.data.map(tag => {
        return {text: tag}
      })
      console.log(this.tags);
    }).catch(this.showError)
  },
  methods: {
    edit() {
      this.isLoading = true
      axios.get('products/' + this.$route.params.id).then(response => {
        this.apiDataToForm(this.form, response.data)
        this.product = response.data
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
            url: (this.isEditing() ? 'products/' + this.$route.params.id : 'products'),
            data: this.form
          }).then(resp => {
            var product = resp.data
            if (product && product._id) {
              this.notify("Os dados foram salvos!")
              window.scrollTo(0, 0);
              this.$router.replace('/produtos')
            }
            this.isSending = false
          }).catch(this.showError)
        }
      })
    },
    calcFinalPrice() {
      this.form.final_price = this.form.producer_price + this.form.taxes
    }
  },
  components: {
    FormSubmit,
    FormEntitySelect,
    FieldError,
    PicturesUpload,
    FormEditor,
    FormTags,
    FormMonths,
    ProductImage
  }
};
</script>
