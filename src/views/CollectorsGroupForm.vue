<template>
<div class="collectors-group-form">
  <breadcrumb :links="[['Grupos de coletores', '/grupos-de-coletores']]" :active="isEditing() ? form.name : 'Cadastrar'" />
  <div class="panel panel-headline data-list">
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
              <the-mask v-model="form.cnpj" :mask="['##.###.###/####-##']" />
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
            </b-form-group>
          </div>
        </div>
        <form-submit :errors="error" :sending="isSending" />
      </b-form>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormHeadline from '@/components/FormHeadline'
import FormEntitiesSelect from '@/components/FormEntitiesSelect'
import FormAddress from '@/components/FormAddress'
import FormBankAccount from '@/components/FormBankAccount'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import bancos from '@/data/bancos.json';
import tipos_de_conta from '@/data/tipos-de-conta2.json';

export default {

  name: 'CollectorsGroupForm',
  data() {
    return {
      bancos: bancos.map(banco => ({
        value: Number(banco.value),
        text: banco.text
      })),
      tipos_de_conta: tipos_de_conta,
      collectors: [],
      form: {
        name: '',
        description: '',
        cnpj: '',
        contact: '',
        address: {
          uf: "",
          city: "",
          postal_code: "",
          address: ""
        },
        bank_account: {
          bank_number: '',
          agency: '',
          account: '',
          type: 'corrente',
        },
        seeds: [],
        collectors: [],
      },
    }
  },
  created() {
    if (this.isEditing()) {
      this.edit(this.$route.params.id)
    }

    axios.get('users', { params: { role: 'collector', populate: { path: 'collectors_group', select: '_id' } } }).then(resp => {
      this.collectors = resp.data
      console.log(this.collectors);
      this.collectors = this.collectors.filter(collector => {
        return !collector.collectors_group || collector.collectors_group._id == id
      })
      console.log(this.collectors);
      this.collectors = this.collectors.map(collector => {
        return {
          id: collector._id,
          title: collector.name,
          description: collector.nickname,
          picture: collector.image ? collector.image.thumb : '',
        }
      });

    }).catch(this.showError);

  },
  methods: {
    edit(id) {
      this.isLoading = true
      axios.get('collectors_groups/' + id).then(response => {
        var data = response.data
        this.apiDataToForm(this.form, data)
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
            url: 'collectors_groups' + (this.isEditing() ? '/' + this.$route.params.id : ''),
            data: this.form
          }).then(resp => {
            var collectors_group = resp.data
            if (collectors_group && collectors_group._id) {
              this.$router.replace('/grupo-de-coletores/' + collectors_group._id)
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
    FormHeadline,
    FormEntitiesSelect,
    FormAddress,
    FormBankAccount,
    FormSubmit,
    FieldError
  }
};
</script>
