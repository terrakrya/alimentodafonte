<template>
  <div id="sidebar-nav" class="sidebar" v-bind:class="{active: showMenu}">
    <div class="sidebar-scroll">
      <nav>
        <ul class="nav">
          <li @click="toggleMenu">
            <router-link to="/painel"><i class="fa fa-home"></i> <span>Início</span></router-link>
          </li>
          <li>
            <a><i class="fa fa-list-alt"></i><span>Cadastros</span><i class="fa fa-chevron-down"></i></a>
            <ul class="nav">
              <li @click="toggleMenu">
                <router-link to="/sementes"><span>Sementes</span></router-link>
              </li>
              <li @click="toggleMenu">
                <router-link to="/coletores"><span>Coletores</span></router-link>
              </li>
              <li>
                <a href="#"><span>Grupos de coletores</span></a>
              </li>
              <li>
                <a href="#"><span>Casas de Sementes</span></a>
              </li>
              <li>
                <a href="#"><span>Redes de Sementes</span></a>
              </li>
              <li>
                <a href="#"><span>Área de Coleta</span></a>
              </li>
              <li>
                <a href="#"><span>Matrizes de Sementes</span></a>
              </li>
            </ul>
          </li>
          <li>
            <a><i class="fa fa-cogs"></i><span>Operacional</span><i class="fa fa-chevron-down"></i></a>
            <ul class="nav">
              <li>
                <a href="#"><span>Pedidos para Coletores</span></a>
              </li>
              <li>
                <a href="#"><span>Estoque</span></a>
              </li>
              <li>
                <a href="#"><span>Relatórios</span></a>
              </li>
            </ul>
          </li>
          <li class="profile">
            <a><i class="fa fa-user"></i><span>{{currentUser.current_user.name}}</span><i class="fa fa-chevron-down"></i></a>
            <ul class="nav">
              <li @click="toggleMenu">
                <router-link v-if="currentUser" to="/logout">Sair</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  computed: {
    showMenu () {
      return this.$store.state.showMenu
    }
  },
  methods: {
    toggleMenu () {
      this.$store.dispatch('toggleMenu')
    }
  } 
};
</script>
