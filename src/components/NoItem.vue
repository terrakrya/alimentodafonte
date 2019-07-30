<template>
  <h5 v-if="list && list.length == 0" class="no-item text-center">{{msg ? msg : 'Nenhum ítem encontrado'}}</h5>
</template>

<script>
export default {
  name: 'no-item',
  props: ['list', 'msg']
};
</script>
