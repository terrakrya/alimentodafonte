<template>
<div class="sidebar" data-color="green" data-background-color="black" data-image="../assets/img/bg.jpg">
  <!--
        Tip 1: You can change the color of the sidebar using: data-color="purple | azure | green | orange | danger"

        Tip 2: you can also add an image using data-image tag
    -->
  <div class="logo">
    <a href="/" class="simple-text logo-mini">
      PL
    </a>
    <a href="/" class="simple-text logo-normal">
      SocioBio
    </a>
  </div>
  <div class="sidebar-wrapper">
    <div class="user">
      <div class="photo">
        <img v-if="currentUser.image" :src="baseUrl + currentUser.image" />
        <i class="fa fa-user" v-else></i>
      </div>
      <div class="user-info">
        <a v-b-toggle.collapseExample class="username">
          <span>
            {{currentUser.name | firstname}}
            <b class="caret"></b>
          </span>
        </a>
        <b-collapse id="collapseExample">
          <ul class="nav">
            <li class="nav-item">
              <router-link class="nav-link" v-if="currentUser" to="/logout">
                <span class="sidebar-normal"> Sair </span>
              </router-link>
            </li>
          </ul>
        </b-collapse>
      </div>
    </div>
    <ul class="nav">
      <li class="nav-item active ">
        <router-link class="nav-link" to="/painel">
          <i class="material-icons">dashboard</i>
          <p> Dashboard </p>
        </router-link>
      </li>
      <li class="nav-item" @click="toggleMenu">
        <router-link class="nav-link" to="/organizacoes">
          <i class="material-icons">device_hub</i>
          <p>Organizações</p>
        </router-link>
      </li>
      <li class="nav-item" @click="toggleMenu">
        <router-link class="nav-link" to="/fornecedores">
          <i class="material-icons">people</i>
          <p>Fornecedores</p>
        </router-link>
      </li>
      <li class="nav-item" @click="toggleMenu">
        <router-link class="nav-link" to="/produtos">
          <i class="material-icons">shopping_cart</i>
          <p>Produtos</p>
        </router-link>
      </li>
      <li class="nav-item" @click="toggleMenu">
        <router-link class="nav-link" to="/transportadoras">
          <i class="material-icons">local_shipping</i>
          <p>Transportadoras</p>
        </router-link>
      </li>
      <li class="nav-item" @click="toggleMenu">
        <router-link class="nav-link" to="/armazens">
          <i class="material-icons">store_mall_directory</i>
          <p>Armazens</p>
        </router-link>
      </li>
    </ul>
  </div>
  <div class="sidebar-background">
  </div>
</div>
<!-- <div id="sidebar-nav" class="sidebar" :class="{active: showMenu}">
  <div class="sidebar-scroll">
    <nav>
      <ul class="nav">
        <li @click="toggleMenu">
          <router-link to="/painel"><i class="fa fa-home"></i> <span>Início</span></router-link>
        </li>
        <li v-if="isManager">
          <a><i class="fa fa-cogs"></i><span>Operacional</span><i class="fa fa-chevron-down"></i></a>
          <ul class="nav">
            <li @click="toggleMenu">
              <router-link to="/estoque"><span>Estoque</span></router-link>
            </li>
            <li @click="toggleMenu">
              <router-link to="/listas-de-potencial"><span>Potencial de coleta</span></router-link>
            </li>
            <li @click="toggleMenu">
              <router-link to="/pedidos-para-coletores"><span>Pedidos para coletores</span></router-link>
            </li>
            <li @click="toggleMenu">
              <router-link to="/encomendas"><span>Encomendas</span></router-link>
            </li>
            <li @click="toggleMenu">
              <router-link to="/coletas"><span>Coleta de sementes</span></router-link>
            </li>
          </ul>
        </li>
        <li>
          <a v-if="isManager"><i class="fa fa-list-alt"></i><span>Cadastros</span><i class="fa fa-chevron-down"></i></a>
          <ul class="nav">
            <li @click="toggleMenu" v-if="isAdmin">
              <router-link to="/usuarios"><span>Usuários</span></router-link>
            </li>
            <li @click="toggleMenu" v-if="isManager">
              <router-link to="/clientes"><span>Clientes</span></router-link>
            </li>
            <li @click="toggleMenu" v-if="isManager">
              <router-link to="/sementes"><span>Sementes</span></router-link>
            </li>
            <li @click="toggleMenu" v-if="isManager">
              <router-link to="/coletores"><span>Coletores</span></router-link>
            </li>
            <li @click="toggleMenu" v-if="isManager">
              <router-link to="/grupos-de-coletores"><span>Grupos de coletores</span></router-link>
            </li>
            <li @click="toggleMenu" v-if="isManager">
              <router-link to="/casas-de-sementes"><span>Casas de sementes</span></router-link>
            </li>
            <li @click="toggleMenu" v-if="isManager">
              <router-link to="/areas-de-coleta"><span>Áreas de coleta</span></router-link>
            </li>
            <li @click="toggleMenu" v-if="isManager">
              <router-link to="/matrizes-de-sementes"><span>Matrizes</span></router-link>
            </li>
            <li @click="toggleMenu" v-if="isCollector && !isManager">
              <router-link to="/sementes-do-coletor"><span>Sementes</span></router-link>
            </li>
            <li @click="toggleMenu" v-if="isCollector && !isManager">
              <router-link to="/pedidos-do-coletor"><span>Pedidos</span></router-link>
            </li>
            <li @click="toggleMenu" v-if="isCollector && !isManager">
              <router-link to="/entregas-do-coletor"><span>Entregas</span></router-link>
            </li>
            <li @click="toggleMenu" v-if="isCollector && !isManager">
              <router-link to="/coletas"><span>Coletas</span></router-link>
            </li>
          </ul>
        </li>
        <li class="profile">
          <a><i class="fa fa-user"></i><span>{{currentUser.name}}</span><i class="fa fa-chevron-down"></i></a>
          <ul class="nav">
            <li @click="toggleMenu">

            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
  <div class="clearfix"></div>
</div> -->
</template>

<script>
export default {
  name: 'Sidebar',
  computed: {
    showMenu() {
      return this.$store.state.showMenu
    }
  },
  methods: {
    toggleMenu() {
      this.$store.dispatch('toggleMenu')
    }
  }
};
</script>
