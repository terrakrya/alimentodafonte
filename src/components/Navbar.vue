<template>
  <nav class="navbar navbar-default" v-if="currentUser">
    <div class="brand">
      <h1 class="logo">
        <i class="fa fa-bars menu-buttom" @click="toggleMenu"></i>
        <a href="/"><span>REDE</span> de <strong>sementes</strong></a></h1>
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
    </div>
  </nav>
</template>

<script>

export default {
  name: 'Navbar',
  data () {
    return { userDropdown: false }
  },
  computed: {
    showMenu () {
      return this.$store.state.showMenu
    }
  },

  methods: {
    toggleUserDropdown: function () {
      this.userDropdown = !this.userDropdown
    },
    toggleMenu: function () {
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
