<template>
  <span class="text-danger" v-show="msg.has(field)">{{ msg.first(field) }}</span>
</template>

<script>
export default {
  name: 'field-error',
  props: ['msg', 'field']
};
</script>
