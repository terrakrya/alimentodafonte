<template>
  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="brand">
      <a href="index.html"><img src="../assets/img/logo-pesca.png" alt="Logo Pesca Mais Brasil" class="img-responsive logo"></a>
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
          <li class="dropdown open">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown"><img src="../assets/img/user.png" class="img-circle img-prof" alt="Avatar"> <span>Paulo Oliveira</span> <i class="icon-submenu lnr lnr-chevron-down"></i></a>
            <ul class="dropdown-menu">
              <li><a href="#"><i class="lnr lnr-exit"></i> <span>Sair</span></a></li>
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
  props: {
    token: String
  }
};
</script>
