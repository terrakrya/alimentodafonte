<template>
<div class="form-months row">
  <div class="col-sm-8">
    <b-form-input v-model="form[field].value" type="number" step="0.01" lang="nb" min="0" />
  </div>
  <div class="col-sm-4">
    <b-form-select v-model="form[field].unit" :options="unitOptions" class="form-control" />
  </div>
</div>
</template>

<script>


export default {

  name: 'form-months',
  props: ['form', 'field', 'type'],
  computed: {
    unitOptions() {
      if (this.type == 'weight') {
        return ['g', 'Kg', 'Ton']
      } else if (this.type == 'size') {
        return ['cm', 'm']
      } else {
        return ['Dias', 'Meses', 'Anos']
      }
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
