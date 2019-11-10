<template>
  <div class="row justify-content-center">
    <div class="col-sm-6">
      <button v-if="loading" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> {{ msg ? msg : 'Carregando dados' }}...</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: ['loading', 'msg']
};
</script>
