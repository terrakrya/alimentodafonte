<template>
<div class="product-form">
  <div class="col-md-12 mr-auto ml-auto">
    <div class="wizard-container">
      <div class="card card-wizard active" data-color="rose" id="wizardProfile">
        <div class="card-header card-header-icon card-header-rose text-center" v-if="product">
          <div class="card-icon">
            <router-link to="/produtos">
              <i class="material-icons">shopping_cart</i>
            </router-link>
          </div>
          <h3 class="card-title">
            {{product.name}}
          </h3>
          <h5 class="card-description">{{product.description}}</h5>
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
        <div class="wizard-navigation">
          <ul class="nav nav-pills product-form">
            <li class="nav-item">
              <a class="nav-link" :class="tab == 0 ? 'active' : ''" @click="setTab(0)">
                Apresentação
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="tab == 1 ? 'active' : ''" @click="setTab(1)">
                Variações do produto
              </a>
            </li>
          </ul>
        </div>
        <div class="card-body">
          <div class="tab-content">
            <div class="tab-pane" :class="tab == 0 ? 'active' : ''">
              <b-form @submit.prevent="save" v-if="!isLoading">
                <h5 class="info-text"> Em qual fase este produto está? </h5>
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
                <br>
                <b-form-group label="Fornecedor *" class="bmd-form-group">
                  <form-entity-select type="suppliers" :form="form" field="supplier" :validate="'required'" />
                </b-form-group>
                <b-form-group label="Nome do produto *" class="bmd-form-group">
                  <b-form-input v-model="form.name" v-validate="'required'" name="name" description="Yuka" />
                  <field-error :msg="veeErrors" field="name" />
                </b-form-group>
                <b-form-group label="Descrição *" description="Texto que irá aparecer na apresentação do produto." class="bmd-form-group">
                  <b-form-textarea v-model="form.description" v-validate="'required'" name="description" />
                  <field-error :msg="veeErrors" field="description" />
                </b-form-group>
                <b-form-group label="História do produto" description="Descreva o histórico deste produto que aparecerá na apresentação" class="bmd-form-group">
                  <form-editor :form="form" field="history" />
                </b-form-group>
                <b-form-group label="Certificações" class="bmd-form-group">
                  <form-tags :form="form" field="certifications" :tags="certifications" />
                </b-form-group>
                <b-form-group label="Período de oferta" class="bmd-form-group">
                  <form-months :form="form" field="seasonality" />
                </b-form-group>
                <pictures-upload :form="form" :preview="this.images_preview" :error="error" field="images" url="uploads/images" :multiple="true" />
                <div class="card-footer justify-content-center" v-if="tab == 0">
                  <form-submit :errors="error" :sending="isSending" label="Continuar" icon="arrow_forward" />
                </div>
              </b-form>
            </div>
            <div class="tab-pane" :class="tab == 1 ? 'active' : ''" v-if="product">
              <product-variations :product="product" />
            </div>
          </div>
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
import ProductVariations from '@/components/ProductVariations';
import categorias_de_produtos from '@/data/categorias-de-produtos.json'


export default {

  name: 'ProductForm',
  data() {
    return {
      categorias_de_produtos: categorias_de_produtos,
      tab: 0,
      form: {
        supplier: null,
        category: '',
        name: '',
        images: [],
        description: '',
        history: '',
        certifications: [],
        seasonality: [],
      },
      product: null,
      images_preview: [],
      certifications: [],
    }
  },
  created() {
    if (this.isEditing()) {
      this.edit(this.$route.params.id)
    }
    axios.get('products', {
      params: {
        select: 'certifications tags'
      }
    }).then(response => {
      response.data.forEach(product => {
        product.certifications.forEach(certification => {
          this.certifications.push(certification)
        })
      });
      this.certifications = this.certifications.filter((v, i, a) => a.findIndex(t => (t.text === v.text)) === i)
    }).catch(this.showError);
  },
  methods: {
    edit(id) {
      this.isLoading = true
      axios.get('products/' + id, {
        params: {
          populate: 'users product_variations'
        }
      }).then(response => {
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
              if (this.tab == 1) {
                this.$router.replace('/produtos')
              } else {
                this.$router.replace('/editar-produto/' + product._id)
                this.edit(product._id)
                window.scrollTo(0, 0);
                this.tab += 1
              }
            }
            this.isSending = false
          }).catch(this.showError)
        }
      })
    },
    setTab(tab) {
      if (this.isEditing()) {
        this.tab = tab
      }
    },
    isEditingProductVariation() {
      this.product_variation && this.product_variation._id
    },
  },
  components: {
    FormSubmit,
    FormEntitySelect,
    FieldError,
    PicturesUpload,
    FormEditor,
    FormTags,
    FormMonths,
    ProductVariations
  }
};
</script>
