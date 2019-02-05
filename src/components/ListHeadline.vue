<template>
  <div class="row">
    <div class="col-sm-8">
      <h1>
        {{name}} 
        <router-link v-bind:to="addUrl">+ Cadastrar</router-link>
      </h1>
    </div>
    <div class="col-sm-4">
      <b-form-input v-model="searchFilter" placeholder="Buscar" class="search-input" @input="changeFilter" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'list-headline',
  
  props: ['name', 'addUrl', 'filters'],
  data () {
    return { 
      searchFilter: ''
    }
  },

  methods: {
    changeFilter() {
      this.filters.search = this.searchFilter  
    }
  }
};
</script>
