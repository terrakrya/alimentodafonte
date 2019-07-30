<template>
<div class="collection-area-form">
  <breadcrumb :links="[['Áreas de coleta', '/areas-de-coleta']]" :active="isEditing() ? form.name : 'Cadastrar'" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <form-headline name="área de coleta" />
      <loading :loading="isLoading" />
      <b-form @submit.prevent="save" v-if="!isLoading">
        <div class="row">
          <div class="col-sm-8">
            <b-form-group label="Nome da área *">
              <b-form-input v-model="form.name" v-validate="'required'" name="name" />
              <field-error :msg="veeErrors" field="name" />
            </b-form-group>
          </div>
          <div class="col-sm-4">
            <b-form-group label="Área estimada" :description="'Área de ' + form.estimated_area + ' hectares'">
              <b-form-input v-model="form.estimated_area" type="number" step="0.01" lang="nb" min="0" />
            </b-form-group>
          </div>
        </div>
        <div class="row gray">
          <div class="col-sm-6">
            <b-form-group label="Descrição da área" description="Descreva aqui as características da área">
              <b-form-textarea v-model="form.description" :rows="3" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <documents-upload :form="form" :error="error" field="documents" url="uploads/documents" />
          </div>
        </div>
        <form-address :form="form" />
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
        <form-group-collector :form="form" />
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
import FormGroupCollector from '@/components/FormGroupCollector'
import FormAddress from '@/components/FormAddress'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import DocumentsUpload from '@/components/DocumentsUpload'

export default {

  name: 'CollectionAreaForm',

  data() {
    return {
      form: {
        name: "",
        description: "",
        estimated_area: 0,
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
				collectors_group: null,
        collector: null,
        documents: null,
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
      axios.get('collection_areas/' + id).then(response => {
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
            url: 'collection_areas' + (this.isEditing() ? '/' + this.$route.params.id : ''),
            data: this.form
          }).then(resp => {
            var collection_area = resp.data
            if (collection_area && collection_area._id) {
              this.$router.replace('/area-de-coleta/' + collection_area._id)
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
    FormGroupCollector,
    FormAddress,
    FormSubmit,
    FieldError,
    DocumentsUpload
  }
};
</script>
