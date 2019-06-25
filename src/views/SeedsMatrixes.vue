<template>
<div class="seeds-matrixes">
  <breadcrumb active="Matrizes de sementes" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <list-headline name="Matrizes de sementes" addUrl="/cadastrar-matriz-de-sementes" :filters="filters" />
      <div class="info-content">
        <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        <loading :loading="!seeds_matrixes && !error" msg="Carregando lista de matrizes" />
        <no-item :list="seeds_matrixes" />
        <div v-if="seeds_matrixes && seeds_matrixes.length">
          <b-table stacked="md" :fields="table_fields" :items="seeds_matrixes" :sort-by="'name'" :filter="filters.search">
            <template slot="code" slot-scope="data">
              <router-link :to="'/matriz-de-sementes/'+ data.item._id">{{data.item.code}}</router-link>
            </template>
            <template slot="name" slot-scope="data">
              <router-link :to="'/matriz-de-sementes/'+ data.item._id">{{data.item.name}}</router-link>
              <p v-if="data.item.seed_matrix_scient_name">
                <small>{{data.item.seed_matrix_scient_name}}</small>
              </p>
            </template>
            <template slot="collectors_groups" slot-scope="data">
              <router-link v-if="data.item.collectors_group" :to="'/grupo-de-coletores/'+ data.item.collectors_group._id">
                {{data.item.collectors_group.name}}
              </router-link>
              <router-link v-if="data.item.collector" :to="'/coletor/'+ data.item.collector._id">
                {{data.item.collector.name}}
              </router-link>
            </template>
            <template slot="category" slot-scope="data">
              <p v-if="data.item.category">
                <small>{{origens_de_matrizes.find(v => (data.item.source == v.value)).text}} - {{categorias_de_matrizes.find(v => (data.item.category == v.value)).text}}</small>
              </p>
            </template>
            <template slot="actions" slot-scope="data">
              <router-link :to="'/editar-matriz-de-sementes/'+ data.item._id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
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
import categorias_de_matrizes from '@/data/categorias_de_matrizes.json'
import origens_de_matrizes from '@/data/origens_de_matrizes.json'

export default {

  name: 'CollectionAreas',
  data() {
    return {
      filters: {
        search: null
      },
      categorias_de_matrizes: categorias_de_matrizes,
      origens_de_matrizes: origens_de_matrizes,
      seeds_matrixes: null,
      table_fields: [{
          key: 'code',
          label: 'Código',
          sortable: true
        },
        {
            key: 'name',
            label: 'Nome da matriz',
            sortable: true
        },
        {
          key: 'collectors_groups',
          label: 'Grupo / Coletor',
          sortable: true
        },
        {
          key: 'category',
          label: 'Origem / Categoria',
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
  methods: {
    list() {
      axios.get('seeds_matrixes', {
        params: {
          populate: 'collectors_group collector'
        }
      }).then(response => {
        this.seeds_matrixes = response.data
      }).catch(this.showError)
    },
    remove(id) {
      if (confirm("Tem certeza que deseja excluír?")) {
        axios.delete('seeds_matrixes/' + id).then(() => {
          this.list();
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
