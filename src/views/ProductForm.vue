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
        <div class="wizard-navigation">
          <br>
          <br>
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
                <pictures-upload :form="form" field="images" url="uploads/images" :multiple="true" />
                <div class="card-footer justify-content-center" v-if="tab == 0">
                  <form-submit :errors="error" :sending="isSending" label="Continuar" icon="arrow_forward" />
                </div>
              </b-form>
            </div>
            <div class="tab-pane" :class="tab == 1 ? 'active' : ''" v-if="product">
              <div>
                <div class="text-center">
                  <router-link class="btn btn-success" :to="'/cadastrar-variacao-de-produto/?product=' + product._id">
                    Cadastrar nova variação
                  </router-link>
                  <br>
                  <br>
                </div>
                <div class="table-responsive" v-if="product.product_variations && product.product_variations.length">
                  <table class="table table-shopping">
                    <thead>
                      <tr>
                        <th class="text-center"></th>
                        <th>Variação</th>
                        <th class="text-right">Preço</th>
                        <th class="text-right">Publicado</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(product_variation, index) in product.product_variations" :key="index">
                        <td>
                          <router-link :to="'/editar-variacao-de-produto/' + product_variation._id + '?product=' + product._id">
                            <product-image :product="product" :product_variation="product_variation" />
                          </router-link>
                        </td>
                        <td class="td-name">
                          <router-link :to="'/editar-variacao-de-produto/' + product_variation._id + '?product=' + product._id">
                            {{product_variation.name}}
                          </router-link>
                          <br />
                          <small>{{product_variation.description}}</small>
                        </td>
                        <td class="td-number text-right">
                          {{product_variation.final_price | moeda}}
                        </td>
                        <td class="text-right" :class="{'text-success': product_variation.published, 'text-danger': !product_variation.published }">
                          {{product_variation.published ? 'Sim' : 'Não'}}
                        </td>
                        <td class="td-number">
                          <div class="btn-group btn-group-sm">
                            <button class="btn btn-danger" @click="removeVariation(product_variation._id)"> <i class="material-icons">close</i> </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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
import ProductImage from '@/components/ProductImage';
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
      certifications: [],
    }
  },
  created() {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab
    }
    if (this.isEditing()) {
      this.edit()
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
    edit() {
      this.isLoading = true
      axios.get('products/' + this.$route.params.id, {
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
              if (this.isEditing()) {
                window.scrollTo(0, 0);
                this.tab += 1
              } else {
                window.scrollTo(0, 0);
                this.$router.replace('/cadastrar-variacao-de-produto?product=' + product._id)
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
    removeVariation(id) {
      if (confirm("Tem certeza que deseja excluír?")) {
        axios.delete('product_variations/' + id).then(() => {
          this.edit()
        }).catch(this.showError)
      }
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
