<template>
  <div class="filter-entity-select">
    <cool-select :scrollItemsLimit="10000" :scrollItemsLimitAddAfterScroll="10000" :arrowsDisableInstantSelection="true" :placeholder="placeholder" v-model="form[field]" :items="list" item-text="title" :itemValue="itemValue" @select="callback()">
      <template slot="item" slot-scope="{ item: option }">
        <div style="display: flex; align-items: center;">
          <img v-if="option.picture" :src="option.picture">
          <div>
            <strong>{{ option.title }}</strong>
            <br v-if="option.description && option.description">
            <small>{{ option.description }}</small>
          </div>
        </div>
      </template>
      <template slot="no-data">
        <br>
        <h5 class="text-center">Nenhum item encontrado</h5>
        <br>
      </template>
    </cool-select>
    <i class="fa fa-trash" v-if="form[field]" @click="clear()"></i>
  </div>
</template>

<script>
import { CoolSelect } from 'vue-cool-select'
export default {
  name: 'filter-entities-select',
  props: ['items', 'form', 'field', 'input', 'placeholder', 'itemValue', 'type'],
  data() {
    return {
      list: []
    }
  },
  async created() {
    if (this.items) {
      this.list = this.items.sort(function(a, b) {
        return a.title.localeCompare(b.title);
      })
    } else {
      switch (this.type) {
        case 'users':
          this.list = (await this.loadList('users')).map(user => ({
            id: user._id,
            title: user.name,
            email: user.email,
            description: user.nickname,
            picture: user.image ? user.image.thumb : '',
          })).sort(function(a, b) {
            return a.title.localeCompare(b.title);
          })
          break;
      }
    }
  },
  methods: {
    callback () {
      if (this.input) {
        this.input()
      }
    },
    clear () {
      this.form[this.field] = null
      this.callback()
    }
  },
  components: {
    CoolSelect
  }
};
</script>
