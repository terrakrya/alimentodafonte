<template>
<div class="collectors-requests">
  <breadcrumb active="Pedidos para coletores" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <list-headline name="Pedidos para coletores" addUrl="/cadastrar-pedido-para-coletores" :filters="filters" />
      <div class="info-content">
        <div class="filters gray" v-if="filtered_collectors_requests">
          <b-form-group label="Filtrar por:">
            <div class="row">
              <div class="col-sm-4">
                <filter-entity-select type="seeds" :form="filters" field="seed" :input="applyFilters" placeholder="Semente" item-text="title" item-value="id" />
              </div>
              <div class="col-sm-4">
                <filter-entity-select type="collectors_groups" :form="filters" field="collectors_group" :input="applyFilters" placeholder="Grupo de coletores" item-text="title" item-value="id" />
              </div>
              <div class="col-sm-4">
                <filter-entity-select type="collectors" :form="filters" field="collector" :input="applyFilters" placeholder="Coletor" item-text="title" item-value="id" />
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6 from_to">
                De
                <b-form-input v-model="filters.from" type="date" @input="applyFilters" />
                Até
                <b-form-input v-model="filters.to" type="date" @input="applyFilters" />
              </div>
              <div class="col-sm-6">
                <a @click="clearFilters" class="btn btn-default" v-if="showClearButton">
                  Limpar filtros
                </a>
              </div>
            </div>
          </b-form-group>
        </div>
        <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        <loading :loading="!filtered_collectors_requests && !error" msg="Carregando lista de pedidos" />
        <no-item :list="filtered_collectors_requests" />
        <div v-if="filtered_collectors_requests && filtered_collectors_requests.length">
          <b-table stacked="md" :fields="table_fields" :items="filtered_collectors_requests" :sort-by="'created'" :sort-desc="true" :filter="filters.search">
            <template slot="createdAt" slot-scope="data">
              <router-link v-if="data.item.createdAt" :to="'/pedido-para-coletores/'+ data.item._id">
                Pedido {{data.item.code}}
                <br>
                {{data.item.createdAt | moment("DD/MM/YYYY")}}
              </router-link>
            </template>
            <template slot="collector" slot-scope="data">
              <a @click="setFilter(data.field.key, data.item.collector._id)" v-if="data.item.collector">
                {{data.item.collector.name}}
              </a>
              <a @click="setFilter('collectors_group', data.item.collectors_group._id)" v-if="data.item.collectors_group">
                {{data.item.collectors_group.name}}
              </a>

            </template>
            <template slot="qtd" slot-scope="data">
              {{data.item.seed_items.map(seed_item => seed_item.qtd).reduce((a, b) => a + b).toFixed(2)}} kg
            </template>
            <template slot="compensation_collect" slot-scope="data">
              {{data.item.seed_items.map(seed_item => seed_item.compensation_collect * seed_item.qtd).reduce((a, b) => a + b) | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}}
            </template>
            <template slot="actions" slot-scope="data">
              <router-link :to="'/editar-pedido-para-coletores/'+ data.item._id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
              <a @click="remove(data.item._id)" class="fa fa-trash btn btn-danger btn-xs"></a>
            </template>
            <!-- eslint-disable-next-line -->
            <template slot="bottom-row" slot-scope="data">
              <td />
              <td><strong> Total</strong></td>
              <td><strong>{{total_qtd.toFixed(2)}} Kg</strong></td>
              <td><strong>{{total_compensation_collect | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}}</strong></td>
              <td />
            </template>
          </b-table>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'
import ListHeadline from '@/components/ListHeadline'
import Breadcrumb from '@/components/Breadcrumb'
import FilterEntitySelect from '@/components/FilterEntitySelect'

export default {

  name: 'CollectorsRequests',
  data() {
    return {
      filters: {
        search: null
      },
      collectors_requests: null,
      filtered_collectors_requests: null,
      total_qtd: 0,
      total_compensation_collect: 0,
      table_fields: [{
          key: 'createdAt',
          label: 'ID / Data',
          sortable: true
        },
        {
          key: 'collector',
          label: 'Grupo / Coletor',
          sortable: true
        },
        {
          key: 'qtd',
          label: 'Quantidade',
          sortable: true
        },
        {
          key: 'compensation_collect',
          label: 'Remuneração total',
          sortable: true
        },
        {
          key: 'actions',
          label: 'Ações',
          'class': 'actions'
        },
      ]
    }
  },
  created() {
    this.list()
  },
  computed: {
    showClearButton() {
      return Object.keys(this.filters).find(k => (this.filters[k]))
    }
  },
  methods: {
    list() {
      axios.get('collectors_requests', {
        params: {
          populate: 'collectors_group collector'
        }
      }).then(response => {
        this.collectors_requests = response.data
      }).catch(this.showError)
    },
    remove(id) {
      if (confirm("Tem certeza que deseja excluír?")) {
        axios.delete('collectors_requests/' + id).then(() => {
          this.list()
        }).catch(this.showError)
      }
    },
    applyFilters() {
      this.filtered_collectors_requests = this.collectors_requests
      Object.keys(this.filters).map((filter) => {
        if (filter && this.filters[filter] && filter != 'search') {
          this.filtered_collectors_requests = this.filtered_collectors_requests.filter(item => {

            if (filter == 'from') {
              return new Date(item.createdAt) >= new Date(this.filters[filter])
            }
            if (filter == 'to') {
              let date = new Date(this.filters[filter] + 'T23:59:59+00:00')
              return new Date(item.createdAt) <= date
            }
            if (filter == 'seed') {
              return item.seed_items.find(seed_item => {
                return seed_item.seed == this.filters[filter]
              })
            }
            return item[filter] && (item[filter]._id == this.filters[filter] || item[filter] == this.filters[filter])
          })
        }
      })
      this.onFiltered(this.filtered_collectors_requests)
    },
    onFiltered(filteredItems) {
      if (filteredItems) {
        this.total_qtd = 0
        this.total_compensation_collect = 0
        filteredItems.map(item => {
          item.seed_items.map(seed_item => {
            if (seed_item.compensation_collect) {
              this.total_compensation_collect += parseFloat(seed_item.compensation_collect) * parseFloat(seed_item.qtd)
            }
            if (seed_item.qtd) {
              this.total_qtd += parseFloat(seed_item.qtd)
            }
          })
        })
      }
    },
    listFromData(type) {
      if (this.collectors_requests) {
        let items = this.collectors_requests.map(item => {
          if (item[type]) {
            return {
              id: item[type]._id,
              title: item[type].name
            }
          }
        })
        return this.getUnique(items)
      }
    },
    setFilter(field, value) {
      this.filters[field] = value
      this.applyFilters()
    },
    clearFilters() {
      Object.keys(this.filters).map((filter) => {
        this.filters[filter] = null
      })
      this.applyFilters()
    }
  },
  watch: {
    collectors_requests() {
      this.applyFilters()
    }
  },
  components: {
    Loading,
    NoItem,
    ListHeadline,
    Breadcrumb,
    FilterEntitySelect
  }

};
</script>
