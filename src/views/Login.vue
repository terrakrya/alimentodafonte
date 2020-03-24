<template>
<div class="">
  <nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top text-white">
    <div class="container">
      <div class="navbar-wrapper">
        <a class="navbar-brand" href="#pablo">Plataforma <strong>SocioBio</strong></a>
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
          <div class="col-lg-4 col-md-6 col-sm-8 ml-auto mr-auto">
            <form class="form" method="" action="">
              <div class="card card-login" :class="showForm ? '' : 'card-hidden'">
                <div class="card-header card-header-rose text-center">
                  <h4 class="card-title">Entrar</h4>
                  <!-- <div class="social-line">
                    <a href="#pablo" class="btn btn-just-icon btn-link btn-white">
                      <i class="fa fa-facebook-square"></i>
                    </a>
                    <a href="#pablo" class="btn btn-just-icon btn-link btn-white">
                      <i class="fa fa-twitter"></i>
                    </a>
                    <a href="#pablo" class="btn btn-just-icon btn-link btn-white">
                      <i class="fa fa-google-plus"></i>
                    </a>
                  </div> -->
                </div>
                <form @submit.prevent="login" class="form-auth-small">
                  <div class="card-body ">
                    <p class="card-description text-center">Entre com suas credenciais</p>
                    <span class="bmd-form-group">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            <i class="material-icons">email</i>
                          </span>
                        </div>
                        <input v-model="email" type="text" class="form-control" placeholder="Nome de usuário ou e-mail...">
                      </div>
                    </span>
                    <span class="bmd-form-group">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            <i class="material-icons">lock_outline</i>
                          </span>
                        </div>
                        <input v-model="password" type="password" class="form-control" placeholder="Senha...">
                      </div>
                    </span>
                  </div>
                  <div class="card-footer justify-content-center">
                    <button type="submit" class="btn btn-rose btn-link btn-lg">Continuar</button>
                    <button v-if="isLoading" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Fazendo login...</button>
                    <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
                  </div>
                </form>
              </div>
            </form>
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
<!-- <div class="left">
  <div class="content">
    <div class="brand">
      <h1 class="logo"><a href="/"><span>Plataforma </span><strong>SocioBio</strong></a></h1>
    </div>
    <p v-if="$route.query.redirect">
      Você precisa entrar com seus dados para acessar.
    </p>
    <form @submit.prevent="login" class="form-auth-small">
      <div class="form-group">
        <label for="signin-email" class="control-label sr-only">Nome de usuário ou e-mail</label>
        <input v-model="email" type="text" class="form-control" id="signin-email" placeholder="Nome de usuário ou e-mail">
      </div>
      <div class="form-group">
        <label for="signin-password" class="control-label sr-only">Senha</label>
        <input v-model="password" type="password" class="form-control" id="signin-password" placeholder="Senha">
      </div>
      <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
      <button v-if="isLoading" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Fazendo login...</button>
      <button type="submit" class="btn btn-primary btn-lg btn-block">ENTRAR</button>
    </form>
  </div>
</div> -->
</template>

<script>
import auth from '../auth'

export default {
  created() {
    if (this.$store.state.currentUser) {
      this.$router.replace('/painel')
    }
    setTimeout(() => { this.showForm = true }, 500);

  },
  data() {
    return {
      email: '',
      password: '',
      showForm: false,
      year: new Date().getFullYear()
    }
  },
  methods: {
    login() {
      this.error = false
      this.isLoading = true
      auth.login(this.email, this.password, response => {
        if (response.authenticated) {
          const { name, token } = response.currentUser;
          window.Dorothy.connectUser({ name }, token);

          this.$router.replace(this.$route.query.redirect || '/painel')
        } else {
          this.error = response.error
        }
        this.isLoading = false
      })
    }
  }
};
</script>

<style lang="sass">
.error
  color: red


</style>
