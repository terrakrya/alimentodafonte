<template>
<div class="supplier-form">
  <div class="col-md-8 col-12 mr-auto ml-auto">
    <div class="wizard-container">
      <div class="card card-wizard active" data-color="rose" id="wizardProfile">
        <b-form @submit.prevent="save" v-if="!isLoading">
          <div class="card-header card-header-icon card-header-rose text-center">
            <div class="card-icon">
              <router-link to="/fornecedores">
                <i class="material-icons">people</i></a>
              </router-link>
            </div>
            <h3 class="card-title">
              Cadastrar fornecedor
            </h3>
            <h5 class="card-description">Preencha os dados abaixo para continuar</h5>
          </div>
          <div class="wizard-navigation">
            <ul class="nav nav-pills supplier-form">
              <li class="nav-item active">
                <span class="nav-link active">
                  Registro
                </span>
              </li>
              <li class="nav-item">
                <span class="nav-link">
                  Apresentação
                </span>
              </li>
              <li class="nav-item">
                <span class="nav-link">
                  Contato
                </span>
              </li>
              <li class="nav-item">
                <span class="nav-link">
                  Financeiro
                </span>
              </li>
            </ul>
          </div>
          <div class="card-body">
            <div class="tab-content">
              <div class="tab-pane active">
                <h5 class="info-text">Insira os dados da organização fornecedora</h5>
                <div class="row justify-content-center">
                  <div class="col-lg-10">
                    <b-form-group label="CNPJ da organização *" class="bmd-form-group">
                      <b-form-input v-model="form.cnpj" v-validate="'required'" name="cnpj" v-mask="['##.###.###/####-##']" />
                      <field-error :msg="veeErrors" field="cnpj" />
                    </b-form-group>
                  </div>
                  <div class="col-lg-10" v-if="isAdmin">
                    <b-form-group label="Redes que englobam esta organização *" class="bmd-form-group">
                      <form-entities-select type="organizations" :form="form" field="organizations" />
                      <field-error :msg="veeErrors" field="organizations" />
                    </b-form-group>
                  </div>
                </div>
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
import FormEntitiesSelect from '@/components/FormEntitiesSelect'
import FormSubmit from '@/components/FormSubmit'

export default {

  name: 'SupplierRegisterForm',
  data() {
    return {
      form: {
        organizations: [],
        cnpj: '',
        email: '',
        password: '',
      }
    }
  },
  methods: {
    save() {
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.isSending = true
          this.error = false
          axios({
            method: 'POST',
            url: 'suppliers',
            data: this.form
          }).then(resp => {
            var supplier = resp.data
            if (supplier && supplier._id) {
              this.notify("Cadastro realizado com sucesso!")
              this.$router.replace('/editar-fornecedor/' + supplier._id)
            }
            this.isSending = false
          }).catch(this.showError)
        }
      })
    }
  },
  components: {
    FormSubmit,
    FormEntitiesSelect
  }
};
</script>
