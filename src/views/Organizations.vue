<template>
<div>
  <router-link class="btn btn-success btn-round btn-add" to="/cadastrar-organizacao"><i class="material-icons">add</i>Cadastrar organização</router-link>
  <div class="card">
    <div class="card-header card-header-icon card-header-rose">
      <div class="card-icon">
        <i class="material-icons">device_hub</i>
      </div>
      <h4 class="card-title ">Organizações</h4>
    </div>
    <div class="card-body">
      <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
      <loading :loading="!organizations && !error" msg="Carregando lista de organizações" />
      <no-item :list="organizations" />
      <div class="table-responsive">
        <div v-if="organizations && organizations.length">
          <b-table stacked="md" :fields="table_fields" :items="organizations" :sort-by="'name'" :filter="filters.search">
            <template slot="name" slot-scope="data">
              <router-link :to="'/editar-organizacao/'+ data.item._id">
                <img :src="defaultThumb(data.item.images)" class="thumb">
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
            <template slot="organization_types" slot-scope="data">
              <span class="badge badge-primary" v-for="(type, index) in data.value" :key="index">{{tipos_de_organizacao.find(t => t.value == type).text}}</span>
            </template>
            <template slot="actions" slot-scope="data">
              <div class="btn-group btn-group-sm">
                <router-link :to="'/editar-organizacao/'+ data.item._id" class="btn btn-info">
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
import tipos_de_organizacao from '@/data/tipos-de-organizacao.json'

export default {

  name: 'Organizations',

  data() {
    return {
      tipos_de_organizacao: tipos_de_organizacao,
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
          key: 'organization_types',
          label: 'Tipo de organização',
          sortable: true
        },
        {
          key: 'actions',
          label: 'Ações',
          'class': 'td-actions text-right'
        },
      ],
      organizations: null
    }
  },

  created() {
    this.list()
  },

  methods: {
    async list() {
      axios.get('organizations').then(response => {
        this.organizations = response.data
      }).catch(this.showError)

    },
    remove(id) {
      if (confirm("Tem certeza que deseja excluír?")) {
        axios.delete('organizations/' + id).then(() => {
          this.list()
        }).catch(this.showError)
      }
    }
  },

  components: {
    Loading,
    NoItem,
  }

};
</script>
