<template>
  <ol class="breadcrumb">
    <li><router-link to="/painel">Painel do {{currentRole.text | lowercase}}</router-link></li>
    <li v-for="(link, index) in links" :key="index" >
      <router-link :to="link[1]">{{link[0]}}</router-link>
    </li>
    <li class="active">{{ active }}</li>
  </ol>
</template>

<script>
export default {
  name: 'breadcrumb',
  props: ['links', 'active']
};
</script>
