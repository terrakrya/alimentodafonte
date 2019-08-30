<template>
<div class="potential-list-form">
  <breadcrumb :links="[['Listas de potencial', '/listas-de-potencial']]" :active="isEditing() ? form.name : 'Importar'" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <div class="row">
        <div class="col-md-8">
          <h1>
            Importar listas de potencial
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
        <div v-if="import_preview && !import_log">
          <h2>Os seguintes dados serão inseridos no sistema:</h2>
          <table class="table b-table b-table-stacked-md">
            <thead>
              <tr>
                <th>Cod</th>
                <th>Grupo</th>
                <th>Qtd - Semente</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in import_preview" :key="index">
                <td>{{item.code}}</td>
                <td>{{item.collectors_group}}</td>
                <td>
                  <p v-for="(seed_item, vindex) in item.seed_items"  :key="vindex">{{seed_item.qtd}} kg - {{seed_item.seed.split(', ')[0]}}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <form-submit :errors="error" :sending="isSending" v-if="import_preview" />
      </b-form>
    </div>
  </div>
  <pre>{{form }}</pre>
  <pre>{{import_preview }}</pre>
  <pre>{{import_data}}</pre>
</div>
</template>
<script>
import axios from 'axios'
import slugify from 'slugify'
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
      form: [],
      import_preview: null,
      import_data: null,
      import_log: null,
      collectors_groups: null,
      seeds: null
    }
  },

  created() {
    axios.get('collectors_groups').then(resp => {
      this.collectors_groups = resp.data
    })
    axios.get('seeds').then(resp => {
      this.seeds = resp.data
    })

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
          var sheets = response.data.Sheets["Potencial e Pedido 2019"]
          this.import_data = sheets
          var i = 2
          while (i < 1000) {
            if (sheets['A' + i] && sheets['A' + i].v) {
              try {
                if (sheets['A' + i] && sheets['B' + i] && sheets['E' + i]) {

                  items.push({
                    seed: sheets['A' + i].v,
                    collectors_group: sheets['B' + i].v,
                    qtd: sheets['E' + i].v
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
          var groups = items.map(item => item.collectors_group)
          groups = Array.from(new Set(groups))
          this.import_preview = []
          this.form = []
          groups.forEach((group, group_index) => {

            var collectors_group = this.collectors_groups.find(collectors_group => {
              return collectors_group.slug == slugify(group).toLowerCase()
            })
            if (collectors_group && collectors_group._id) {
              var preview = {
                code: group_index + 1,
                collectors_group: group,
                seed_items: []
              }

              var form = {
                code: group_index + 1,
                collectors_group: collectors_group._id,
                seed_items: []
              }

              items.filter(item => item.collectors_group == group).forEach(item => {
                var seed = this.seeds.find(seed => seed.slug == slugify(item.seed.split(', ')[0]).toLowerCase())
                if (seed && seed._id) {
                  preview.seed_items.push({
                    seed: item.seed,
                    qtd: parseFloat(item.qtd).toFixed(2)
                  })
                  form.seed_items.push({
                    seed: seed._id,
                    qtd: parseFloat(item.qtd).toFixed(2),
                    compensation_collect: seed.compensation_collect,
                    price: seed.price,
                    wholesale_price: seed.wholesale_price,
                  })
                } else {
                  preview.seed_items.push({
                    seed: 'Semente não encontrada: ' + item.seed
                  })
                }
              })
              this.import_preview.push(preview)
              this.form.push(form)

            } else {
              this.import_preview.push({
                collectors_group: 'Grupo: ' + group + ' não encontrado',
                seed_items: []
              })
            }
          })
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
        setTimeout(() => {
          axios({
            method: 'POST',
            url: 'potential_lists',
            data: item
          }).then(resp => {
            var potential_list = resp.data
            if (potential_list && potential_list._id) {
              this.import_log.push({
                status: 'success',
                message: (index + ' - Lista ' + potential_list.code + ': cadastrada com sucesso'),
                index: index
              })
            } else {
              this.import_log.push({
                status: 'success',
                message: (index + ' - Erro: ' + potential_list),
                index: index
              })
              this.error = potential_list
            }
            this.isSending = false
          }).catch(this.showError)

        }, 2000);
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
