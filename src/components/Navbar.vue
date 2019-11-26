<template>
<nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
  <div class="container-fluid">
    <div class="navbar-wrapper">
      <a class="navbar-brand" href="/">Plataforma <strong>SocioBio</strong></a>
    </div>
    <button @click="toggleMenu" class="navbar-toggler" :class="showMenu ? 'toggled' : ''" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Menu">
      <span class="sr-only">Menu</span>
      <span class="navbar-toggler-icon icon-bar"></span>
      <span class="navbar-toggler-icon icon-bar"></span>
      <span class="navbar-toggler-icon icon-bar"></span>
    </button>
    
  </div>
  <!-- <div class="brand">
      <h1 class="logo">
        <i class="fa fa-bars menu-buttom" @click="toggleMenu"></i>
        <a href="/"><span>Plataforma </span><strong>SocioBio</strong></a></h1>
    </div>
    <div class="container-fluid">
      <div class="navbar-btn">
      </div>
      <div id="navbar-menu">
        <ul class="nav navbar-nav navbar-right">
          <li class="dropdown" :class="{open: userDropdown }">
            <a @click="toggleUserDropdown()" href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-user"></i> &nbsp; <span>{{currentUser.name}}</span> &nbsp;<i class="icon-submenu fa fa-chevron-down"></i></a>
            <ul class="dropdown-menu">
              <li @click="toggleUserDropdown()"><router-link v-if="currentUser" to="/logout"><i class="fa fa-exit"></i> <span>Sair</span></router-link></li>
            </ul>
          </li>

        </ul>
      </div>
    </div> -->
</nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      userDropdown: false
    }
  },
  computed: {
    showMenu() {
      return this.$store.state.showMenu
    }
  },

  methods: {
    toggleUserDropdown: function() {
      this.userDropdown = !this.userDropdown
    },
    toggleMenu: function() {
      this.$store.dispatch('toggleMenu')
    }
  }
};
</script>

<style lang="sass">
  .brand h1
    margin-top: 10px
    font-size: 31px
    a
      color: #fff
      span
        font-weight: 300
      strong
        font-weight: 900
</style>
