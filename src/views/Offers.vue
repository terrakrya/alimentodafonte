<template>
<div>
  <router-link class="btn btn-success btn-round btn-add" to="/cadastrar-oferta"><i class="material-icons">add</i>Cadastrar oferta</router-link>
  <div class="card">
    <div class="card-header card-header-icon card-header-rose">
      <div class="card-icon">
        <i class="material-icons">local_offer</i>
      </div>
      <h4 class="card-title ">Ofertas</h4>
    </div>
    <div class="card-body">
      <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
      <loading :loading="!offers && !error" msg="Carregando lista de ofertas" />
      <no-item :list="offers" />
      <div class="table-responsive">
        <div v-if="offers && offers.length">
          <b-table stacked="md" :fields="table_fields" :items="offers" :sort-by="'name'" :filter="filters.search">
            <template slot="product_variation" slot-scope="data">
              <router-link :to="'/editar-oferta/'+ data.item._id" class="product_td">
                <product-image :product="data.value" :product_variation="data.value" css_class="thumbnail"/>
                <strong>{{data.value.name}}</strong>
              </router-link>
            </template>
            <template slot="manufacturing_date" slot-scope="data">
              <div v-if="data.item.product_variation && data.item.product_variation.duration && data.item.product_variation.duration.value && data.value">
                {{data.value | moment("DD/MM/YYYY")}}
                <br>
                <small>Vence {{data.value | moment("add", data.item.product_variation.duration.value + ' ' + date_unit[data.item.product_variation.duration.unit]) | moment('from', 'now')}}</small>
              </div>
            </template>
            <template slot="final_price" slot-scope="data">
              {{data.value | moeda}}
            </template>
            <template slot="actions" slot-scope="data">
              <div class="btn-group btn-group-sm">
                <router-link :to="'/editar-oferta/'+ data.item._id" class="btn btn-info">
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

  name: 'Offers',

  data() {
    return {
      date_unit: {
        'Dias': 'days',
        'Meses': 'months',
        'Anos': 'years'
      },
      filters: {
        search: null
      },
      table_fields: [{
          key: 'product_variation',
          label: 'Oferta',
          sortable: true
        },
        {
          key: 'source_of_shipment',
          label: 'Origem do envio',
          sortable: true
        },
        {
          key: 'manufacturing_date',
          label: 'Data de fabricação',
          sortable: true
        },
        {
          key: 'final_price',
          label: 'Preço final',
          sortable: true
        },
        {
          key: 'actions',
          label: '',
          'class': 'td-actions text-right'
        }
      ],
      offers: null
    }
  },

  created() {
    this.list()
    this.table_fields.push({
      key: 'actions',
      label: '',
      'class': 'td-actions text-right'
    })
  },

  methods: {
    async list() {
      axios.get('offers', {
        params: {
          populate: 'product_variation'
        }
      }).then(response => {
        this.offers = response.data
      }).catch(this.showError)

    },
    remove(id) {
      if (confirm("Tem certeza que deseja excluír?")) {
        axios.delete('offers/' + id).then(() => {
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
