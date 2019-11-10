<template>
  <div class="row-fluid">
    <br>
    <br>
    <div v-if="list && list.length == 0" class="col-md-3 ml-auto mr-auto text-center alert alert-default"><strong>{{msg ? msg : 'Nenhum item encontrado'}}</strong></div>
  </div>
</template>

<script>
export default {
  name: 'no-item',
  props: ['list', 'msg']
};
</script>
