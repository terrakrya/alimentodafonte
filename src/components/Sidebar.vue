<template>
  <div id="sidebar-nav" class="sidebar" :class="{active: showMenu}">
    <div class="sidebar-scroll">
      <nav>
        <ul class="nav">
          <li @click="toggleMenu">
            <router-link to="/painel"><i class="fa fa-home"></i> <span>Início</span></router-link>
          </li>
          <li>
            <a><i class="fa fa-cogs"></i><span>Operacional</span><i class="fa fa-chevron-down"></i></a>
            <ul class="nav">
              <li @click="toggleMenu">
                <router-link to="/lista-de-potencial"><span>Lista de potencial</span></router-link>
              </li>
              <li @click="toggleMenu">
                <router-link to="/encomendas"><span>Encomendas</span></router-link>
              </li>
              <li @click="toggleMenu">
                <router-link to="/pedidos-para-coletores"><span>Pedidos para Coletores</span></router-link>
              </li>
              <li @click="toggleMenu">
                <router-link to="/estoque"><span>Estoque</span></router-link>
              </li>
            </ul>
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
              <li @click="toggleMenu">
                <router-link to="/grupos-de-coletores"><span>Grupos de coletores</span></router-link>
              </li>
              <li @click="toggleMenu">
                <router-link to="/casas-de-sementes"><span>Casas de sementes</span></router-link>
              </li>
              <li @click="toggleMenu">
                <router-link to="/redes-de-sementes"><span>Redes de sementes</span></router-link>
              </li>
              <li @click="toggleMenu">
                <router-link to="/areas-de-coleta"><span>Áreas de coleta</span></router-link>
              </li>
              <li @click="toggleMenu">
                <router-link to="/matrizes-de-sementes"><span>Matrizes de sementes</span></router-link>
              </li>
              <li @click="toggleMenu">
                <router-link to="/clientes"><span>Clientes</span></router-link>
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
