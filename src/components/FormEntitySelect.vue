<template>
<div>
  <cool-select :scrollItemsLimit="10000" :scrollItemsLimitAddAfterScroll="10000" :arrowsDisableInstantSelection="true" :placeholder="placeholder || 'Busque pelo nome clique para selecionar'" v-model="entity" v-validate="validate" :name="field"
    :items="list" item-text="title" @select="addItem(); callback(entity)" inputForTextClass="form-control">
    <template slot="item" slot-scope="{ item: option }">
      <div style="display: flex; align-items: center;">
        <img v-if="option.picture" :src="baseUrl + option.picture">
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
  <span v-for="(err, index) in veeErrors" :key="index">
    <span class="text-danger" v-if="err.field == field">{{ err.msg }}</span>
  </span>
</div>
</template>

<script>
import Vue from 'vue'
import {
  CoolSelect
} from 'vue-cool-select'
export default {
  name: 'form-entity-select',
  props: ['items', 'type', 'form', 'field', 'input', 'validate', 'placeholder'],
  inject: ['$validator'],
  data() {
    return {
      list: [],
      entity: [],
    }
  },
  async created() {
    if (this.items) {
      this.list = this.items.sort(function(a, b) {
        return a.title.localeCompare(b.title);
      })
    } else {
      switch (this.type) {
        case 'producers':
          this.list = (await this.loadList('producers')).map(producer => ({
            id: producer._id,
            title: producer.name,
            description: producer.description,
            picture: producer.images && producer.images.length ? producer.images[0].thumb : '',
          })).sort(function(a, b) {
            return a.title.localeCompare(b.title);
          })
          break;
        case 'products':
          this.list = (await this.loadList('products')).map(product => ({
            id: product._id,
            title: product.name,
            description: Vue.options.filters.currency(product.final_price, 'R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' }),
            picture: product.images && product.images.length ? product.images[0].thumb : '',
          })).sort(function(a, b) {
            return a.title.localeCompare(b.title);
          })
          break;
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
    if (this.form[this.field] && this.form[this.field].length) {
      this.entity = this.list.find(item => {
        return item.id == this.form[this.field]
      })
    }
  },
  methods: {
    addItem() {
      this.form[this.field] = this.entity.id
    },
    callback(entity) {
      if (this.input) {
        this.input(entity)
      }
    }
  },
  watch: {
    items: function(newVal) {
      this.list = newVal
    }
  },
  components: {
    CoolSelect
  }
};
</script>
