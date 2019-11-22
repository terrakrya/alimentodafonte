<template>
<div>
  <router-link class="btn btn-success btn-round btn-add" to="/cadastrar-produto"><i class="material-icons">add</i>Cadastrar</router-link>
  <div class="card">
    <div class="card-header card-header-icon card-header-rose">
      <div class="card-icon">
        <i class="material-icons">shopping_cart</i>
      </div>
      <h4 class="card-title ">Produtos</h4>
    </div>
    <div class="card-body">
      <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
      <loading :loading="!products && !error" msg="Carregando lista de produtos" />
      <no-item :list="products" />
      <div class="table-responsive">
        <div v-if="products && products.length">
          <b-table stacked="md" :fields="table_fields" :items="products" :sort-by="'name'" :filter="filters.search">
            <template slot="name" slot-scope="data">
              <router-link :to="'/editar-produto/'+ data.item._id">
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
              <router-link :to="'/editar-produto/'+ data.item._id" class="btn btn-link btn-success">
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

export default {

  name: 'Products',

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
      products: null
    }
  },

  created() {
    this.list()
  },

  methods: {
    async list() {
      axios.get('products').then(response => {
        this.products = response.data
      }).catch(this.showError)

    },
    remove(id) {
      if (confirm("Tem certeza que deseja excluír?")) {
        axios.delete('products/' + id).then(() => {
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
