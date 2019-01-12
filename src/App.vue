<template>
  <div id="app">
    <h1>Auth Flow</h1>
    <ul>
      <li>
        {{token}}
      </li>
      <li>
        <router-link v-if="token" to="/logout">Log out</router-link>
        <router-link v-if="!token" to="/login">Log in</router-link>
      </li>
      <li>
        <router-link to="/about">About</router-link>
      </li>
      <li>
        <router-link v-if="token" to="/dashboard">Dashboard</router-link>
      </li>
    </ul>
    <template v-if="$route.matched.length">
      <router-view></router-view>
    </template>
    <template v-else>
      <p>You are logged {{ token ? 'in' : 'out' }}</p>
    </template>
  </div>
</template>

<script>
import auth from '@/auth'

export default {
  created () {
    auth.onChange = loggedIn => {
      this.loggedIn = loggedIn
    }
  },
  computed: {
    token () {
      return this.$store.state.token
    },
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
