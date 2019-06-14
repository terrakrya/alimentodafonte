<template>
  <div class="pictures-upload">
    <b-form-group :label="'Documento' + (multiple ? 's' : '')" :description="'Selecione um '+ (multiple ? 'ou mais arquivos' : 'arquivo') +' no formato PDF, JPG, JPEG, KMZ ou DOC, com no máximo 32 MB.'" v-show="!isLoading">
      <b-form-file ref="files" id="files" :multiple="multiple" accept="application/msword, application/vnd.google-earth.kml+xml, image/*, application/pdf" v-on:change="uploadDocuments"></b-form-file>
      <span class="text-danger" v-show="error">{{ error }}</span>
    </b-form-group>
    <div class="row" v-if="!isLoading && documents_preview.length > 0">
      <div class="col-xs-12" v-for="(doc, index) in documents_preview" :key="index">
        <a :href="(doc.uri ? baseUrl + doc.uri[0].url : doc.url)" target="_blank"><i class="fa fa-download"></i> {{ fileName(doc) }}</a>
        <a class="btn btn-danger btn-xs pull-right" @click="deleteDocument(index)"><i class="fa fa-trash"></i></a>
      </div>
    </div>
    <loading :loading="isLoading" msg="Enviando documento..."/>
  </div>
</template>

<script>
import axios from 'axios'
import Loading from './Loading'

export default {

  name: 'documents-upload',

  props: ['form', 'preview', 'multiple', 'field', 'url'],

  data () {
    return {


      documents_preview: this.preview
    }
  },

  methods: {
    uploadDocuments(e) {
      this.error = false
      this.isLoading = true
      let files = e.target.files || e.dataTransfer.files;

      for (var i = 0; i < files.length; i++) {

        var reader  = new FileReader();
        var file = files[i]
        reader.onloadend = () => {
          axios({
            method  : 'POST',
            url     : this.url,
            headers : {
              'Content-Type' : 'application/octet-stream',
              'Content-Disposition': 'file; filename="' + file.name + '"',
              'X-CSRF-Token': this.currentUser.csrf_token
            },
            data    : reader.result,
          }).then(response => {
            if (this.multiple) {
              this.documents_preview.push(response.data)
              this.form[this.field].push({ target_id: response.data.fid[0].value })
            } else {
              this.documents_preview = [response.data]
              this.form[this.field] = [{ target_id: response.data.fid[0].value }]
            }
            this.isLoading = false
          }).catch((error) => {
            this.isLoading = false
            this.showError("Ocorreu um erro ao enviar: "+ file.name + ". Erro: "+ error.message)
          });
        }
        reader.readAsArrayBuffer(files[i]);
      }
    },
    deleteDocument(index) {
      this.$delete(this.documents_preview, index)
      this.$delete(this.form[this.field], index)
    },
    showError(msg) {
      this.error = msg
    },
    fileName (doc) {
      var doc_url = (doc.uri ? doc.uri[0].url : doc.url).split('/')
      return doc_url[doc_url.length -1]
    }

  },
  components: {
    'loading': Loading
  }

};
</script>

<style lang="sass">
.brand h1
  margin-top: 10px
  font-size: 31px
  a
  color: #fff
  span
  font-weight: 300
  strong
  font-weight: 900
  </style>
