<template>
<div class="seeds-houses">
  <breadcrumb active="Casas de semente" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <list-headline name="Casas de semente" addUrl="/cadastrar-casa-de-sementes" :filters="filters" />
      <div class="info-content">
        <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        <loading :loading="!seeds_houses && !error" msg="Carregando lista de casas" />
        <no-item :list="seeds_houses" />
        <div v-if="seeds_houses && seeds_houses.length">
          <b-table stacked="md" :fields="table_fields" :items="seeds_houses" :sort-by="'name'" :filter="filters.search">
            <template slot="name" slot-scope="data">
              <router-link :to="'/casa-de-sementes/'+ data.item._id">{{data.item.name}}</router-link>
            </template>
						<template slot="address" slot-scope="data">
              <span>{{[data.value.city, data.value.uf].filter(v => v).join(' - ')}}</span>
            </template>
            <template slot="actions" slot-scope="data">
              <router-link :to="'/editar-casa-de-sementes/'+ data.item._id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
              <a @click="remove(data.item._id)" class="fa fa-trash btn btn-danger btn-xs"></a>
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

  name: 'SeedsHouses',

  data() {
    return {

      filters: {
        search: null
      },
      table_fields: [{
          key: 'name',
          label: 'Nome da casa',
          sortable: true
        },
        {
          key: 'address',
          label: 'Localidade',
          sortable: true
        },
        {
          key: 'actions',
          label: 'Ações',
          'class': 'actions'
        },
      ],
      seeds_houses: null
    }
  },

  created() {
    this.list()
  },

  methods: {
    list() {
      axios.get('seeds_houses').then(response => {
        this.seeds_houses = response.data
      }).catch(this.showError)
    },
    remove(id) {
      if (confirm("Tem certeza que deseja excluír?")) {
        axios.delete('seeds_houses/' + id).then(() => {
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
