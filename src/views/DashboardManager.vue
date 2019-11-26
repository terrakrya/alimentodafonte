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
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'DashboardManager',

  data() {
    return {
      organizations: null,
      suppliers: null,
      products: null
    }
  },
  created() {
    axios.get('organizations').then(response => {
      this.organizations = response.data
    }).catch(this.showError)
    axios.get('suppliers').then(response => {
      this.suppliers = response.data
    }).catch(this.showError)
    axios.get('products').then(response => {
      this.products = response.data
    }).catch(this.showError)
    axios.get('users').then(response => {
      this.users = response.data
    }).catch(this.showError)
  }
}
</script>

<style lang="sass">
  .card-header
    a
      color: #fff
</style>
