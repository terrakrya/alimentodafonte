<template>
  <div>
    <cool-select :arrowsDisableInstantSelection="true" placeholder="Busque pelo nome clique para selecionar" v-model="entity" :items="items" item-text="title" @select="addItem(); callback(entity)">
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
  </div>
</template>

<script>
import { CoolSelect } from 'vue-cool-select'
export default {
  name: 'form-entity-select',
  props: ['items', 'form', 'field', 'input'],
  inject: ['$validator'],
  data () {
    return {
      entity: [],
    }
  },
  created: function () {
    if (this.form[this.field] && this.form[this.field].length) {
      this.entity = this.items.find(item => { return item.id == this.form[this.field][0].target_id })
    }
  },
  methods: {
    addItem () {
      this.form[this.field] = [{ target_id: this.entity.id }]
    },
    removeItem (id) {
      this.form[this.field] = this.form[this.field].filter(item => (item.target_id != id))
    },
    callback (entity) {
      if (this.input) {
        this.input(entity)
      }
    }
  },
  components: {
    CoolSelect
  }
};
</script>
