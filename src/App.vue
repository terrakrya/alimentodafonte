<template>
<div class="wrapper" :class="this.$route.path.startsWith('/recibo/') ? 'clean' : ''">
  <div v-if="currentUser">
    <Sidebar />
    <div class="main-panel">
      <Navbar />
      <div class="content">
        <div class="container-fluid">
          <template v-if="$route.matched.length">
            <router-view></router-view>
          </template>
          <template v-else>
            <p>Página não encontrada.</p>
          </template>
        </div>
      </div>
      <div class="close-layer visible" v-if="showMenu" @click="toggleMenu"></div>
    </div>
  </div>
  <div v-if="!currentUser">
    <div class="off-canvas-sidebar">
      <router-view></router-view>
    </div>
  </div>
  <div class="clearfix"></div>
  <notifications group="a" />
</div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default {
  computed: {
    showMenu() {
      return this.$store.state.showMenu
    }
  },
  methods: {
    toggleMenu: function() {
      this.$store.dispatch('toggleMenu')
    }
  },
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
