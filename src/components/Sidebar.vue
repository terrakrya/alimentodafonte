<template>
<div class="sidebar" data-color="green" data-background-color="black" data-image="../assets/img/bg.jpg">
  <div class="logo">
    <a href="/" class="simple-text logo-mini">
    </a>
    <a href="/" class="simple-text logo-normal">
      Biobá
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
      <li class="nav-item">
        <router-link class="nav-link" to="/painel">
          <i class="material-icons">dashboard</i>
          <p> Painel inicial </p>
        </router-link>
      </li>
      <li class="nav-item" @click="toggleMenu">
        <router-link class="nav-link" to="/organizacoes" v-if="isLink">
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
        <router-link class="nav-link" to="/ofertas">
          <i class="material-icons">local_offer</i>
          <p>Ofertas</p>
        </router-link>
      </li>
      <li class="nav-item" @click="toggleMenu">
        <router-link class="nav-link" to="/pedidos">
          <i class="material-icons">list_alt</i>
          <p>Pedidos</p>
        </router-link>
      </li>
      <li class="nav-item" @click="toggleMenu" v-if="isAdmin">
        <router-link class="nav-link" to="/usuarios">
          <i class="material-icons">person</i>
          <p>Usuários</p>
        </router-link>
      </li>
      <li class="nav-item" @click="toggleMenu">
        <router-link class="nav-link" to="/loja">
          <i class="material-icons">shopping_cart</i>
          <p>Loja</p>
        </router-link>
      </li>
    </ul>
  </div>
  <div class="sidebar-background">
  </div>
</div>
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
