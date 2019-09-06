<template>
  <div id="app" :class="this.$route.path.startsWith('/recibo/') ? 'clean' : ''">
    <div id="wrapper">
      <Navbar />
      <div v-if="currentUser" class="row-fluid">
        <Sidebar />
        <div class="main">
          <div class="main-content">
            <div class="container-fluid">
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
      <div v-if="!currentUser" class="vertical-align-wrap">
        <div class="vertical-align-middle">
          <div class="auth-box">
            <router-view></router-view>
          </div>
        </div>
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default {
  components: {
    Navbar,
    Sidebar
  }
};

</script>

<style lang='sass'>
  @import "./assets/css/template.sass"
  #wrapper.boxview .main
    padding: 0
    margin: auto
    width: 35%
    height: 450px
    float: none


</style>
