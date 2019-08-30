<template>
<div class="collectors-group-form">
  <breadcrumb :links="[['Grupo de coletores', '/grupos-de-coletores']]" :active="isEditing() ? form.name : 'Importar'" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <div class="row">
        <div class="col-md-8">
          <h1>
            Importar grupos de coletores
          </h1>
          <br>
        </div>
      </div>
      <loading :loading="isLoading" />
      <b-form @submit.prevent="save" v-if="!isLoading">
        <div class="row">
          <div class="col-md-12">
            <b-form-group label="Selecione um arquivo para enviar" description="O arquivo deve estar em formato exel: XLS, XLSX ou CSV " v-show="!isLoading">
              <b-form-file ref="files" id="files" v-on:change="upload"></b-form-file>
              <span class="text-danger" v-show="error">{{ error }}</span>
            </b-form-group>
          </div>
        </div>
        <div v-if="import_log">
          <p v-for="(log_item, lindex) in import_log" :key="lindex" :class="log_item.status == 'success' ? 'alert alert-success' : 'alert alert-danger'">{{log_item.message}}</p>
        </div>
        <div v-if="form && !import_log">
          <h2>Os seguintes dados serão inseridos no sistema:</h2>
          <table class="table b-table b-table-stacked-md">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CNPJ</th>
                <th>Descrição</th>
                <th>Contatos</th>
                <th>Endereço</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(group, index) in form" :key="index">
                <td>{{group.name}}</td>
                <td>{{group.cnpj}}</td>
                <td>{{group.description}}</td>
                <td>{{group.contact}}</td>
                <td>{{[group.address.city, group.address.uf, group.address.address].join(' - ')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <form-submit :errors="error" :sending="isSending" v-if="form" />
      </b-form>
    </div>
  </div>
  <pre>{{form }}</pre>
</div>
</template>
<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormSubmit from '@/components/FormSubmit'
import meses from '@/data/meses.json'
import ecossistemas from '@/data/ecossistemas.json'

export default {

  name: 'SeedImport',

  data() {

    return {
      meses: meses,
      ecossistemas: ecossistemas,
      form: null,
      import_preview: null,
      import_data: null,
      import_log: null,
      seeds: null
    }
  },

  created() {

  },

  methods: {
    upload(e) {
      this.isLoading = true
      this.error = null
      let files = e.target.files;

      for (var i = 0; i < files.length; i++) {
        var file = files[i]
        var formData = new FormData();
        formData.append('import', file, file.name);
        axios.post("uploads/import", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          var items = []
          var sheets = response.data.Sheets["Planilha1"]
          this.import_data = sheets
          var i = 2
          while (i < 1000) {
            if (sheets['A' + i] && sheets['A' + i].v) {
              try {
                if (sheets['A' + i]) {

                  items.push({
                    name: sheets['A' + i].v,
                    description: ['Presidente/Elo: ' + sheets['E' + i].v, sheets['F' + i] ? 'Resp. Coletores: ' + sheets['F' + i].v : null].filter(f => f != null).join(', '),
                    cnpj: sheets['B' + i] ? sheets['B' + i].v : '',
                    contact: [sheets['G' + i] ? sheets['G' + i].v : null, sheets['H' + i] ? sheets['H' + i].v : null, sheets['I' + i] ? sheets['I' + i].v : null].filter(f => f != null).join(', '),
                    address: {
                      city: sheets['D' + i].v.split('-')[0],
                      uf: sheets['D' + i].v.split('-')[1],
                      address: sheets['C' + i] ? sheets['C' + i].v : ''
                    }
                  })
                }

              } catch (e) {
								// eslint-disable-next-line
                console.log(e);
              }
              i++;
            } else {
              break;
            }

          }
          this.form = items
          this.isLoading = false
        }).catch((error) => {
          this.isLoading = false
          this.showError(error)
					// eslint-disable-next-line
          console.log(error);
        });
      }
    },
    save() {
      this.import_log = []
      this.form.forEach((item, index) => {
        this.isSending = true
        this.error = false
        axios({
          method: 'POST',
          url: 'collectors_groups',
          data: item
        }).then(resp => {
          var collectors_group = resp.data
          if (collectors_group && collectors_group._id) {
            this.import_log.push({
              status: 'success',
              message: (index + ' - ' + collectors_group.name + ': cadastrada com sucesso'),
              index: index
            })
          } else {
            this.import_log.push({
              status: 'success',
              message: (index + ' - Erro: ' + collectors_group),
              index: index
            })
            this.error = collectors_group
          }
          this.isSending = false
        }).catch(this.showError)
      })
    }
  },

  components: {
    'breadcrumb': Breadcrumb,
    'loading': Loading,
    'form-submit': FormSubmit,
  }

};
</script>
