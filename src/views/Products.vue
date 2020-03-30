<template>
<div>
  <router-link class="btn btn-success btn-round btn-add" to="/cadastrar-produto"><i class="material-icons">add</i>Cadastrar produto</router-link>
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
                <product-image :product="data.item" css_class="thumbnail" />
                <h4>{{data.item.name}}</h4>
              </router-link>
            </template>
            <template slot="price" slot-scope="data">
              {{data.value | moeda}} <small>por {{data.item.unit}}</small>
            </template>
            <template slot="producer" slot-scope="data">
              <router-link :to="'/editar-produtor/'+ data.value._id">
                {{data.value.name}}
              </router-link>
            </template>
            <template slot="actions" slot-scope="data">
              <div class="btn-group btn-group-sm">
                <router-link :to="'/editar-produto/'+ data.item._id" class="btn btn-info">
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
import ProductImage from '@/components/ProductImage'

export default {

  name: 'Products',

  data() {
    return {

      filters: {
        search: null
      },
      table_fields: [{
        key: 'name',
        label: 'Produto',
        sortable: true
      }, {
        key: 'price',
        label: 'Preço',
        sortable: true
      }, ],
      products: null
    }
  },

  created() {
    this.list()
    if (this.isAdmin) {
      this.table_fields.push({
        key: 'producer',
        label: 'Produtor'
      })
    }
    this.table_fields.push({
      key: 'actions',
      label: '',
      'class': 'td-actions text-right'
    })
  },

  methods: {
    async list() {
      axios.get('products', {
        params: {
          populate: 'producer offers'
        }
      }).then(response => {
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
    NoItem,
    ProductImage
  }

};
</script>
