<template>
  <button v-if="isLoading" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> {{ msg ? msg : 'Carregando dados' }}...</button>
</template>

<script>
export default {
  name: 'loading',
  props: ['isLoading', 'msg']
};
</script>
