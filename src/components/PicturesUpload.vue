<template>
<div class="pictures-upload fileinput">
  <b-form-group :label="'Foto' + (multiple ? 's' : '')" :description="'Selecione um '+ (multiple ? 'ou mais arquivos' : 'arquivo') +' no formato PNG, GIF, JPG ou JPEG, com no máximo 32 MB.'" v-show="!isLoading">
    <span class="btn btn-rose btn-round btn-file" @click="selectFile()">
      <span class="fileinput-new"><i class="material-icons">add_a_photo</i> Selecionar fotos</span>
      <b-form-file class="hidden" ref="files" id="files" :multiple="multiple" accept="image/*" v-on:change="uploadImages"></b-form-file>
    </span>
    <span class="text-danger" v-show="error">{{ error }}</span>
  </b-form-group>
  <div v-if="!isLoading">
    <div v-if="Array.isArray(form[field]) && form[field].length > 0" class="row images_preview">
      <div class="col-md-4" v-for="(image, index) in form[field]" :key="index">
        <div class="fileinput-new thumbnail">
          <b-img :src="baseUrl + image.thumb" />
        </div>
        <br>
        <p class="text-center"><a class="btn btn-danger btn-sm btn-round fileinput-exists" @click="deleteImage(index)"><i class="fa fa-trash"></i> Remover</a></p>
      </div>
    </div>
    <div v-if="!Array.isArray(form[field]) && form[field] && form[field].thumb">
      <div class="col-xs-2">
        <b-img :src="baseUrl + form[field].thumb" fluid thumbnail />
        <br>
        <br>
        <p class="text-center"><a class="btn btn-default btn-small" @click="deleteImage()"><i class="fa fa-trash"></i></a></p>
      </div>
    </div>
  </div>
  <loading :loading="isLoading" msg="Enviando foto" />
</div>
</template>

<script>
import axios from 'axios'
import Loading from './Loading'

export default {

  name: 'pictures-upload',
  props: ['form', 'multiple', 'field', 'url'],
  inject: ['$validator'],
  methods: {
    uploadImages(e) {
      this.isLoading = true
      this.error = null
      let files = e.target.files;

      for (var i = 0; i < files.length; i++) {
        var file = files[i]
        var formData = new FormData();
        formData.append('image', file, file.name);
        axios.post(this.url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          if (this.multiple) {
            this.form[this.field].push(response.data)
          } else {
            this.form[this.field] = response.data
          }
          this.isLoading = false
        }).catch((error) => {
          this.isLoading = false
          this.showError(error)
        });
      }
    },
    deleteImage(index) {
      if (this.multiple) {
        this.$delete(this.form[this.field], index)
      } else {
        this.form[this.field] = null
      }
    },
    selectFile() {
      document.getElementById('files').click()
    }
  },
  components: {
    Loading
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
