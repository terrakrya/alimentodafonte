<template>
  <div class="panel">
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
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default {
  name: 'Panel',
  computed: {
    showMenu() {
      return this.$store.state.showMenu
    },
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
}
</script>
