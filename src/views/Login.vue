<template>
  <div class="left">
    <div class="content">
      <div class="header">
        <div class="logo"><h1>Rede de Sementes</h1></div>
      </div>
      <p v-if="$route.query.redirect">
        Você precisa entrar com seus dados para acessar.
      </p>
      <form @submit.prevent="login" class="form-auth-small">
        <div class="form-group">
          <label for="signin-email" class="control-label sr-only">Email</label>
          <input v-model="email" type="text" class="form-control" id="signin-email" placeholder="Email">            
        </div>
        <div class="form-group">
          <label for="signin-password" class="control-label sr-only">Senha</label>
          <input v-model="pass" type="password" class="form-control" id="signin-password" placeholder="Senha">
        </div>
        <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        <button v-if="loading" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Fazendo login...</button>
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
      this.$router.replace('/painel')
    }
  },
  data () {
    return {
      email: 'terra krya',
      pass: 'eusou',
      error: false,
      loading: false
    }
  },
  methods: {
    login () {
      this.error = false
      this.loading = true
      auth.login(this.email, this.pass, response => {
        if (response.authenticated) {
          this.$router.replace(this.$route.query.redirect || '/painel')
        } else {
          this.error = response.error
        }
        this.loading = false
      })
    }
  }
};
</script>

<style>
.error {
  color: red;
}
</style>
