<template>
<div class="seeds-matrix-form">
  <breadcrumb :links="[['Matrizes de semente', '/matrizes-de-sementes']]" :active="isEditing() ? form.name : 'Cadastrar'" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <form-headline name="matriz de sementes" />
      <loading :loading="isLoading" />
      <b-form @submit.prevent="save" v-if="!isLoading">
        <div class="row">
          <div class="col-sm-6">
            <b-form-group label="Nome da matriz *">
              <b-form-input v-model="form.name" v-validate="'required'" name="name" @input="generateCode" />
              <field-error :msg="veeErrors" field="name" />
              <small v-if="this.form.code">Código: {{this.form.code}}</small>
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="Nome científico">
              <b-form-input v-model="form.scientific_name" />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <b-form-group label="Grupo de coletores">
              <form-entity-select type="collectors_groups" :form="form" field="collectors_group" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="Coletor">
              <form-entity-select type="collectors" :form="form" field="collector" />
            </b-form-group>
          </div>
        </div>
        <div class="row gray">
          <div class="col-sm-6">
            <b-form-group label="Latitude">
              <b-form-input v-model="form.geolocation.lat" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="Longitude">
              <b-form-input v-model="form.geolocation.lng" />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <b-form-group label="Categoria *">
              <b-form-radio-group v-model="form.category" :options="categorias_de_matrizes" stacked v-validate="'required'" name="category" />
              <field-error :msg="veeErrors" field="category" />
            </b-form-group>
          </div>
          <div class="col-sm-4">
            <b-form-group label="Origem *">
              <b-form-radio-group v-model="form.source" :options="origens_de_matrizes" stacked v-validate="'required'" name="source" />
              <field-error :msg="veeErrors" field="source" />
            </b-form-group>
          </div>
          <div class="col-sm-4">
            <b-form-group label="Meses prováveis de coleta">
              <b-form-checkbox-group v-model="form.collec_months" :options="meses" stacked />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <documents-upload :form="form" :multiple="true" :preview="documents_preview" :error="error" field="documents" url="uploads/documents" />
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
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import DocumentsUpload from '@/components/DocumentsUpload'
import categorias_de_matrizes from '@/data/categorias_de_matrizes.json'
import origens_de_matrizes from '@/data/origens_de_matrizes.json'
import meses from '@/data/meses.json'
import utils from '@/views/utils'

export default {

  name: 'SeedsMatrixForm',
  data() {
    return {
      categorias_de_matrizes: categorias_de_matrizes,
      origens_de_matrizes: origens_de_matrizes,
      meses: meses,
      documents_preview: [],
      form: {
        code: '',
        name: '',
        scientific_name: '',
        category: '',
        source: '',
        collec_months: [],
        geolocation: {
          lat: "",
          lng: ""
        },
        collectors_group: null,
        collector: null,
        documents: []
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
      axios.get('seeds_matrixes/' + id).then(response => {
        this.apiDataToForm(this.form, response.data)
        Object.assign(this.documents_preview, response.data.documents)
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
            url: 'seeds_matrixes' + (this.isEditing() ? '/' + this.$route.params.id : ''),
            data: this.form
          }).then(resp => {
            var seeds_matrix = resp.data
            if (seeds_matrix && seeds_matrix._id) {
              this.$router.replace('/matriz-de-sementes/' + seeds_matrix._id)
            }
            this.isSending = false
          }).catch(this.showError)
        }
      })
    },
    generateCode () {
      if (!this.$route.params.id || !this.form.code) {
        this.form.code = utils.generateCode(this.form.name.split(' '))        
      }
    }
  },
  components: {
    Breadcrumb,
    Loading,
    FormHeadline,
    FormEntitySelect,
    FormSubmit,
    FieldError,
    DocumentsUpload
  }
};
</script>
