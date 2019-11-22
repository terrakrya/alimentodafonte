<template>
  <div class="form-tags">
    <vue-tags-input
      v-model="tag"
      :tags="form[field]"
      :autocomplete-items="filteredTags"
      @tags-changed="newTags => form[field] = newTags"
      placeholder=""
    />
    <small class="form-text text-muted">Digite acima e pressione enter ou clique abaixo para adicionar</small>
    <div class="">
      <a v-for="(tag, index) in filteredTags" :key="index" @click="addTag(tag)"> <span class="badge badge-default" > {{tag.text}} </span> &nbsp;</a>
    </div>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';

export default {
  name: 'form-tags',
  props: ['form', 'field', 'tags'],
  data() {
    return {
      tag: '',
    };
  },
  methods: {
    addTag(tag) {
      this.form[this.field].push(tag)
    }
  },
  computed: {
    filteredTags() {
      if (this.tags) {
        return this.tags.filter(i => {
          return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1 && !this.form[this.field].find(t => t.text.toLowerCase() == i.text.toLowerCase());
        });
      }
      return []
    },
  },
  components: {
    VueTagsInput,
  },
};
</script>

<style lang="sass">
.vue-tags-input
  max-width: 100% !important
  .ti-input
    border: none
    border-bottom: 1px solid #ccc
  .ti-tag
    padding: 10px 15px
    width: auto
    background-color: #9c27b0
  .ti-autocomplete
    display: none !important
.badge.badge-default
  text-transform: none
</style>
