<template>
<div class="producer-form">
  <div class="col-md-12 mr-auto ml-auto">
    <div class="wizard-container">
      <div class="card card-wizard active" data-color="rose" id="wizardProfile">
        <b-form @submit.prevent="save" v-if="!isLoading">
          <div class="card-header card-header-icon card-header-rose text-center">
            <div class="card-icon">
              <router-link to="/produtores">
                <i class="material-icons">people</i>
              </router-link>
            </div>
            <h3 class="card-title">
              {{producer.nickname || producer.name}}
            </h3>
            <h5 class="card-description">{{producer.description}}</h5>
          </div>
          <div class="wizard-navigation">
            <ul class="nav nav-pills producer-form">
              <li class="nav-item">
                <a class="nav-link" :class="tab == 0 ? 'active' : ''" @click="setTab(0)">
                  Registro
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="tab == 1 ? 'active' : ''" @click="setTab(1)">
                  Apresentação
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="tab == 2 ? 'active' : ''" @click="setTab(2)">
                  Contato
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="tab == 3 ? 'active' : ''" @click="setTab(3)">
                  Financeiro
                </a>
              </li>
            </ul>
          </div>
          <div class="card-body">
            <div class="tab-content">
              <div class="tab-pane" :class="tab == 0 ? 'active' : ''">
                <b-form-group label="CNPJ" class="bmd-form-group">
                  {{form.cnpj | cnpj}}
                </b-form-group>
                <b-form-group label="Nome da rede" class="bmd-form-group">
                  <b-form-input v-model="form.name" name="name" />
                </b-form-group>
                <b-form-group label="Atividade principal" class="bmd-form-group">
                  <b-form-input v-model="form.description" name="description" />
                </b-form-group>
                <b-form-group label="Redes que englobam esta rede *" class="bmd-form-group" v-if="isAdmin">
                  <form-entities-select type="organizations" :form="form" field="organizations" />
                  <field-error :msg="veeErrors" field="organizations" />
                </b-form-group>
              </div>
              <div class="tab-pane" :class="tab == 1 ? 'active' : ''">
                <div class="row justify-content-center">
                  <div class="col-lg-12">
                    <b-form-group label="Histórico do produtor" description="Escreva um breve resumo da história do produtor" class="bmd-form-group">
                      <b-form-textarea v-model="form.history" name="history" />
                    </b-form-group>
                  </div>
                  <div class="col-lg-12">
                    <form-links :form="form" field="links" />
                  </div>
                  <div class="col-lg-12">
                    <pictures-upload :form="form" :error="error" field="images" url="uploads/images" :multiple="true"  />
                  </div>
                </div>
              </div>
              <div class="tab-pane" :class="tab == 2 ? 'active' : ''">
                <form-address :form="form" />
                <form-geolocation :form="form" />
                <form-phones :form="form" field="phones" />
                <form-whats-app :form="form" field="whatsapp" />
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
                <b-form-group label="Inscrição estadual" class="bmd-form-group">
                  <b-form-input v-model="form.state_registration" name="state_registration" />
                </b-form-group>
                <b-form-group label="Inscrição" class="bmd-form-group">
                  <b-form-input v-model="form.subscription" name="subscription" />
                </b-form-group>
                <form-bank-account :form="form" />
                <b-form-group label="Emite nota fiscal?" class="bmd-form-group">
                  <b-form-checkbox v-model="form.issue_invoice" name="issue_invoice" />
                </b-form-group>
              </div>
            </div>
          </div>
          <div class="card-footer justify-content-center">
            <form-submit :errors="error" :sending="isSending" label="Continuar" icon="arrow_forward" />
          </div>
        </b-form>
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
import FormWhatsApp from '@/components/FormWhatsApp'
import FormGeolocation from '@/components/FormGeolocation'
import FormContactPersons from '@/components/FormContactPersons'
import FormEntitiesSelect from '@/components/FormEntitiesSelect'
import FieldError from '@/components/FieldError'
import PicturesUpload from '@/components/PicturesUpload'

export default {

  name: 'ProducerForm',
  data() {
    return {
      tab: 1,
      form: {
        organizations: [],
        cnpj: '',
        email: '',
        name: '',
        description: '',
        password: '',
        history: "",
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
        whatsapp: [],
        contact_persons: [],
        legal_format: "",
        tax_regime: "",
        subscription: "",
        state_registration: "",
        bank_account: {
          bank_number: '',
          agency: '',
          account: '',
          type: 'corrente',
        },
        issue_invoice: false
      },
      producer: null,
    }
  },
  created() {
    this.edit(this.$route.params.id)
  },
  methods: {
    edit(id) {
      this.isLoading = true
      axios.get('producers/' + id, {
        params: {
          populate: 'users'
        }
      }).then(response => {
        this.apiDataToForm(this.form, response.data)
        this.producer = response.data
        this.isLoading = false
      }).catch(this.showError);
    },
    save() {
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.isSending = true
          this.error = false
          axios({
            method: 'PUT',
            url: 'producers/' + this.$route.params.id,
            data: this.form
          }).then(resp => {
            var producer = resp.data
            if (producer && producer._id) {
              this.notify("Os dados foram salvos!")
              if (this.tab == 3) {
                this.$router.replace('/produtores')
              } else {
                window.scrollTo(0,0);
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
    FormWhatsApp,
    FormGeolocation,
    FormContactPersons,
    FormEntitiesSelect,
    FieldError,
    PicturesUpload
  }
};
</script>
