<template>
<div class="collections">
  <breadcrumb active="Coletas de sementes" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <list-headline name="Coletas de sementes" addUrl="/cadastrar-coleta" :filters="filters" />
      <div class="info-content">
        <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        <loading :loading="!collections && !error" msg="Carregando lista de coletas" />
        <no-item :list="collections" />
        <div v-if="collections && collections.length">
          <b-table stacked="md" :fields="table_fields" :items="collections" :sort-by="'title'" :filter="filters.search">
            <template slot="date_time" slot-scope="data">
              <router-link v-if="data.item.date_time" :to="'/coleta/'+ data.item._id">
                {{data.item.date_time | moment("DD/MM/YYYY H:mm")}}
              </router-link>
            </template>
            <template slot="group_collector" slot-scope="data">
              <router-link v-if="data.item.collectors_group" :to="'/grupo-de-coletores/'+ data.item.collectors_group._id">
                {{data.item.collectors_group.name}}
              </router-link>
              <router-link v-if="data.item.collector" :to="'/coletor/'+ data.item.collector._id">
                {{data.item.collector.name}}
              </router-link>
            </template>
            <template slot="seed" slot-scope="data">
              <router-link v-if="data.item.seed" :to="'/semente/'+ data.item.seed._id">
                {{data.item.seed.name}}
              </router-link>
            </template>
            <template slot="weight_gross" slot-scope="data">
              <span v-if="data.item.weight_gross">
                {{data.item.weight_gross}} kg
              </span>
            </template>
            <template slot="actions" slot-scope="data">
              <router-link :to="'/editar-coleta/'+ data.item._id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
              <a v-if="isManager" @click="remove(data.item._id)" class="fa fa-trash btn btn-danger btn-xs"></a>
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

  name: 'Collections',

  data() {
    return {
      filters: {
        search: null
      },
      collections: [],
      table_fields: [{
          key: 'date_time',
          label: 'Data/Hora',
          sortable: true
        },
        {
          key: 'seed',
          label: 'Semente',
          sortable: true
        },
        {
          key: 'weight_gross',
          label: 'Peso bruto',
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
    total_weight() {
      return this.potential_lists.map(potential_list => {
        return potential_list.weight
      }).reduce((a, b) => a + b)
    },
    total_compensation_collect() {
      return this.potential_lists.map(potential_list => {
        return potential_list.compensation_collect
      }).reduce((a, b) => a + b)
    }
  },
  methods: {
    list() {
      axios.get('collections', {
        params: {
          populate: 'collectors_group collector seed'
        }
      }).then(response => {
        this.collections = response.data
      }).catch(this.showError)
    },
    remove(id) {
      if (confirm("Tem certeza que deseja excluír?")) {
        axios.delete('collections/' + id).then(() => {
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
