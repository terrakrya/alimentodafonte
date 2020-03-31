<template>
<div class="ecommerce">
  <div class="ecommerce-page sidebar-collapse">
    <nav class="navbar navbar-color-on-scroll navbar-transparent fixed-top navbar-expand-lg" color-on-scroll="100" id="sectionsNav">
      <div class="container">
        <div class="navbar-translate">
          <router-link :to="'/'" class="navbar-brand">
            Alimento da fonte
          </router-link>
          <ul class="navbar-nav ml-auto pull-right">
            <li class="dropdown nav-item">
              <router-link :to="'/meus_pedidos'" class="nav-link" style="color: #fff" v-if="client">
                Minha conta
              </router-link>
              <router-link :to="'/entrar'" class="nav-link" style="color: #fff" v-else>
                Entrar
              </router-link>
            </li>
          </ul>
          <router-link :to="'/carrinho'" class="btn btn-rose btn-round btn-block pull-right">
            <i class="material-icons">shopping_cart</i> {{cart.length > 0 ? cart.length+' items' : 'VAZIO'}}
          </router-link>
        </div>
        <div class="">
          <ul class="navbar-nav ml-auto">
            <li class="button-container nav-item iframe-extern">
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="page-header header-filter header-small" data-parallax="true">
      <div class="container">
        <div class="row align-middle">
          <div class="col-md-8 ml-auto mr-auto text-center">
            <div class="brand">
              <h1 class="title">
                Saúde perto de você
              </h1>
              <h4>Plataforma de <b>distribuição de alimentos</b> <br>e incentivo a iniciativas de ciclo curto.</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main main-raised">
      <!-- section -->
      <div class="section">
        <div class="container">
          <router-view></router-view>
          <br>
        </div>
      </div>
      <!-- section -->
    </div>
  </div>
  <br>
</div>
</template>

<script>
export default {
  name: 'Ecommerce',
  computed: {
    cart() {
      return this.$store.state.cart
    },
    client() {
      return this.$store.state.currentUser
    }
  }
}
</script>
<style lang="sass" scoped>
.nav-link
  color: #fff !important
</style>
