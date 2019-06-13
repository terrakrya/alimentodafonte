<template>
  <div class="pictures-upload">
    <b-form-group :label="'Foto' + (multiple ? 's' : '')" :description="'Selecione um '+ (multiple ? 'ou mais arquivos' : 'arquivo') +' no formato PNG, GIF, JPG ou JPEG, com no máximo 32 MB.'" v-show="!loading">
      <b-form-file ref="files" id="files" :multiple="multiple" accept="image/*" v-on:change="uploadImages"></b-form-file>
      <span class="text-danger" v-show="error">{{ error }}</span>
    </b-form-group>
    <div class="row images_preview" v-if="!loading && images_preview.length > 0">
      <div class="col-xs-2" v-for="(image, index) in images_preview" :key="index">
        <b-img :src="baseURL() + image.thumb" fluid thumbnail />
        <br>
        <br>
        <p class="text-center"><a class="btn btn-default btn-small" @click="deleteImage(index)"><i class="fa fa-trash"></i></a></p>
      </div>
    </div>
    <loading :loading="loading" msg="Enviando foto..."/>
  </div>
</template>

<script>
import axios from 'axios'
import Loading from './Loading'

export default {

  name: 'pictures-upload',
  props: ['form', 'preview', 'multiple', 'field', 'url'],
  inject: ['$validator'],
  data () {
    return {
      error: false,
      loading: false,
      images_preview: this.preview
    }
  },
  methods: {
    uploadImages(e) {
      // this.loading = true
      let files = e.target.files;

      for (var i = 0; i < files.length; i++) {
        var file = files[i]
        var formData = new FormData();
        formData.append('image', file, file.name);
        axios.post(this.url, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(response => {
          if (this.multiple) {
            console.log('multiple')
            console.log(this.form[this.field])
            console.log(response.data)

            this.images_preview.push(response.data)
            this.form[this.field].push(response.data)
            console.log(this.form[this.field])

          } else {
            console.log('single')

            this.images_preview = [response.data]
            this.form[this.field] = [response.data]
          }
          this.loading = false
        }).catch((error) => {
          this.loading = false
          this.showError("Ocorreu um erro ao enviar: "+ file.name + ". Erro: "+ error.message)
        });
      }
    },
    baseURL() {
      return axios.defaults.baseURL.replace('/api', '')
    },
    deleteImage(index) {
      this.$delete(this.images_preview, index)
      this.$delete(this.form[this.field], index)
    },
    showError(msg) {
      this.error = msg
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
