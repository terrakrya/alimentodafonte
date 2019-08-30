<template>
<div class="seed-form">
  <breadcrumb :links="[['Sementes', '/sementes']]" :active="isEditing() ? form.name : 'Importar'" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <div class="row">
        <div class="col-md-8">
          <h1>
            Importar sementes
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
                <th>índice</th>
                <th>name</th>
                <th>scientific_name</th>
                <th>local_name</th>
                <th>description</th>
                <th>seeds_kg</th>
                <th>viability_rate</th>
                <th>lot_limit</th>
                <th>compensation_collect</th>
                <th>price</th>
                <th>wholesale_price</th>
                <th>ecosystem</th>
                <th>fruiting_season</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in import_preview" :key="index">
                <td>{{index + 1}}</td>
                <td>{{item.name}}</td>
                <td>{{item.scientific_name}}</td>
                <td>{{item.local_name}}</td>
                <td>{{item.description}}</td>
                <td>{{item.seeds_kg}}</td>
                <td>{{item.viability_rate}}</td>
                <td>{{item.lot_limit}}</td>
                <td>{{item.compensation_collect}}</td>
                <td>{{item.price}}</td>
                <td>{{item.wholesale_price}}</td>
                <td>{{item.ecosystem}}</td>
                <td>{{item.fruiting_season}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <form-submit :errors="error" :sending="isSending" v-if="import_preview" />
      </b-form>
    </div>
  </div>
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
      form: {
        name: '',
        scientific_name: '',
        local_name: '',
        description: '',
        seeds_kg: 0,
        viability_rate: 50,
        lot_limit: 0,
        compensation_collect: 0,
        price: 0,
        wholesale_price: 0,
        stock: 0,
        ecosystem: [],
        fruiting_season: [],
        images: []
      },
      import_preview: null,
      import_data: null,
      import_log: null,
    }
  },

  created() {
    if (this.isEditing()) {
      this.edit(this.$route.params.id)
    }
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
          this.import_preview = []
          var sheets = response.data.Sheets["Cadastro Semente ARSX 2019"]
          this.import_data = sheets
          var i = 4
          while (i < 2000) {
            if (sheets['C' + i]) {
              try {
                var ecosystems = []
                if (sheets['E' + i]) {
                  ecosystems.push('forest')
                }
                if (sheets['F' + i]) {
                  ecosystems.push('thick')
                }
                if (sheets['G' + i]) {
                  ecosystems.push('swamp')
                }
                var fruiting_season = []
                if (sheets['A' + i]) {
                  sheets['A' + i].v = sheets['A' + i].v.toLowerCase()
                  var months = null
                  if (sheets['A' + i].v.includes(' a ')) {
                    months = sheets['A' + i].v.split(' a ')
                  } else {
                    months = sheets['A' + i].v.split('-')
                  }

                  months.forEach((month, index) => {

                    var mes = this.meses.find(mes => {
                      return mes.text.toLowerCase().indexOf(month.trim()) >= 0
                    })
                    if (mes) {
                      months[index] = parseInt(mes.value)
                    } else {
                      months.splice(index)
                    }
                  })

                  if (months.length == 1) {
                    fruiting_season.push(months[0] + '')
                  } else if (months.length > 1) {
										var m = null
                    if (months[0] < months[1]) {
                      for (m = months[0]; m <= months[1]; m++) {
                        fruiting_season.push(m + '')
                      }
                    } else {
                      for (m = months[0]; m <= 12; m++) {
                        fruiting_season.push(m + '')
                      }
                      for (m = 1; m <= months[1]; m++) {
                        fruiting_season.push(m + '')
                      }
                    }
                  }

                }

                if (sheets['C' + i] && sheets['D' + i] && sheets['N' + i] && sheets['P' + i] && sheets['I' + i] && sheets['K' + i] && sheets['J' + i] && sheets['C' + i]) {
                  this.import_preview.push({
                    name: (sheets['C' + i] ? sheets['C' + i].v.split(',')[0] : '').replace(/-/g, " "),
                    scientific_name: sheets['D' + i].v,
                    local_name: sheets['C' + i].v,
                    seeds_kg: parseFloat(sheets['N' + i].v).toFixed(2),
                    viability_rate: (parseFloat(sheets['P' + i].v) * 100).toFixed(2),
                    compensation_collect: parseFloat(sheets['I' + i].v).toFixed(2),
                    price: parseFloat(sheets['K' + i].v).toFixed(2),
                    wholesale_price: parseFloat(sheets['J' + i].v).toFixed(2),
                    stock: 0,
                    lot_limit: 0,
                    ecosystem: ecosystems,
                    fruiting_season: fruiting_season,
                    images: []
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
          this.isLoading = false
        }).catch((error) => {
          this.isLoading = false
          this.showError(error)
        });
      }
    },
    save() {
      this.import_log = []
      this.import_preview.forEach((item, index) => {
        this.isSending = true
        this.error = false
        axios.get('seeds/slug', {
          params: {
            name: item.name
          }
        }).then(resp => {
          var seed = resp.data
          var isEditing = false

          if (seed && seed._id) {
            seed = Object.assign(seed, item)
            item = seed
            isEditing = true
          }
          axios({
            method: (isEditing ? 'PUT' : 'POST'),
            url: (isEditing ? 'seeds/' + seed._id : 'seeds'),
            data: item
          }).then(resp => {
            var seed = resp.data
            if (seed && seed._id) {
              if (isEditing) {
                this.import_log.push({
                  status: 'success',
                  message: (index + ' - ' + seed.name + ': atualizada com sucesso'),
                  index: index
                })
              } else {
                this.import_log.push({
                  status: 'success',
                  message: (index + ' - ' + seed.name + ': cadastrada com sucesso'),
                  index: index
                })
              }
            } else {
              this.import_log.push({
                status: 'success',
                message: (index + ' - Erro: ' + seed),
                index: index
              })
              this.error = seed
            }
            this.isSending = false
          }).catch(this.showError)
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
