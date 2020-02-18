<template>
<div class="user-form">
  <div class="col-md-12 mr-auto ml-auto">
    <div class="wizard-container">
      <div class="card card-wizard active" data-color="purple" id="wizardProfile">
        <div class="card-header card-header-icon card-header-rose">
          <div class="card-icon">
            <router-link to="/usuarios">
              <i class="material-icons">person</i>
            </router-link>
          </div>
          <h4 class="card-title">
            {{isEditing() ? 'Editar usuário' : 'Cadastrar usuário'}}
          </h4>
        </div>
        <div class="card-body">
          <loading :loading="isLoading" />
          <b-form @submit.prevent="save" v-if="!isLoading">
            <div class="row">
              <div class="col-sm-6">
                <b-form-group label="Nome *">
                  <b-form-input v-model="form.name" v-validate="'required'" name="name" />
                  <field-error :msg="veeErrors" field="name" />
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
            <div class="row gray" v-if="showPasswordFields">
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
            <div class="row">
              <div class="col-md-12">
                <pictures-upload :form="form" :error="error" field="image" url="uploads/images" />
              </div>
            </div>
            <div class="row" v-if="isAdmin">
              <div class="col-sm-6">
                <b-form-group label="Perfis de usuário *">
                  <b-form-radio-group v-model="form.roles[0]" :options="tipos_de_usuario" v-validate="'required'" name="roles" />
                  <field-error :msg="veeErrors" field="roles" />
                </b-form-group>
              </div>
            </div>
            <form-submit :errors="error" :sending="isSending" />
          </b-form>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import FormSubmit from '@/components/FormSubmit'
import PicturesUpload from '@/components/PicturesUpload'
import FieldError from '@/components/FieldError'
import tipos_de_usuario from '@/data/tipos-de-usuario.json'

export default {

  name: 'UserForm',
  computed: {
    showPasswordFields() {
      return !this.isEditing() || this.show_password
    }
  },
  data() {
    return {
      show_password: false,
      tipos_de_usuario: tipos_de_usuario,
      form: {
        email: null,
        password: '',
        password_confirmation: '',
        name: '',
        image: {},
        roles: [],
      },
    }
  },
  created() {
    if (this.isEditing()) {
      this.edit(this.$route.params.id)
    }
  },
  methods: {
    edit(id) {
      this.isLoading = true
      axios.get('users/' + id).then(response => {
        this.apiDataToForm(this.form, response.data)
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
            url: (this.isEditing() ? 'users/' + this.$route.params.id : 'users'),
            data: this.form
          }).then(resp => {
            var user = resp.data
            if (user && user._id) {
              if (user._id == this.currentUser._id) {
                this.$store.dispatch('login', user)
              }
              this.$router.replace('/usuarios')
            }
            this.isSending = false
          }).catch(this.showError)
        }
      })
    },
    changePassword() {
      this.show_password = !this.show_password
    }
  },
  components: {
    Loading,
    FormSubmit,
    FieldError,
    PicturesUpload
  }

};
</script>
