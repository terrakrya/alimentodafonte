<template>
  <div class="row">
    <div class="col-sm-4">
      <b-form-input v-model="searchFilter" placeholder="Buscar" class="search-input" @input="changeFilter" />
    </div>
    <div class="col-sm-8">
      <h1>
        {{name}}
        <router-link class="btn btn-primary btn-round btn-fab pull-right" v-if="addUrl" :to="addUrl"><i class="material-icons">add</i></router-link>
      </h1>
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
