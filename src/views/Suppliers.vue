<template>
<div>
  <router-link class="btn btn-success btn-round btn-add" to="/cadastrar-fornecedor"><i class="material-icons">add</i>Cadastrar</router-link>
  <div class="card">
    <div class="card-header card-header-icon card-header-rose">
      <div class="card-icon">
        <i class="material-icons">device_hub</i>
      </div>
      <h4 class="card-title ">Fornecedores</h4>
    </div>
    <div class="card-body">
      <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
      <loading :loading="!suppliers && !error" msg="Carregando lista de fornecedores" />
      <no-item :list="suppliers" />
      <div class="table-responsive">
        <div v-if="suppliers && suppliers.length">
          <b-table stacked="md" :fields="table_fields" :items="suppliers" :sort-by="'name'" :filter="filters.search">
            <template slot="name" slot-scope="data">
              <router-link :to="'/editar-fornecedor/'+ data.item._id">
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
              <router-link :to="'/editar-fornecedor/'+ data.item._id" class="btn btn-link btn-success">
                <i class="material-icons">edit</i>
              </router-link>
              <a @click="remove(data.item._id)" class="btn btn-link btn-danger">
                <i class="material-icons">close</i>
              </a>
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

  name: 'Suppliers',

  data() {
    return {

      filters: {
        search: null
      },
      table_fields: [{
          key: 'name',
          label: 'Organização',
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
      suppliers: null
    }
  },

  created() {
    this.list()
  },

  methods: {
    async list() {
      axios.get('suppliers').then(response => {
        this.suppliers = response.data
      }).catch(this.showError)

    },
    remove(id) {
      if (confirm("Tem certeza que deseja excluír?")) {
        axios.delete('suppliers/' + id).then(() => {
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
