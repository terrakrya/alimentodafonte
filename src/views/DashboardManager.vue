<template>
<div class="dashboard">
  <div class="row">
    <div class="col-lg-4 col-md-6 col-sm-6" v-if="isAdmin">
      <div class="card card-stats">
        <div class="card-header card-header-warning card-header-icon">
          <router-link to="/organizacoes">
            <div class="card-icon">
              <i class="material-icons">device_hub</i>
            </div>
            <p class="card-category">
              Organizações
            </p>
            <h3 class="card-title">{{organizations.length}}</h3>
          </router-link>
        </div>
        <div class="card-footer">
          <div class="stats">
            <router-link class="btn btn-success btn-icon" to="/cadastrar-organizacao">
              Cadastrar organização
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-6">
      <div class="card card-stats">
        <div class="card-header card-header-rose card-header-icon">
          <router-link to="/fornecedores">
            <div class="card-icon">
              <i class="material-icons">people</i>
            </div>
            <p class="card-category">
              Fornecedores
            </p>
            <h3 class="card-title">{{suppliers.length}}</h3>
          </router-link>
        </div>
        <div class="card-footer">
          <div class="stats">
            <router-link class="btn btn-success btn-icon" to="/cadastrar-fornecedor">
              Cadastrar fornecedor
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-6">
      <div class="card card-stats">
        <div class="card-header card-header-success card-header-icon">
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
  </div>
  <h3>Últimos produtos cadastrados</h3>
  <br>
  <div class="row">
    <div class="col-md-3" v-for="(product, index) in products">
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
      suppliers: [],
      products: []
    }
  },
  created() {
    axios.get('organizations').then(response => {
      this.organizations = response.data
    }).catch(this.showError)
    axios.get('suppliers').then(response => {
      this.suppliers = response.data
    }).catch(this.showError)
    axios.get('products', {
      params: {
        populate: 'product_variations'
      }
    }).then(response => {
      this.products = response.data
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
