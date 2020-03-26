<template>
<div class="dashboard">
  <div class="row">
    <div class="col-lg-4 col-md-6 col-sm-6">
      <div class="card card-stats">
        <div class="card-header card-header-success card-header-icon">
          <router-link to="/pedidos">
            <div class="card-icon">
              <i class="material-icons">list_alt</i>
            </div>
            <p class="card-category">
              Pedidos
            </p>
            <h3 class="card-title">{{orders.length}}</h3>
          </router-link>
        </div>
        <div class="card-footer">
          <div class="stats">
            <router-link class="btn btn-success btn-icon" to="/pedidos">
              Visualizar pedidos
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-6">
      <div class="card card-stats">
        <div class="card-header card-header-success card-header-icon">
          <router-link to="/ofertas">
            <div class="card-icon">
              <i class="material-icons">local_offer</i>
            </div>
            <p class="card-category">
              Ofertas
            </p>
            <h3 class="card-title">{{offers.length}}</h3>
          </router-link>
        </div>
        <div class="card-footer">
          <div class="stats">
            <router-link class="btn btn-success btn-icon" to="/cadastrar-oferta">
              Cadastrar oferta
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-6">
      <div class="card card-stats">
        <div class="card-header card-header-info card-header-icon">
          <router-link to="/produtos">
            <div class="card-icon">
              <i class="material-icons">shopping_cart</i>
            </div>
            <p class="card-category">
              Produtos
            </p>
            <h3 class="card-title">{{products.length}}</h3>
          </router-link>
        </div>
        <div class="card-footer">
          <div class="stats">
            <router-link class="btn btn-success btn-icon" to="/cadastrar-produto">
              Cadastrar produto
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-6">
      <div class="card card-stats">
        <div class="card-header card-header-rose card-header-icon">
          <router-link to="/produtores">
            <div class="card-icon">
              <i class="material-icons">people</i>
            </div>
            <p class="card-category">
              Produtores
            </p>
            <h3 class="card-title">{{producers.length}}</h3>
          </router-link>
        </div>
        <div class="card-footer">
          <div class="stats">
            <router-link class="btn btn-success btn-icon" to="/cadastrar-produtor">
              Cadastrar produtor
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-6" v-if="isLink">
      <div class="card card-stats">
        <div class="card-header card-header-warning card-header-icon">
          <router-link to="/organizacoes">
            <div class="card-icon">
              <i class="material-icons">device_hub</i>
            </div>
            <p class="card-category">
              Redes
            </p>
            <h3 class="card-title">{{organizations.length}}</h3>
          </router-link>
        </div>
        <div class="card-footer">
          <div class="stats">
            <router-link class="btn btn-success btn-icon" to="/cadastrar-organizacao">
              Cadastrar rede
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-header card-header-icon card-header-rose">
      <div class="card-icon">
        <i class="material-icons">local_offer</i>
      </div>
      <h4 class="card-title ">Últimas ofertas</h4>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <div v-if="offers && offers.length">
          <b-table stacked="md" :fields="table_fields" :items="offers" :sort-by="'name'">
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
            <template slot="qtd" slot-scope="data">
              {{data.value - data.item.qtd_ordered}} unidades
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
  <br>
  <h3>Últimos produtos cadastrados</h3>
  <br>
  <div class="row">
    <div class="col-md-3" v-for="(product, index) in products" :key="index">
      <div class="card card-product">
        <div class="card-header card-header-image" data-header-animation="true">
          <router-link :to="'/editar-produto/'+product._id">
            <product-image :product="product" />
          </router-link>
        </div>
        <div class="card-body">
          <div class="card-actions text-center">
            <router-link :to="'/editar-produto/'+product._id" type="router-link" class="btn btn-success btn-link" rel="tooltip" data-placement="bottom" title="Editar">
              <i class="material-icons">edit</i>
            </router-link>
          </div>
          <h4 class="card-title">
            <router-link :to="'/editar-produto/'+product._id">
              {{product.name}}
            </router-link>
          </h4>
          <div class="card-description">
            {{product.description}}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import ProductImage from '@/components/ProductImage';

export default {
  name: 'DashboardManager',

  data() {
    return {
      organizations: [],
      producers: [],
      products: [],
      offers: [],
      orders: [],
      date_unit: {
        'Dias': 'days',
        'Meses': 'months',
        'Anos': 'years'
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
          key: 'qtd',
          label: 'Disponível',
          sortable: true
        },
      ]
    }
  },
  created() {
    axios.get('organizations').then(response => {
      this.organizations = response.data
    }).catch(this.showError)

    axios.get('producers').then(response => {
      this.producers = response.data
    }).catch(this.showError)

    axios.get('products', {
      params: {
        populate: 'product_variations'
      }
    }).then(response => {
      this.products = response.data
    }).catch(this.showError)

    axios.get('offers', {
      params: {
        populate: 'product_variation'
      }
    }).then(response => {
      this.offers = response.data
    }).catch(this.showError)

    axios.get('orders', {
      params: {
        populate: 'items.offer'
      }
    }).then(response => {
      this.orders = response.data
    }).catch(this.showError)
  },
  components: {
    ProductImage
  }
}
</script>

<style lang="sass">
  .card-header
    a
      color: #fff
</style>
