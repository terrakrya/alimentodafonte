<template>
<div class="collectors-request-form">
  <breadcrumb :links="[['Pedidos para coletores', '/pedidos-para-coletores']]" :active="isEditing() ? 'Pedido '+form.code : 'Cadastrar'" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <form-headline name="pedido para coletores" />
      <loading :loading="isLoading" />
      <b-form @submit.prevent="save" v-if="!isLoading && potential_lists && potential_lists && collectors_requests && collectors_requests">
        <div class="row">
          <form-group-collector :form="form" />
        </div>
        <div class="row">
          <div class="col-sm-12">
            <table class="table b-table b-table-stacked-md" v-if="potential_seeds && potential_seeds.length">
              <thead>
                <tr>
                  <th>Semente</th>
                  <th>Potencial</th>
                  <th>Já pedido</th>
                  <th>Pedir</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(potential_seed, index) in potential_seeds" :key="index">
                  <td>{{potential_seed.seed.name}}</td>
                  <td>{{potential_seed.potential}} kg</td>
                  <td>{{potential_seed.requested}} kg</td>
                  <td v-if="potential_seed.max > 0">
                    <div v-if="typeof potential_seeds[index].qtd == 'object'">
                      <div v-for="(qtd, i) in potential_seeds[index].qtd" :key="i">
                        <form-entity-select v-if="collectors && collectors.length" :items="collectors" :form="potential_seeds[index].qtd[i]" field="collector" placeholder="Coletor" />
                        <b-form-input @input="setSeedItems" v-model="potential_seeds[index].qtd[i].qtd" class="weight" type="number" step="0.01" lang="nb" min="0" :max="potential_seed.qtd - sumQtd(potential_seeds[index].qtd)"
                          style="width: 100px; display: inline" />
                        <span> kg.</span> <small :class="sumQtd(potential_seeds[index].qtd) > potential_seed.max ? 'text-danger': 'text-gray'"> Máximo: {{potential_seed.max}} kg</small>
                        <br>
                      </div>
                      <small v-if="typeof potential_seeds[index].qtd == 'object' && potential_seeds[index].qtd.length > 1" :class="sumQtd(potential_seeds[index].qtd) > potential_seed.max ? 'text-danger': 'text-success'">Total: {{sumQtd(potential_seeds[index].qtd)}} kg</small>
                      <br>
                      <a @click="addQtd(index)" v-if="!form.collector" class="btn btn-xs">Adicionar</a>
                      <br>
                    </div>
                    <div v-if="typeof potential_seeds[index].qtd != 'object'">
                      <b-form-input @input="setSeedItems" v-model="potential_seeds[index].qtd" class="weight" type="number" step="0.01" lang="nb" min="0" :max="potential_seed.qtd" style="width: 100px; display: inline" />
                      <span> kg.</span> <small :class="sumQtd(potential_seeds[index].qtd) > potential_seed.max ? 'text-danger': 'text-gray'"> Máximo: {{potential_seed.max}} kg</small>
                      <small v-if="typeof potential_seeds[index].qtd == 'object' && potential_seeds[index].qtd.length > 1" :class="sumQtd(potential_seeds[index].qtd) > potential_seed.max ? 'text-danger': 'text-success'">Total: {{sumQtd(potential_seeds[index].qtd)}} kg</small>
                      <br>
                      <a @click="splitQtd(index)" v-if="!form.collector && collectors && collectors.length" class="btn btn-xs">Dividir pedido</a>
                    </div>
                  </td>
                  <td v-if="potential_seed.max <= 0">
                    <small>Sem potencial</small>
                  </td>
                </tr>
                <tr class="b-table-bottom-row" v-if="form.seed_items && form.seed_items.length">
                  <td></td>
                  <td>
                    <strong>{{potential_seeds.map(i => parseFloat(i.potential)).reduce((a, b) => a + b).toFixed(2)}} kg</strong>
                  </td>
                  <td>
                    <strong>{{potential_seeds.map(i => parseFloat(i.requested)).reduce((a, b) => a + b).toFixed(2)}} kg</strong>
                  </td>
                  <td>
                    <strong>{{form.seed_items.map(i => parseFloat(sumQtd(i.qtd))).reduce((a, b) => a + b).toFixed(2)}} kg</strong>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <div v-for="(seeds_error, index) in seeds_errors" :key="index" class="alert alert-danger">
              {{seeds_error}}
            </div>
          </div>
        </div>
        <form-submit :errors="error" :sending="isSending" v-if="!seeds_errors.length && form.seed_items.length" />
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
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSubmit from '@/components/FormSubmit'

