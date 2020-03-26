<template>
<div class="organization-form">
  <div class="col-md-8 col-12 mr-auto ml-auto">
    <div class="wizard-container">
      <div class="card card-wizard active" data-color="rose" id="wizardProfile">
        <div class="card-header card-header-icon card-header-rose text-center">
          <div class="card-icon">
            <router-link to="/organizacoes">
              <i class="material-icons">device_hub</i>
            </router-link>
          </div>
          <h3 class="card-title">
            Cadastrar rede
          </h3>
          <h5 class="card-description">Preencha os dados abaixo para continuar</h5>
        </div>
        <b-form @submit.prevent="save" v-if="!isLoading">
          <div class="wizard-navigation">
            <ul class="nav nav-pills organization-form">
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
                <h5 class="info-text">Insira os dados do responsável e o CNPJ da rede</h5>
                <div class="row justify-content-center">
                  <div class="col-lg-10">
                    <b-form-group label="Tipo de rede *" class="form-check">
                      <b-form-checkbox-group  v-model="form.organization_types" :options="tipos_de_organizacao" v-validate="'required'" name="organization_types"  />
                      <field-error :msg="veeErrors" field="organization_types" />
                    </b-form-group>
                  </div>
                  <div class="col-lg-10">
                    <b-form-group label="CNPJ *" class="bmd-form-group">
                      <b-form-input v-model="form.cnpj" v-validate="'required'" name="cnpj" v-mask="['##.###.###/####-##']" />
                      <field-error :msg="veeErrors" field="cnpj" />
                    </b-form-group>
                  </div>
                  <div class="col-lg-10">
                    <b-form-group label="Email">
                      <b-form-input v-model="form.email" v-validate="'email'" name="email" />
                      <field-error :msg="veeErrors" field="email" />
                    </b-form-group>
                  </div>
                  <div class="col-lg-5">
                    <b-form-group label="Senha *">
                      <b-form-input v-model="form.password" type="password" v-validate="'required'" name="password" ref="password" placeholder="Senha" />
                      <field-error :msg="veeErrors" field="password" />
                    </b-form-group>
                  </div>
                  <div class="col-lg-5">
                    <b-form-group label="Confirmar senha *">
                      <b-form-input v-model="form.password_confirmation" type="password" v-validate="'required|confirmed:password'" data-vv-as="password" name="password_confirmation" />
                      <field-error :msg="veeErrors" field="password_confirmation" />
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
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import tipos_de_organizacao from '@/data/tipos-de-organizacao.json'

export default {

  name: 'OrganizationRegisterForm',
  data() {
    return {
      tipos_de_organizacao: tipos_de_organizacao,
      form: {
        cnpj: '',
        email: '',
        password: '',
        organization_types: [],
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
            url: 'organizations',
            data: this.form
          }).then(resp => {
            var organization = resp.data
            if (organization && organization._id) {
              this.notify("Cadastro realizado com sucesso!")
              this.$router.replace('/editar-organizacao/' + organization._id)
            }
            this.isSending = false
          }).catch(this.showError)
        }
      })
    }
  },
  components: {
    FormSubmit,
    FieldError
  }
};
</script>
