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
          <input v-model="email" type="email" class="form-control" id="signin-email" placeholder="Email">            
        </div>
        <div class="form-group">
          <label for="signin-password" class="control-label sr-only">Senha</label>
          <input v-model="pass" type="password" class="form-control" id="signin-password" placeholder="Senha">
        </div>
        <p v-if="error" class="error">{{error}}</p>
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
      this.$router.replace('/dashboard')
    }
  },
  data () {
    return {
      email: 'joe@example.com',
      pass: 'password1',
      error: false
    }
  },
  methods: {
    login () {
      auth.login(this.email, this.pass, loggedIn => {
        // this.error = loggedIn
        // if (!loggedIn) {
        //   this.error = true
        // } else {
          this.$store.dispatch('login', localStorage.currentUser)
          this.$router.replace(this.$route.query.redirect || '/dashboard')
        // }
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