export default {
  name: 'CollectorsRequestForm',
  data() {
    return {
      seeds_errors: [],
      seeds: [],
      potential_lists: [],
      collectors_requests: [],
      potential_seeds: [],
      collectors: [],
      form: {
        code: null,
        collectors_group: null,
        collector: null,
        seed_items: [],
        createdBy: this.$store.state.currentUser._id
      }
    }
  },
  async created() {

    axios.get('potential_lists', {
      params: {
        populate: 'seed_items.seed'
      }
    }).then(response => {
      this.potential_lists = response.data

      axios.get('collectors_requests').then(resp => {
        this.collectors_requests = resp.data
        if (this.isEditing()) {
          this.edit(this.$route.params.id)
        }

      }).catch(this.showError)

    }).catch(this.showError)

    axios.get('seeds').then(response => {
      this.seeds = response.data
    }).catch(this.showError)

  },
  methods: {
    edit(id) {
      this.isLoading = true
      axios.get('collectors_requests/' + id).then(response => {
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
            url: 'collectors_requests' + (this.isEditing() ? '/' + this.$route.params.id : ''),
            data: this.form
          }).then(resp => {
            var collectors_request = resp.data
            if (collectors_request && collectors_request._id) {
              this.$router.replace('/pedido-para-coletores/' + collectors_request._id)
            }
            this.isSending = false
          }).catch(this.showError)
        }
      })
    },
    setSeedItems() {
      this.seeds_errors = []
      this.form.seed_items = []
      this.potential_seeds.forEach(potential_seed => {
        if (potential_seed.qtd && (potential_seed.qtd > 0 || typeof potential_seed.qtd == 'object')) {
          if (potential_seed.qtd > potential_seed.max) {
            this.seeds_errors.push('A quantidade solicitada (' + potential_seed.qtd + ' kg de ' + potential_seed.seed.name + ') é maior que o potencial de coleta (' + potential_seed.max + ' kg) desse coletor/grupo ')
          } else {
            this.form.seed_items.push({
              seed: potential_seed.seed._id,
              qtd: potential_seed.qtd,
              compensation_collect: potential_seed.compensation_collect,
              price: potential_seed.price,
              wholesale_price: potential_seed.wholesale_price,
            })
          }
        }
      })
    },
    loadPotential() {
      this.seeds_errors = []
      this.potential_seeds = []
      var seed_items = {}


      if ((this.form.collectors_group || this.form.collector)) {

        let potential_lists_filtered = this.filterGroupCollector(this.potential_lists)
        let collectors_request_filtered = this.filterGroupCollector(this.collectors_requests)
        if (potential_lists_filtered && potential_lists_filtered.length) {
          potential_lists_filtered.forEach(potential_list => {
            potential_list.seed_items.forEach(seed_item => {
              if (seed_items[seed_item.seed._id]) {
                seed_items[seed_item.seed._id].potential += seed_item.qtd
              } else {
                seed_items[seed_item.seed._id] = {
                  seed: seed_item.seed,
                  potential: seed_item.qtd,
                  compensation_collect: seed_item.compensation_collect,
                  price: seed_item.price,
                  wholesale_price: seed_item.wholesale_price,
                  requested: 0,
                  max: seed_item.qtd
                }

                if (this.form.seed_items && this.form.seed_items.length) {
                  var item = this.form.seed_items.find(i => i.seed == seed_item.seed._id)
                  if (item) {
                    seed_items[seed_item.seed._id].qtd = item.qtd
                  }
                }
              }
            })
          })

          if (collectors_request_filtered) {
            collectors_request_filtered.forEach(collectors_request => {
              if (!this.$route.params.id || this.$route.params.id != collectors_request._id) {
                collectors_request.seed_items.forEach(seed_item => {
                  if (seed_items[seed_item.seed]) {
                    seed_items[seed_item.seed].requested += this.sumQtd(seed_item.qtd)
                    seed_items[seed_item.seed].max = seed_items[seed_item.seed].potential - seed_items[seed_item.seed].requested
                  }
                })
              }
            })
          }

          this.potential_seeds = Object.values(seed_items).map(seed_item => {
            if (!seed_item.qtd) {
              seed_item.qtd = 0
            }
            return seed_item
          })
        } else {
          this.seeds_errors.push('Não existe potencial de coleta para este coletor/grupo')
          return false
        }

        if (this.form.collectors_group) {
          axios.get('collectors_groups/' + this.form.collectors_group, {
            params: {
              populate: 'collectors'
            }
          }).then(response => {
            this.collectors = response.data.collectors.map(collector => {
              return {
                id: collector._id,
                title: collector.name,
                description: collector.nickname,
              }
            })
          }).catch(this.showError)
        }
      }
    },
    filterGroupCollector(list) {
      if (list) {
        return list.filter(item => {
          let collector = this.form.collector
          let group = this.form.collectors_group
          return (
            (collector && item.collector && item.collector == collector) ||
            (group && item.collectors_group && item.collectors_group == group)
          )
        })
      }
    },
    splitQtd(index) {
      this.potential_seeds[index].qtd = [{
        collector: null,
        qtd: 0
      }]
    },
    addQtd(index) {
      this.potential_seeds[index].qtd.push({
        collector: null,
        qtd: 0
      })
    }
  },
  watch: {
    'form.collectors_group': function() {
      this.loadPotential()
    },
    'form.collector': function() {
      this.loadPotential()
    }
  },
  components: {
    Breadcrumb,
    Loading,
    FormHeadline,
    FormGroupCollector,
    FormSubmit,
    FormEntitySelect
  }

};
</script>
