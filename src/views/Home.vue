<template>
  <div class="">
    <nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top text-white">
      <div class="container">
        <div class="navbar-wrapper">
          <a class="navbar-brand" href="#pablo">Alimento da fonte <strong>Saúde perto de você</strong></a>
        </div>
        <button class="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Mudar navegação">
          <span class="sr-only">Mudar navegação</span>
          <span class="navbar-toggler-icon icon-bar"></span>
          <span class="navbar-toggler-icon icon-bar"></span>
          <span class="navbar-toggler-icon icon-bar"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end">
          <ul class="navbar-nav">
            <li class="nav-item  active ">
              <a href="../pages/login.html" class="nav-link">
                <i class="material-icons">fingerprint</i> Entrar
              </a>
            </li>
            <li class="nav-item">
              <a href="../dashboard.html" class="nav-link">
                <i class="material-icons">help_outline</i> Suporte
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <!-- End Navbar -->
    <div class="wrapper wrapper-full-page">
      <div class="page-header login-page header-filter" filter-color="black" style="background-image: url('../../assets/img/login.jpg'); background-size: cover; background-position: top center;">
        <!--   you can change the color of the filter page using: data-color="blue | purple | green | orange | red | rose " -->
        <div class="container">
          <div class="row">
            <div class="col-md-4 offset-md-2">
              <div class="card card-profile text-center card-hidden">
                <div class="card-body ">
                  <h4 class="card-title">Monte sua cesta</h4>

                  <div class="form-group">
                    <label class="bmd-label-floating">Encontre os produtos ou cestas dos produtores mais próximos de você</label>
                  </div>
                </div>
                <div class="card-footer justify-content-center">
                  <router-link to="/loja" class="btn btn-rose btn-round btn-large">Quero comprar</router-link>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card card-profile text-center card-hidden">
                <div class="card-body ">
                  <h4 class="card-title">Painel de vendas</h4>
                  <div class="form-group">
                    <label class="bmd-label-floating">Publique suas ofertas de produtos ou cestas e encontre seus clientes. </label>
                  </div>
                </div>
                <div class="card-footer justify-content-center">
                  <router-link to="/produtor" class="btn btn-rose btn-round btn-large">Sou um produtor</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer class="footer">
          <div class="container">
            <nav class="float-left">
              <ul>
                <li>
                  <a href="https://creative-tim.com/presentation">
                    Sobre a Plataforma
                  </a>
                </li>
                <li>
                  <a href="https://www.creative-tim.com/license">
                    Regras
                  </a>
                </li>
              </ul>
            </nav>
            <div class="copyright float-right">
              {{year}} &copy; feito com amor <i class="material-icons">favorite</i> por
              <strong>Terra Krya</strong>.
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'home',
  created() {
    // this.$router.replace('/loja')
  }

}
</script>
<style lang="sass">
  .btn
    color: #fff !important
</style>
