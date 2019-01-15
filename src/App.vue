<template>
  <div id="app">
    <div id="wrapper">
      <Navbar v-if="currentUser" v-bind:currentUser="currentUser" />
      <Sidebar v-if="currentUser" />
      <div v-if="!currentUser" class="vertical-align-wrap">
        <div class="vertical-align-middle">
          <div class="auth-box">
            <router-view></router-view>
          </div>
        </div>
      </div>
      <div v-if="currentUser" class="main">
        <div class="main-content">
          <div class="container-fluid">
            <!-- <h1>Auth Flow</h1>
            <ul>
              <li>
                <router-link v-if="currentUser" to="/logout">Log out</router-link>
                <router-link v-if="!currentUser" to="/login">Log in</router-link>
              </li>
              <li>
                <router-link to="/about">About</router-link>
              </li>
              <li>
                <router-link v-if="currentUser" to="/dashboard">Dashboard</router-link>
              </li>
            </ul> -->
            <template v-if="$route.matched.length">
              <router-view></router-view>
            </template>
            <template v-else>
              <p>You are logged {{ currentUser ? 'in' : 'out' }}</p>
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
    currentUser () {
      return this.$store.state.currentUser
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
  #wrapper.boxview .main 
    padding: 0
    margin: auto
    width: 35%
    height: 450px
    float: none

    
</style>
