<template>
  <div id="app">
    <div id="wrapper">
      <Navbar v-if="token" v-bind:token="token" />
      <Sidebar v-if="token" />
      <div class="main">
        <div class="main-content">
          <div class="container-fluid">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '@/auth'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

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
  },
  components: {
    Navbar,
    Sidebar
  }
};

</script>

<style lang='sass'>
  @import "./assets/css/bootstrap.min.css"
  @import "./assets/css/main.css"
  @import "./assets/css/custom.css"
</style>
