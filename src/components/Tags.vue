<template>
  <div class="form-tags">
    <div class="">
      <a v-for="(tag, index) in tags" :key="index"> <span class="badge badge-default" > {{tag.text}} </span> &nbsp;</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tags',
  props: ['tags'],
};
</script>
