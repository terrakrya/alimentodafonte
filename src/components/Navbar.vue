<template>
  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="brand">
      <h1><router-link to="/about">Rede de Sementes</router-link></h1>
    </div>
    <div class="container-fluid">
      <div class="navbar-btn">
        <button type="button" class="btn-toggle-fullwidth"><i class="lnr lnr-arrow-left-circle"></i></button>
      </div>

      <div class="navbar-btn">
        <a class="btn btn-primary" href="" title="Nova pesca"><i class="fa fa-plus"   aria-hidden="true"></i> <span>NOVA PESCA</span></a>
        <a class="btn btn-primary" href="" title="Criar grupo"><i class="fa fa-plus" aria-hidden="true"></i> <span>CRIAR GRUPO</span></a>
      </div>
      <div id="navbar-menu">
        <ul class="nav navbar-nav navbar-right">
          <li class="dropdown" v-bind:class="{open: userDropdown }">
            <a v-on:click="toggleUserDropdown()" href="#" class="dropdown-toggle" data-toggle="dropdown"><img src="../assets/img/user.png" class="img-circle img-prof" alt="Avatar"><span>{{currentUser}}</span> <i class="icon-submenu fa fa-chevron-down"></i></a>
            <ul class="dropdown-menu">
              <li><router-link v-if="currentUser" to="/logout"><i class="lnr lnr-exit"></i> <span>Sair</span></router-link></li>
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
  props: {
    currentUser: String
  }, 
  methods: {
    toggleUserDropdown: function (event) {
      this.userDropdown = !this.userDropdown
    }
  }
};
</script>

<style lang="sass">
  .brand h1 
    margin-top: 5px
    a 
      color: #fff
</style>