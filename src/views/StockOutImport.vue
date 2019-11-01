<template>
<div class="collectors-request-form">
  <breadcrumb :links="[['Saídas de estoque', '/estoque']]" :active="isEditing() ? form.name : 'Importar'" />
  <div class="panel panel-headline data-request">
    <div class="panel-body">
      <div class="row">
        <div class="col-md-8">
          <h1>
            Importar saídas de estoque
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
          <div v-for="(item, index) in import_preview" :key="index" class="alert alert-danger">{{item}}</div>
        </div>
        <form-submit :errors="error" :sending="isSending" v-if="import_preview" />
      </b-form>
    </div>
  </div>
  <pre>{{lots }}</pre>
  <pre>{{import_preview }}</pre>
  <pre>{{form }}</pre>
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
      lots: {a: ''},
      import_preview: null,
      import_data: null,
      import_log: null,
      seeds_houses: null,
      seeds: null
    }
  },

  created() {
    axios.get('seeds_houses').then(resp => {
      this.seeds_houses = resp.data
    })
    axios.get('lots').then(resp => {
      var lots = {}
      resp.data.forEach(lot => {
        lots[lot.code] = lot._id
      })
      this.lots = lots
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
          var sheets = response.data.Sheets["SAÍDAS 2019"]
          this.import_data = sheets
          var i = 2
          while (i < 1000) {
            if (sheets['D' + i] && sheets['D' + i].v) {
              try {
                if (sheets['D' + i] && sheets['B' + i] && sheets['A' + i]) {
                  items.push({
                    seed: sheets['D' + i].v,
                    seeds_house: sheets['B' + i].v,
                    qtd: sheets['A' + i].v,
                    lot: (sheets['E' + i].v+'').replace('*', ''),
                    createdAt: new Date(sheets['G' + i].w),
                    out_mode: sheets['F' + i].v
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
          this.import_preview = []
          this.form = []
          items.forEach(item => {
            var seed = this.seeds.find(seed => seed.slug == slugify(item.seed.split(', ')[0]).toLowerCase())
            var seeds_house = this.seeds_houses.find(seeds_house => {
              return seeds_house.name == item.seeds_house
            })
            if (seed && seed._id) {
              if (seeds_house && seeds_house._id) {
                this.form.push({
                  seeds_house: seeds_house._id,
                  seed: seed._id,
                  qtd: parseFloat(item.qtd).toFixed(2),
                  out_mode: item.out_mode,
                  lot: item.lot,
                  createdAt: item.createdAt,
                  createdBy: this.$store.state.currentUser._id
                })
              } else {
                this.import_preview.push('Casa de semente não encontrada: ' + item.seeds_house)
              }
            } else {
              this.import_preview.push('Semente não encontrada: ' + item.seed)
            }
          })
          // this.import_preview.push(preview)
          this.isLoading = false
        }).catch((error) => {
          this.isLoading = false
          this.showError(error)
					// eslint-disable-next-line
          console.log(error);
        });
      }
    },
    async save() {
      this.import_log = []
      for (let item of this.form) {
        this.isSending = true
        this.error = false
        await this.saveLot(item)
      }
    },
    async saveLot(item) {
      var code = item.lot
      if (this.lots[code]) {
        item.lot = this.lots[code]
        return this.saveItem(item)
      } else {
        var r = await axios.post('lots', {
          code: code,
          seeds_house: item.seeds_house,
          seed: item.seed,
        })
        this.lots[code] = r.data._id
        item.lot = r.data._id
        return this.saveItem(item)
      }
    },
    saveItem (item) {
      axios({
        method: 'POST',
        url: 'stock_out',
        data: item
      }).then(resp => {
        var stock_out = resp.data
        if (stock_out && stock_out._id) {
          this.import_log.push({
            status: 'success',
            message: ('Saída ' + stock_out._id + ': cadastrada com sucesso'),
          })
        } else {
          this.import_log.push({
            status: 'success',
            message: ('Erro: ' + stock_out),
          })
          this.error = stock_out
        }
        this.isSending = false
      }).catch(this.showError)
    }
  },

  components: {
    'breadcrumb': Breadcrumb,
    'loading': Loading,
    'form-submit': FormSubmit,
  }

};
</script>
