<template>
<div class="wrapper" :class="this.$route.path.startsWith('/recibo/') ? 'clean' : ''">
  <router-view></router-view>
  <div class="clearfix"></div>
  <notifications group="a" />
</div>
</template>

<script>

export default {
  
};
</script>
  <style lang='sass'>
    @import "./assets/css/template.sass"

    #wrapper.boxview .main
      padding: 0
      margin: auto
      width: 35%
      height: 450px
      float: none


  </style>
