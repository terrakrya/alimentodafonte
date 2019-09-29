<template>
<div class="potential-list">
  <breadcrumb active="Potencial de coleta" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <list-headline name="Listas de potencial" addUrl="/cadastrar-lista-de-potencial" :filters="filters" />
      <div class="info-content">
        <div class="filters gray" v-if="filtered_potential_lists">
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
        <loading :loading="!filtered_potential_lists && !error" msg="Carregando lista de potencial" />
        <no-item :list="filtered_potential_lists" />
        <div v-if="filtered_potential_lists && filtered_potential_lists.length">
          <b-table stacked="md" :fields="table_fields" :items="filtered_potential_lists" :sort-by="'name'" :filter="filters.search">
            <template slot="code" slot-scope="data">
              <router-link v-if="data.item.code" :to="'/lista-de-potencial/'+ data.item._id">
                Lista {{data.item.code}}
                <br>
                {{data.item.createdAt | moment("DD/MM/YYYY")}}
              </router-link>
            </template>
            <template slot="collector" slot-scope="data">
              <a @click="setFilter(data.field.key, data.item.collector._id)" v-if="data.item.collector">
                {{data.item.collector.name}}
              </a>
            </template>
            <template slot="collectors_group" slot-scope="data">
              <a @click="setFilter(data.field.key, data.item.collectors_group._id)" v-if="data.item.collectors_group">
                {{data.item.collectors_group.name}}
              </a>
            </template>
            <template slot="qtd" slot-scope="data">
              {{calcQtd(data.item.seed_items)}} kg
            </template>
            <template slot="compensation_collect" slot-scope="data">
              {{calcCompensationCollect(data.item.seed_items) | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}}
            </template>

            <template slot="actions" slot-scope="data">
              <router-link :to="'/editar-lista-de-potencial/'+ data.item._id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
              <a @click="remove(data.item._id)" class="fa fa-trash btn btn-danger btn-xs"></a>
            </template>
            <!-- eslint-disable-next-line -->
            <template slot="bottom-row" slot-scope="data">
              <td />
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

  name: 'PotentialLists',

  data() {
    return {
      filters: {
        search: null,
        seed: null,
        collector: null,
        collectors_group: null,
        from: null,
        to: null
      },
      potential_lists: null,
      filtered_potential_lists: null,
      total_qtd: 0,
      total_compensation_collect: 0,
      table_fields: [{
          key: 'code',
          label: 'Lista',
          sortable: true
        },
        {
          key: 'collector',
          label: 'Coletor',
          sortable: true
        },
        {
          key: 'collectors_group',
          label: 'Grupo',
          sortable: true
        },
        {
          key: 'qtd',
          label: 'Quantidade',
          sortable: true
        },
        {
          key: 'compensation_collect',
          label: 'Remuneração',
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
      axios.get('potential_lists', {
        params: {
          populate: 'collectors_group collector'
        }
      }).then(response => {
        this.potential_lists = response.data
      }).catch(this.showError)
    },
    remove(id) {
      if (confirm("Tem certeza que deseja excluír?")) {
        axios.delete('potential_lists/' + id).then(() => {
          this.list()
        }).catch(this.showError)
      }
    },
    applyFilters() {
      this.filtered_potential_lists = this.potential_lists
      Object.keys(this.filters).map((filter) => {
        if (filter && this.filters[filter] && filter != 'search') {
          this.filtered_potential_lists = this.filtered_potential_lists.filter(item => {

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
      this.onFiltered(this.filtered_potential_lists)
    },
    onFiltered(filteredItems) {
      if (filteredItems) {
        this.total_qtd = 0
        this.total_compensation_collect = 0
        filteredItems.map(item => {
          this.total_qtd += this.calcQtd(item.seed_items)
          this.total_compensation_collect += this.calcCompensationCollect(item.seed_items)
        })
      }
    },
    listFromData(type) {
      if (this.potential_lists) {
        let items = this.potential_lists.map(item => {
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
    },
    calcQtd(seed_items) {
      seed_items = this.seedItemsBySeed(seed_items)
      if (seed_items && seed_items.length) {
        return seed_items.map(seed_item => this.sumQtd(seed_item.qtd)).reduce((a, b) => a + b)
      }
      return 0
    },
    calcCompensationCollect(seed_items) {
      seed_items = this.seedItemsBySeed(seed_items)
      if (seed_items && seed_items.length) {
        return seed_items.map(seed_item => seed_item.compensation_collect * this.sumQtd(seed_item.qtd)).reduce((a, b) => a + b)
      }
      return 0
    },
    seedItemsBySeed(seed_items) {
      if (this.filters['seed']) {
        return seed_items.filter(seed_item => (seed_item.seed == this.filters['seed']))
      }
      return seed_items
    }
  },
  watch: {
    potential_lists() {
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
