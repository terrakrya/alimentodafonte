<template>
<div class="potential-list">
  <breadcrumb active="Potencial de coleta" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <list-headline name="Listas de potencial" addUrl="/cadastrar-lista-de-potencial" :filters="filters" />
      <div class="info-content">
        <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        <loading :loading="!potential_lists && !error" msg="Carregando lista de potencial" />
        <no-item :list="potential_lists" />
        <div v-if="potential_lists && potential_lists.length">
          <b-table stacked="md" :fields="table_fields" :items="potential_lists" :sort-by="'name'" :filter="filters.search">
            <template slot="code" slot-scope="data">
              <router-link v-if="data.item.code" :to="'/lista-de-potencial/'+ data.item._id">
                Lista {{data.item.code}}
              </router-link>
            </template>
            <template slot="collector" slot-scope="data">
              <router-link v-if="data.item.collector" :to="'/coletor/'+ data.item.collector._id">{{data.item.collector.name}}</router-link>
            </template>
            <template slot="collectors_group" slot-scope="data">
              <router-link v-if="data.item.collectors_group" :to="'/grupo-de-coletores/'+ data.item.collectors_group._id">{{data.item.collectors_group.name}}</router-link>
            </template>
            <template slot="qtd" slot-scope="data">
              {{data.item.seed_items.map(seed_item => seed_item.qtd).reduce((a, b) => a + b).toFixed(2)}} kg
            </template>
            <template slot="compensation_collect" slot-scope="data">
              {{data.item.seed_items.map(seed_item => seed_item.qtd * seed_item.compensation_collect).reduce((a, b) => a + b) | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}
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
              <td><strong>{{total_compensation_collect | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}</strong></td>
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

export default {

  name: 'PotentialLists',

  data() {
    return {
      filters: {
        search: null
      },
      potential_lists: null,
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
    total_qtd() {
      return this.potential_lists.map(potential_list => {
        return potential_list.seed_items.map(seed_item => seed_item.qtd).reduce((a, b) => a + b)
      }).reduce((a, b) => a + b)
    },
    total_compensation_collect() {
      return this.potential_lists.map(potential_list => {
        return potential_list.seed_items.map(seed_item => seed_item.qtd * seed_item.compensation_collect).reduce((a, b) => a + b)
      }).reduce((a, b) => a + b)
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
    }
  },
  components: {
    Loading,
    NoItem,
    ListHeadline,
    Breadcrumb
  }

};
</script>
