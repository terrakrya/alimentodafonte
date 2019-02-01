<template>
  <div class="pictures-upload">
    <b-form-group label="Fotos" description="Selecione um ou mais arquivos dos formatos: PNG, GIF, JPG ou JPEG, com no máximo 32 MB.">
      <b-form-file ref="files" id="files" multiple accept="image/*" v-on:change="uploadImages"></b-form-file>
    </b-form-group>
    <div class="row preview" v-if="preview.length > 0">
      <div class="col-md-4" v-for="(image, index) in preview" v-bind:key="index">
        <b-img v-bind:src="(image.uri ? baseURL() + image.uri[0].url : image.url)" fluid thumbnail />
        <br>
        <br>
        <p class="text-center"><a class="btn btn-default btn-small" @click="deleteImage(index)"><i class="fa fa-trash"></i></a></p>
      </div>
    </div>
  </div>  
</template>

<script>
import axios from 'axios'

export default {

  name: 'pictures-upload',

  props: ['form', 'preview', 'error'],

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  },

  methods: {
    uploadImages(e) {
      let files = e.target.files || e.dataTransfer.files;
      
      for (var i = 0; i < files.length; i++) {

        var reader  = new FileReader();
        var file = files[i]
        reader.onloadend = () => {
          axios({
            method  : 'POST',
            url     : "file/upload/commerce_product/seed/field_images?_format=json",
            headers : {
              'Content-Type' : 'application/octet-stream',
              'Content-Disposition': 'file; filename="' + file.name + '"',
              'X-CSRF-Token': this.currentUser.csrf_token
            },
            data    : reader.result,
          }).then(response => {
            this.preview.push(response.data)
            this.form.field_images.push({ target_id: response.data.fid[0].value })
          }).catch(() => { this.error ="Ocorreu um erro ao enviar: "+ file.name }); 
        }
        reader.readAsArrayBuffer(files[i]);
      }
    },
    baseURL() {
      return axios.defaults.baseURL
    },
    deleteImage(index) {
      this.$delete(this.preview, index)
      this.$delete(this.form.field_images, index)
    }

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