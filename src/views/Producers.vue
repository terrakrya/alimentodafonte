<template>
<div>
  <router-link class="btn btn-success btn-round btn-add" to="/cadastrar-produtor"><i class="material-icons">add</i>Cadastrar produtor</router-link>
  <div class="card">
    <div class="card-header card-header-icon card-header-rose">
      <div class="card-icon">
        <i class="material-icons">people</i>
      </div>
      <h4 class="card-title ">Produtores</h4>
    </div>
    <div class="card-body">
      <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
      <loading :loading="!producers && !error" msg="Carregando lista de produtores" />
      <no-item :list="producers" />
      <div class="table-responsive">
        <div v-if="producers && producers.length">
          <b-table stacked="md" :fields="table_fields" :items="producers" :sort-by="'name'" :filter="filters.search">
            <template slot="name" slot-scope="data">
              <router-link :to="'/editar-produtor/'+ data.item._id">
                <img :src="defaultThumb(data.item.images)" class="thumb">
                <strong>{{data.item.name}}</strong>
              </router-link>
            </template>
            <template slot="address" slot-scope="data">
              <span>{{data.value | city}}</span>
            </template>
            <template slot="actions" slot-scope="data">
              <div class="btn-group btn-group-sm">
                <router-link :to="'/editar-produtor/'+ data.item._id" class="btn btn-info">
                  <i class="material-icons">edit</i>
                </router-link>
                <a @click="remove(data.item._id)" class="btn btn-danger">
                  <i class="material-icons">close</i>
                </a>
              </div>
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

export default {

  name: 'Producers',

  data() {
    return {

      filters: {
        search: null
      },
      table_fields: [{
          key: 'name',
          label: 'Rede',
          sortable: true
        },
        {
          key: 'address',
          label: 'Cidade',
          sortable: true
        },
        {
          key: 'actions',
          label: 'Ações',
          'class': 'td-actions text-right'
        },
      ],
      producers: null
    }
  },

  created() {
    this.list()
  },

  methods: {
    async list() {
      axios.get('producers').then(response => {
        this.producers = response.data
      }).catch(this.showError)

    },
    remove(id) {
      if (confirm("Tem certeza que deseja excluír?")) {
        axios.delete('producers/' + id).then(() => {
          this.list()
        }).catch(this.showError)
      }
    }
  },

  components: {
    Loading,
    NoItem
  }

};
</script>
