<template>
<div class="form-months">
  <b-form-checkbox-group buttons button-variant="default btn-sm" v-model="form[field]" :options="meses" :name="field" />
  <a class="btn btn-default btn-sm pull-right" @click="selectAll">Ano todo</a>
</div>
</template>

<script>

import meses from '@/data/meses.json'

export default {

  name: 'form-months',
  props: ['form', 'field'],
  data() {
    return {
      meses: meses,
    }
  },
  methods: {
    selectAll() {
      this.form[this.field] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
    }
  }
};
</script>

<style lang="sass">
  .form-months
    .btn-group
      display: inline-block
      .btn-default
        margin: 2px !important
        border-radius: 2px !important
        &.active
          background-color: #9c27b0 !important
</style>
