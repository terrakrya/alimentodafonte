<template>
  <div class="row">
    <div class="col-sm-8">
      <h1>
        {{name}}
        <router-link class="btn btn-default" v-if="addUrl" :to="addUrl"><i class="fa fa-plus"></i>&nbsp; Cadastrar</router-link>
        <router-link class="btn btn-default" v-if="importUrl" :to="importUrl"><i class="fa fa-upload"></i>&nbsp; Importar</router-link>
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

  props: ['name', 'addUrl', 'importUrl', 'filters'],
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
