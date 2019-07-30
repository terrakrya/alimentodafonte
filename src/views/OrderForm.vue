<template>
<div class="collectors-request-form">
  <breadcrumb :links="[['Encomendas', '/encomendas']]" :active="isEditing() ? 'Encomenda ' + form.code : 'Cadastrar'" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <form-headline name="encomenda" />
      <loading :loading="isLoading" />
      <b-form @submit.prevent="save" v-if="!isLoading">
        <div class="row">
          <div class="col-sm-6">
            <b-form-group label="Cliente *">
              <form-entity-select type="clients" :form="form" field="client" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="Área total" description="Área total a ser restaurada em hectares">
              <b-form-input v-model="form.restored_area" type="number" step="0.01" lang="nb" />
            </b-form-group>
          </div>
        </div>
        <div class="row gray">
          <div class="col-sm-4">
            <b-form-group label="Data do recebimento">
              <b-form-input v-model="form.date_receiving" type="date" />
            </b-form-group>
          </div>
          <div class="col-sm-4">
            <b-form-group label="Prazo final">
              <b-form-input v-model="form.deadline" type="date" />
            </b-form-group>
          </div>
          <div class="col-sm-4">
            <b-form-group label="Status do contrato">
              <b-form-radio-group v-model="form.contract" :options="
								['Enviado', 'Assinado']" stacked />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <b-form-group label="Fitofisionomia">
              <b-form-select v-model="form.vegetation" :options="
								fitofisionomias" stacked />
            </b-form-group>
          </div>
          <div class="col-sm-4">
            <b-form-group label="Brejo?">
              <b-form-checkbox v-model="form.bog">O solo fica encharcado por mais de um mês?</b-form-checkbox>
            </b-form-group>
          </div>
          <div class="col-sm-4">
            <b-form-group label="Alaga?">
              <b-form-checkbox v-model="form.flood">O local fica inundado por mais de um mês?</b-form-checkbox>
            </b-form-group>
          </div>
        </div>
        <div class="row gray">
          <div class="col-sm-4">
            <b-form-group label="Valor pago">
              <money v-model="form.amount_paid"></money>
            </b-form-group>
          </div>
          <div class="col-sm-4">
            <b-form-group label="Valor restante">
              <money v-model="form.amount_remain"></money>
            </b-form-group>
          </div>
          <div class="col-sm-4">
            <b-form-group label="Tipo de compra">
              <b-form-radio-group v-model="form.purchase_type" :options="
								['Atacado', 'Varejo']" stacked />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <form-seeds-select :form="form" field="seed_items" :basecalc="form.purchase_type == 'Atacado' ? 'wholesale_price' : 'price'" />
          </div>
        </div>
        <form-submit :errors="error" :sending="isSending" v-if="form.seed_items && form.seed_items.length" />
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
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSeedsSelect from '@/components/FormSeedsSelect'
import FormSubmit from '@/components/FormSubmit'
import fitofisionomias from '@/data/fitofisionomias.json'

export default {
  name: 'OrderForm',
  data() {
    return {
      fitofisionomias: fitofisionomias,
      form: {
        code: null,
        client: null,
        seed_items: [],
        date_receiving: '',
        deadline: '',
        purchase_type: 'Varejo',
        contract: '',
        vegetation: '',
        restored_area: '',
        bog: false,
        flood: false,
        amount_paid: '',
        amount_remain: '',
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
      axios.get('orders/' + id).then(response => {
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
            url: 'orders' + (this.isEditing() ? '/' + this.$route.params.id : ''),
            data: this.form
          }).then(resp => {
            var order = resp.data
            if (order && order._id) {
              this.$router.replace('/encomenda/' + order._id)
            }
            this.isSending = false
          }).catch(this.showError)
        }
      })
    },

  },

  components: {
    Breadcrumb,
    Loading,
    FormHeadline,
    FormEntitySelect,
    FormSeedsSelect,
    FormSubmit
  }

};
</script>
