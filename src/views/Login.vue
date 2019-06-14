<template>
  <div class="left">
    <div class="content">
      <div class="brand">
        <h1 class="logo"><a href="/"><span>REDE</span> de <strong>sementes</strong></a></h1>
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
  </div>
</template>

<script>
import auth from '../auth'

export default {
  created () {
    if (this.$store.state.currentUser) {
      this.$router.replace('/sementes')
    }
  },
  data () {
    return {
      email: '',
      password: '',


    }
  },
  methods: {
    login () {
      this.error = false
      this.isLoading = true
      auth.login(this.email, this.password, response => {
        if (response.authenticated) {
          this.$router.replace(this.$route.query.redirect || '/sementes')
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
