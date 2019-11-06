<template>
<div class="sidebar" data-color="rose" data-background-color="orange" data-image="../assets/img/sidebar-1.jpg">
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
            <!-- <li class="nav-item">
              <a class="nav-link" href="#">
                <span class="sidebar-mini"> MP </span>
                <span class="sidebar-normal"> My Profile </span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span class="sidebar-mini"> EP </span>
                <span class="sidebar-normal"> Edit Profile </span>
              </a>
            </li> -->
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
        <a class="nav-link" href="../examples/dashboard.html">
          <i class="material-icons">dashboard</i>
          <p> Dashboard </p>
        </a>
      </li>
      <li class="nav-item ">
        <a class="nav-link" v-b-toggle.pagesExamples>
          <i class="material-icons">image</i>
          <p> Pages
            <b class="caret"></b>
          </p>
        </a>
        <div class="collapse" id="pagesExamples">
          <ul class="nav">
            <li class="nav-item ">
              <a class="nav-link" href="../examples/pages/pricing.html">
                <span class="sidebar-mini"> P </span>
                <span class="sidebar-normal"> Pricing </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/pages/rtl.html">
                <span class="sidebar-mini"> RS </span>
                <span class="sidebar-normal"> RTL Support </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/pages/timeline.html">
                <span class="sidebar-mini"> T </span>
                <span class="sidebar-normal"> Timeline </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/pages/login.html">
                <span class="sidebar-mini"> LP </span>
                <span class="sidebar-normal"> Login Page </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/pages/register.html">
                <span class="sidebar-mini"> RP </span>
                <span class="sidebar-normal"> Register Page </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/pages/lock.html">
                <span class="sidebar-mini"> LSP </span>
                <span class="sidebar-normal"> Lock Screen Page </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/pages/user.html">
                <span class="sidebar-mini"> UP </span>
                <span class="sidebar-normal"> User Profile </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/pages/error.html">
                <span class="sidebar-mini"> E </span>
                <span class="sidebar-normal"> Error Page </span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li class="nav-item ">
        <a class="nav-link" v-b-toggle.componentsExamples>
          <i class="material-icons">apps</i>
          <p> Components
            <b class="caret"></b>
          </p>
        </a>
        <div class="collapse" id="componentsExamples">
          <ul class="nav">
            <li class="nav-item ">
              <a class="nav-link" v-b-toggle.componentsCollapse>
                <span class="sidebar-mini"> MLT </span>
                <span class="sidebar-normal"> Multi Level Collapse
                  <b class="caret"></b>
                </span>
              </a>
              <div class="collapse" id="componentsCollapse">
                <ul class="nav">
                  <li class="nav-item ">
                    <a class="nav-link" href="#0">
                      <span class="sidebar-mini"> E </span>
                      <span class="sidebar-normal"> Example </span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/components/buttons.html">
                <span class="sidebar-mini"> B </span>
                <span class="sidebar-normal"> Buttons </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/components/grid.html">
                <span class="sidebar-mini"> GS </span>
                <span class="sidebar-normal"> Grid System </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/components/panels.html">
                <span class="sidebar-mini"> P </span>
                <span class="sidebar-normal"> Panels </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/components/sweet-alert.html">
                <span class="sidebar-mini"> SA </span>
                <span class="sidebar-normal"> Sweet Alert </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/components/notifications.html">
                <span class="sidebar-mini"> N </span>
                <span class="sidebar-normal"> Notifications </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/components/icons.html">
                <span class="sidebar-mini"> I </span>
                <span class="sidebar-normal"> Icons </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/components/typography.html">
                <span class="sidebar-mini"> T </span>
                <span class="sidebar-normal"> Typography </span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li class="nav-item ">
        <a class="nav-link" v-b-toggle.formsExamples>
          <i class="material-icons">content_paste</i>
          <p> Forms
            <b class="caret"></b>
          </p>
        </a>
        <div class="collapse" id="formsExamples">
          <ul class="nav">
            <li class="nav-item ">
              <a class="nav-link" href="../examples/forms/regular.html">
                <span class="sidebar-mini"> RF </span>
                <span class="sidebar-normal"> Regular Forms </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/forms/extended.html">
                <span class="sidebar-mini"> EF </span>
                <span class="sidebar-normal"> Extended Forms </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/forms/validation.html">
                <span class="sidebar-mini"> VF </span>
                <span class="sidebar-normal"> Validation Forms </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/forms/wizard.html">
                <span class="sidebar-mini"> W </span>
                <span class="sidebar-normal"> Wizard </span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li class="nav-item ">
        <a class="nav-link" v-b-toggle.tablesExamples>
          <i class="material-icons">grid_on</i>
          <p> Tables
            <b class="caret"></b>
          </p>
        </a>
        <div class="collapse" id="tablesExamples">
          <ul class="nav">
            <li class="nav-item ">
              <a class="nav-link" href="../examples/tables/regular.html">
                <span class="sidebar-mini"> RT </span>
                <span class="sidebar-normal"> Regular Tables </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/tables/extended.html">
                <span class="sidebar-mini"> ET </span>
                <span class="sidebar-normal"> Extended Tables </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/tables/datatables.net.html">
                <span class="sidebar-mini"> DT </span>
                <span class="sidebar-normal"> DataTables.net </span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li class="nav-item ">
        <a class="nav-link" v-b-toggle.mapsExamples>
          <i class="material-icons">place</i>
          <p> Maps
            <b class="caret"></b>
          </p>
        </a>
        <div class="collapse" id="mapsExamples">
          <ul class="nav">
            <li class="nav-item ">
              <a class="nav-link" href="../examples/maps/google.html">
                <span class="sidebar-mini"> GM </span>
                <span class="sidebar-normal"> Google Maps </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/maps/fullscreen.html">
                <span class="sidebar-mini"> FSM </span>
                <span class="sidebar-normal"> Full Screen Map </span>
              </a>
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="../examples/maps/vector.html">
                <span class="sidebar-mini"> VM </span>
                <span class="sidebar-normal"> Vector Map </span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li class="nav-item ">
        <a class="nav-link" href="../examples/widgets.html">
          <i class="material-icons">widgets</i>
          <p> Widgets </p>
        </a>
      </li>
      <li class="nav-item ">
        <a class="nav-link" href="../examples/charts.html">
          <i class="material-icons">timeline</i>
          <p> Charts </p>
        </a>
      </li>
      <li class="nav-item ">
        <a class="nav-link" href="../examples/calendar.html">
          <i class="material-icons">date_range</i>
          <p> Calendar </p>
        </a>
      </li>
    </ul>
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
