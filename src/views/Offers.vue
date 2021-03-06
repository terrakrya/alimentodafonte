<template>
<div>
  <router-link class="btn btn-success btn-round btn-add" to="/cadastrar-oferta"><i class="material-icons">add</i>Cadastrar oferta</router-link>
  <div class="card">
    <div class="card-header card-header-icon card-header-rose">
      <div class="card-icon">
        <i class="material-icons">local_offer</i>
      </div>
      <h4 class="card-title ">Ofertas ativas</h4>
    </div>
    <div class="card-body">
      <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
      <loading :loading="!active_offers && !error" msg="Carregando lista de ofertas" />
      <no-item :list="active_offers" />
      <div class="table-responsive">
        <div v-if="active_offers && active_offers.length">
          <b-table stacked="md" :fields="table_fields" :items="active_offers" :sort-by="'name'" :filter="filters.search">
            <template slot="product" slot-scope="data">
              <router-link :to="'/editar-oferta/'+ data.item._id" class="product_td">
                <div v-if="data.item.offer_type == 'single_product'">
                  <product-image :product="data.value"/>
                  <strong>{{data.value.name}}</strong>
                </div>
                <div v-if="data.item.offer_type == 'product_basket'">
                  <product-image :product="data.item"/>
                  <strong>{{data.item.name}}</strong>
                </div>
              </router-link>
            </template>
            <template slot="shipping_types" slot-scope="data">
              <a v-for="(tag, index) in data.value" :key="index"> <span class="badge badge-default"> {{tipos_de_entrega.find(type => type.value == tag ).text}} </span> &nbsp;</a>
            </template>
            <template slot="final_price" slot-scope="data">
              {{data.value | moeda}}
            </template>
            <template slot="qtd" slot-scope="data">
              {{data.value - data.item.qtd_ordered}} unidades
            </template>
            <template slot="actions" slot-scope="data">
              <div class="btn-group btn-group-sm">
                <router-link :to="'/editar-oferta/'+ data.item._id" class="btn btn-info">
                  <i class="material-icons">edit</i>
                </router-link>
                <a @click="changeStatus(data.item._id, false)" class="btn btn-danger">
                  Desativar
                </a>
              </div>
            </template>
          </b-table>
        </div>
      </div>
    </div>
  </div>
  <div class="card" v-if="inactive_offers && inactive_offers.length">
    <div class="card-header card-header-icon card-header-rose">
      <div class="card-icon">
        <i class="material-icons">local_offer</i>
      </div>
      <h4 class="card-title ">Ofertas desativadas</h4>
    </div>
    <div class="card-body">
      <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
      <loading :loading="!inactive_offers && !error" msg="Carregando lista de ofertas" />
      <no-item :list="inactive_offers" />
      <div class="table-responsive">
        <div v-if="inactive_offers && inactive_offers.length">
          <b-table stacked="md" :fields="table_fields" :items="inactive_offers" :sort-by="'name'" :filter="filters.search">
            <template slot="product" slot-scope="data">
              <router-link :to="'/editar-oferta/'+ data.item._id" class="product_td">
                <div v-if="data.item.offer_type == 'single_product'">
                  <product-image :product="data.value"/>
                  <strong>{{data.value.name}}</strong>
                </div>
                <div v-if="data.item.offer_type == 'product_basket'">
                  <product-image :product="data.item"/>
                  <strong>{{data.item.name}}</strong>
                </div>
              </router-link>

            </template>
            <template slot="shipping_types" slot-scope="data">
              <a v-for="(tag, index) in data.value" :key="index"> <span class="badge badge-default"> {{tipos_de_entrega.find(type => type.value == tag ).text}} </span> &nbsp;</a>
            </template>
            <template slot="final_price" slot-scope="data">
              {{data.value | moeda}}
            </template>
            <template slot="qtd" slot-scope="data">
              {{data.value - data.item.qtd_ordered}} unidades
            </template>
            <template slot="actions" slot-scope="data">
              <div class="btn-group btn-group-sm">
                <router-link :to="'/editar-oferta/'+ data.item._id" class="btn btn-info">
                  <i class="material-icons">edit</i>
                </router-link>
                <a @click="changeStatus(data.item._id, true)" class="btn btn-success">
                  Ativar
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
import tipos_de_oferta from '@/data/tipos-de-oferta.json'
import tipos_de_entrega from '@/data/tipos-de-entrega.json'

export default {

  name: 'Offers',

  data() {
    return {
      tipos_de_oferta: tipos_de_oferta,
      tipos_de_entrega: tipos_de_entrega,
      filters: {
        search: null
      },
      table_fields: [{
          key: 'product',
          label: 'Oferta',
          sortable: true
        },
        {
          key: 'final_price',
          label: 'Preço final',
          sortable: true
        },
        {
          key: 'qtd',
          label: 'Disponível',
          sortable: true
        },
        {
          key: 'shipping_types',
          label: 'Tipos de entrega',
          sortable: true
        },
        {
          key: 'actions',
          label: '',
          'class': 'td-actions text-right'
        }
      ],
      active_offers: null,
      inactive_offers: null
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
          populate: 'product producer organization'
        }
      }).then(response => {
        this.active_offers = response.data.filter(offer => offer.published)
        this.inactive_offers = response.data.filter(offer => !offer.published)
      }).catch(this.showError)

    },
    changeStatus(id, status) {
      if (confirm("Tem certeza que deseja " + (status ? "ativar" : "desativar") + "?")) {
        axios.put('offers/' + id, {
          published: status
        }).then(() => {
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
