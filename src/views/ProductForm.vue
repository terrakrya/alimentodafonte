<template>
<div class="product-form">
  <div class="col-md-12 mr-auto ml-auto">
    <div class="wizard-container">
      <div class="card card-wizard active" data-color="rose" id="wizardProfile">
        <b-form @submit.prevent="save" v-if="!isLoading">
          <div class="card-header text-center" v-if="product">
            <h3 class="card-title">
              {{product.name}}
            </h3>
            <h5 class="card-description">{{product.description}}</h5>
          </div>
          <div class="card-header text-center" v-else>
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
                  Características
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="tab == 2 ? 'active' : ''" @click="setTab(2)">
                  Valores
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="tab == 3 ? 'active' : ''" @click="setTab(3)">
                  Ficha técnica
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="tab == 4 ? 'active' : ''" @click="setTab(3)">
                  Estocagem e Frete
                </a>
              </li>
            </ul>
          </div>
          <div class="card-body">
            <div class="tab-content">
              <div class="tab-pane" :class="tab == 0 ? 'active' : ''">
                <h5 class="info-text"> Em qual fase este produto está? </h5>
                <div class="row justify-content-center">
                  <div class="col-md-10">
                    <div class="row">
                      <div v-for="(category, index) in categorias_de_produtos" class="col-sm-4">
                        <label class="choice" :class="{ active: form.category == category.value }">
                          <input type="radio" v-model="form.category" :value="category.value">
                          <div class="icon">
                            <i :class="category.icon"></i>
                          </div>
                          <h6>{{category.text}}</h6>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <br>
                <br>
                <b-form-group label="Fornecedor *" class="bmd-form-group">
                  <form-entity-select type="suppliers" :form="form" field="supplier" :validate="'required'"  />
                </b-form-group>
                <b-form-group label="Nome do produto *" class="bmd-form-group">
                  <b-form-input v-model="form.name" v-validate="'required'" name="name" />
  								<field-error :msg="veeErrors" field="name" />
                </b-form-group>
                <b-form-group label="Descrição *" description="Texto que irá aparecer na apresentação do produto" class="bmd-form-group">
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
              </div>
              <div class="tab-pane" :class="tab == 1 ? 'active' : ''">
                <div class="row justify-content-center">
                  <div class="col-lg-12">
                    <b-form-group label="Histórico do fornecedor" description="Escreva um breve resumo da história do fornecedor" class="bmd-form-group">
                      <b-form-textarea v-model="form.history" name="history" />
                    </b-form-group>
                  </div>
                  <div class="col-lg-12">
                    <form-links :form="form" field="links" />
                  </div>
                  <div class="col-lg-12">
                    <pictures-upload :form="form" :preview="this.images_preview" :error="error" field="images" url="uploads/images" :multiple="true" />
                  </div>
                </div>
              </div>
              <div class="tab-pane" :class="tab == 2 ? 'active' : ''">
                <form-address :form="form" />
                <form-geolocation :form="form" />
                <form-phones :form="form" field="phones" />
                <b-form-group label="Email" class="bmd-form-group">
                  <b-form-input v-model="form.email" name="email" />
                </b-form-group>
                <form-contact-persons :form="form" field="contact_persons" />
              </div>
              <div class="tab-pane" :class="tab == 3 ? 'active' : ''">
                <b-form-group label="Formato jurídico" class="bmd-form-group">
                  <b-form-input v-model="form.legal_format" name="legal_format" />
                </b-form-group>
                <b-form-group label="Regime tributário" class="bmd-form-group">
                  <b-form-input v-model="form.tax_regime" name="tax_regime" />
                </b-form-group>
                <b-form-group label="Inscrição" class="bmd-form-group">
                  <b-form-input v-model="form.subscription" name="subscription" />
                </b-form-group>
                <form-bank-account :form="form" />
              </div>
              <div class="tab-pane" :class="tab == 4 ? 'active' : ''">
              </div>
            </div>
          </div>
          <div class="card-footer justify-content-center">
            <form-submit :errors="error" :sending="isSending" label="Continuar" icon="arrow_forward" />
          </div>
        </b-form>
        <pre>{{form}}</pre>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import FormAddress from '@/components/FormAddress'
import FormBankAccount from '@/components/FormBankAccount'
import FormSubmit from '@/components/FormSubmit'
import FormLinks from '@/components/FormLinks'
import FormPhones from '@/components/FormPhones'
import FormGeolocation from '@/components/FormGeolocation'
import FormContactPersons from '@/components/FormContactPersons'
import FormUsers from '@/components/FormUsers'
import FormEntitySelect from '@/components/FormEntitySelect'
import FieldError from '@/components/FieldError'
import PicturesUpload from '@/components/PicturesUpload'
import FormEditor from '@/components/FormEditor';
import FormTags from '@/components/FormTags';
import FormMonths from '@/components/FormMonths';
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
        cnpj: '',
        email: '',
        name: '',
        description: '',
        password: '',
        history: '',
        certifications: [],
        seasonality: [],
        address: {
          uf: "",
          city: "",
          postal_code: "",
          address: ""
        },
        geolocation: {
          lat: "",
          lng: ""
        },
        images: [],
        links: [],
        phones: [],
        contact_persons: [],
        legal_format: "",
        tax_regime: "",
        subscription: "",
        bank_account: {
          bank_number: '',
          agency: '',
          account: '',
          type: 'corrente',
        }
      },
      product: null,
      images_preview: [],
      certifications: []
    }
  },
  created() {
    if (this.isEditing()) {
      this.edit(this.$route.params.id)
    }
    axios.get('products', {
      params: {
        select: 'certifications'
      }
    }).then(response => {
      response.data.forEach(product => {
        product.certifications.forEach(certification => {
          this.certifications.push(certification)
        })
      });
      this.certifications = this.certifications.filter((v,i,a)=>a.findIndex(t=>(t.text === v.text))===i)
    }).catch(this.showError);
  },
  methods: {
    edit(id) {
      this.isLoading = true
      axios.get('products/' + id, {
        params: {
          populate: 'users'
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
              if (this.tab == 3) {
                this.$router.replace('/produtos')
              } else {
                this.$router.replace('/editar-produto/'+product._id)
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
      this.tab = tab
    },
  },
  components: {
    FormAddress,
    FormBankAccount,
    FormSubmit,
    FormLinks,
    FormPhones,
    FormGeolocation,
    FormContactPersons,
    FormUsers,
    FormEntitySelect,
    FieldError,
    PicturesUpload,
    FormEditor,
    FormTags,
    FormMonths
  }
};
</script>
