<template>
<div class="">
  <div class="card" :class="showForm ? '' : 'card-hidden'">
    <div class="row">
      <div class="col-sm-6">
        <div class="card-header card-header-rose text-center" @click="setView('login')" :class="{active: active_view == 'login'}">
          <h4 class="card-title">Entrar</h4>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="card-header card-header-rose text-center" @click="setView('register')" :class="{active: active_view == 'register'}">
          <h4 class="card-title">Cadastrar</h4>
        </div>
      </div>
    </div>
    <div v-if="active_view == 'login'">
      <form @submit.prevent="login" class="form-auth-small">
        <div class="card-body ">
          <p class="card-description text-center">Entre com suas credenciais</p>
          <span class="bmd-form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="material-icons">email</i>
                </span>
              </div>
              <input v-model="email" type="text" class="form-control" placeholder="Nome de usuário ou e-mail...">
            </div>
          </span>
          <span class="bmd-form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="material-icons">lock_outline</i>
                </span>
              </div>
              <input v-model="password" type="password" class="form-control" placeholder="Senha...">
            </div>
          </span>
        </div>
        <div class="card-footer justify-content-center">
          <button type="submit" class="btn btn-rose btn-link btn-lg">Continuar</button>
          <button v-if="isLoading" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Fazendo login...</button>
          <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        </div>
      </form>
    </div>
    <div v-if="active_view == 'register'">
      <form @submit.prevent="register" class="form-auth-small">
        <div class="card-body ">
          <p class="card-description text-center">Cadastre-se para continuar</p>
          <div class="row">
            <div class="col-sm-6">
              <b-form-group label="Nome *">
                <b-form-input v-model="form.name" v-validate="'required'" name="name" />
                <field-error :msg="veeErrors" field="name" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="CPF/CNPJ *">
                <b-form-input v-model="form.cnpj" v-validate="'required'" name="cnpj" v-mask="['##.###.###/####-##']" />
                <field-error :msg="veeErrors" field="cnpj" />
              </b-form-group>
            </div>
            <div class="col-sm-12">
              <b-form-group label="Endereço *">
                <b-form-textarea v-model="form.address" v-validate="'required'" name="address" />
                <field-error :msg="veeErrors" field="address" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Email">
                <b-form-input v-model="form.email" v-validate="'email'" name="email" />
                <field-error :msg="veeErrors" field="email" />
                <div class="text-right" v-if="isEditing()">
                  <a class="pointer" @click="changePassword">Alterar senha</a>
                </div>
              </b-form-group>
            </div>
          </div>
          <div class="row gray">
            <div class="col-sm-6">
              <b-form-group label="Senha *">
                <b-form-input v-model="form.password" type="password" v-validate="'required'" name="pass" />
                <field-error :msg="veeErrors" field="pass" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Confirmar senha *">
                <b-form-input v-model="form.password_confirmation" type="password" v-validate="'required'" name="pass_confirmation" />
                <field-error :msg="veeErrors" field="pass_confirmation" />
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="card-footer justify-content-center">
          <button type="submit" class="btn btn-rose btn-link btn-lg">Continuar</button>
          <button v-if="isLoading" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Fazendo login...</button>
          <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script>
import auth from '../auth'
import axios from 'axios'
import FieldError from '@/components/FieldError'

export default {
  created() {
    if (this.$store.state.currentUser) {
      this.$router.replace('/carrinho')
    }
    setTimeout(() => { this.showForm = true }, 500);
  },
  data() {
    return {
      email: '',
      password: '',
      showForm: false,
      year: new Date().getFullYear(),
      active_view: 'login',
      form: {
        email: null,
        password: '',
        password_confirmation: '',
        name: '',
        cnpj: '',
        address: ''
      }
    }
  },
  methods: {
    login() {
      this.error = false
      this.isLoading = true
      auth.login(this.email, this.password, response => {
        if (response.authenticated) {
          this.$router.replace(this.$route.query.redirect || '/carrinho')
        } else {
          this.error = response.error
        }
        this.isLoading = false
      })
    },
    register() {
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.isSending = true
          this.error = false

          axios({
            method: 'POST',
            url: '/register',
            data: this.form
          }).then(resp => {
            var user = resp.data
            if (user && user._id) {
              auth.login(this.form.email, this.form.password, response => {
                if (response.authenticated) {
                  this.notify("Cadastro realizado com sucesso")
                  this.$router.replace(this.$route.query.redirect || '/carrinho')
                } else {
                  this.error = response.error
                }
                this.isLoading = false
              })
            }
            this.isSending = false
          }).catch(this.showError)
        }
      })
    },
    setView(view) {
      this.active_view = view
    }
  },
  components: {
    FieldError
  }
};
</script>

<style lang="sass" scoped>
.error
  color: red
.card-header
  width: 100%
  cursor: pointer
  &:not(.active)
    background: gray !important
    box-shadow: none !important
.card
  box-shadow: none !important
</style>
