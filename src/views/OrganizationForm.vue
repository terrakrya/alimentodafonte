<template>
<div class="collectors-group-form">
  <div class="col-md-8 col-12 mr-auto ml-auto" v-if="!isEditing()">
    <div class="wizard-container">
      <div class="card card-wizard active" data-color="rose" id="wizardProfile">
        <b-form @submit.prevent="save" v-if="!isLoading">
          <div class="card-header text-center">
            <h3 class="card-title">
              Cadastrar organização
            </h3>
            <h5 class="card-description">Preencha os dados abaixo para continuar</h5>
          </div>
          <div class="wizard-navigation">
            <ul class="nav nav-pills organization-form">
              <li class="nav-item active">
                <span class="nav-link active">
                  Acesso
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
            <!-- <div class="moving-tab" style="width: 219.778px; transform: translate3d(-8px, 0px, 0px); transition: transform 0s ease 0s;">
              About
            </div> -->
          </div>
          <div class="card-body">
            <div class="tab-content">
              <div class="tab-pane active">

                <h5 class="info-text">Insira os dados do responsável e o CNPJ da organização</h5>
                <div class="row justify-content-center">
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
                      <div class="text-right" v-if="isEditing()">
                        <a class="pointer" @click="changePassword">Alterar senha</a>
                      </div>
                    </b-form-group>
                  </div>
                  <div class="col-lg-5">
                    <b-form-group label="Senha *">
                      <b-form-input v-model="form.password" type="password" v-validate="'required'" name="password" ref="password" placeholder="Senha"/>
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
    <!-- wizard container -->
  </div>
  <!-- <breadcrumb :links="[['Grupos de coletores', '/grupos-de-coletores']]" :active="isEditing() ? form.name : 'Cadastrar'" /> -->
  <div class="panel panel-headline data-list" v-else>
    <div class="panel-body">
      <form-headline name="grupo de coletores" />
      <loading :loading="isLoading" />
      <b-form @submit.prevent="save" v-if="!isLoading">
        <div class="row">
          <div class="col-sm-6">
            <b-form-group label="Nome do grupo *">
              <b-form-input v-model="form.name" v-validate="'required'" name="name" />
              <field-error :msg="veeErrors" field="name" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="CNPJ">
              <the-mask v-model="form.cnpj" :mask="['##.###.###/####-##']"  />
            </b-form-group>
          </div>
        </div>
        <div class="row gray">
          <div class="col-sm-6">
            <b-form-group label="Contatos *" description="Liste todas as formas de contato com o grupo">
              <b-form-textarea v-model="form.contact" v-validate="'required'" name="contact" :rows="3" />
              <field-error :msg="veeErrors" field="contact" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="Descrição do grupo" description="Descreva aqui um pouco do trabalho do grupo de coletores">
              <b-form-textarea v-model="form.description" :rows="3" name="body" />
            </b-form-group>
          </div>
        </div>
        <form-address :form="form" />
        <form-bank-account :form="form" />
        <div class="row">
          <div class="col-sm-6">
            <b-form-group label="Sementes">
              <form-entities-select type="seeds" :form="form" field="seeds" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="Coletores">
              <form-entities-select v-if="collectors && collectors.length" :items="collectors" type="collectors" :form="form" field="collectors" />
              <no-item :list="collectors" />
            </b-form-group>
          </div>
        </div>
        <form-submit :errors="error" :sending="isSending" />
      </b-form>
    </div>
  </div>
  <pre>{{form}}</pre>
</div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'
import FormHeadline from '@/components/FormHeadline'
import FormEntitiesSelect from '@/components/FormEntitiesSelect'
import FormAddress from '@/components/FormAddress'
import FormBankAccount from '@/components/FormBankAccount'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import bancos from '@/data/bancos.json';
import tipos_de_conta from '@/data/tipos-de-conta2.json';

export default {

  name: 'OrganizationForm',
  data() {
    return {
      form: {
        cnpj: '07332061000103',
        email: 'admin@admin.com',
        password: 'asdf',
        address: {
          uf: "",
          city: "",
          postal_code: "",
          address: ""
        }
      }
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
      axios.get('organizations/' + id).then(response => {
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
            url: 'organizations' + (this.isEditing() ? '/' + this.$route.params.id : ''),
            data: this.form
          }).then(resp => {
            var organization = resp.data
            if (organization && organization._id) {
              this.$router.replace('/organizacoes/' + organization._id)
            }
            this.isSending = false
          }).catch(this.showError)
        }
      })
    }
  },
  components: {
    Breadcrumb,
    Loading,
    NoItem,
    FormHeadline,
    FormEntitiesSelect,
    FormAddress,
    FormBankAccount,
    FormSubmit,
    FieldError
  }
};
</script>
