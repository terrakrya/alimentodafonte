<template>
<div class="audios-upload">
  <b-form-group :label="'Áudio' + (multiple ? 's' : '')" :description="'Selecione um '+ (multiple ? 'ou mais arquivos' : 'arquivo') +' de áudio no formato MP3, MP4 ou WAV com no máximo 32 MB.'" v-show="!isLoading">
    <b-form-file ref="files" id="files" :multiple="multiple" accept="audio/*" v-on:change="uploadAudios"></b-form-file>
    <span class="text-danger" v-show="error">{{ error }}</span>
  </b-form-group>
  <div class="row" v-if="!isLoading && audios_preview.length > 0">
    <div class="col-xs-12" v-for="(audio, index) in audios_preview" :key="index">
      <a :href="(baseUrl + audio)" target="_blank"><i class="fa fa-music"></i> &nbsp; {{ audio | filename }}</a>
      <a class="btn btn-danger btn-xs pull-right" @click="deleteAudio(index)"><i class="fa fa-trash"></i></a>
    </div>
  </div>
  <loading :loading="isLoading" msg="Enviando áudio" />
</div>
</template>

<script>
import axios from 'axios'
import Loading from './Loading'

export default {

  name: 'audios-upload',
  props: ['form', 'preview', 'multiple', 'field', 'url'],
  inject: ['$validator'],
  data() {
    return {
      audios_preview: typeof this.preview == 'string' ? [this.preview] : this.preview
    }
  },
  methods: {
    uploadAudios(e) {
      this.isLoading = true
      this.error = null
      let files = e.target.files;

      for (var i = 0; i < files.length; i++) {
        var file = files[i]
        var formData = new FormData();
        formData.append('audio', file, file.name);
        axios.post(this.url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          if (this.multiple) {
            this.audios_preview.push(response.data)
            this.form[this.field].push(response.data)
          } else {
            this.audios_preview = [response.data]
            this.form[this.field] = response.data
          }
          this.isLoading = false
        }).catch((error) => {
          this.isLoading = false
          this.showError("Ocorreu um erro ao enviar: " + file.name + ". Erro: " + error.message)
        });
      }
    },
    deleteAudio(index) {
      this.$delete(this.audios_preview, index)
      if (this.multiple) {
        this.$delete(this.form[this.field], index)
      } else {
        this.form[this.field] = null
      }

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
