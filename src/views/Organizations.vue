<template>
<div>
  <router-link class="btn btn-success btn-round btn-add" to="/cadastrar-organizacao"><i class="material-icons">add</i>Cadastrar</router-link>
  <div class="card">
    <div class="card-header card-header-icon card-header-rose">
      <div class="card-icon">
        <i class="material-icons">device_hub</i>
      </div>
      <h4 class="card-title ">Organizações</h4>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        <loading :loading="!collectors_groups && !error" msg="Carregando lista de grupos" />
        <no-item :list="collectors_groups" />
        <div v-if="collectors_groups && collectors_groups.length">
          <b-table stacked="md" :fields="table_fields" :items="collectors_groups" :sort-by="'name'" :filter="filters.search">
            <template slot="name" slot-scope="data">
              <router-link :to="'/organizacao/'+ data.item._id">
                <strong>{{data.item.name}}</strong>
                <small v-if="data.item.collectors">
                  <br>
                  {{data.item.collectors.length}} {{data.item.collectors.length | pluralize('coletor', 'coletores')}}
                </small>
              </router-link>
            </template>
            <template slot="address" slot-scope="data">
              <span>{{data.value | city}}</span>
            </template>
            <template slot="actions" slot-scope="data">
              <router-link :to="'/editar-organizacao/'+ data.item._id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
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

  name: 'CollectorsGroups',

  data() {
    return {

      filters: {
        search: null
      },
      table_fields: [{
          key: 'name',
          label: 'Grupo',
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
      collectors_groups: null
    }
  },

  created() {
    this.list()
  },

  methods: {
    async list() {
      this.collectors_groups = await this.loadList('collectors_groups')
    },
    remove(id) {
      if (confirm("Tem certeza que deseja excluír?")) {
        axios.delete('collectors_groups/' + id).then(() => {
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
