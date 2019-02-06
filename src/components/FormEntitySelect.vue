<template>
  <div>  
    <cool-select :arrowsDisableInstantSelection="true" placeholder="Busque pelo nome clique para adicionar à lista" v-model="entity" :items="items" item-text="title" @select="addItem()">
      <template slot="item" slot-scope="{ item: option }">
        <div style="display: flex; align-items: center;">
          <img v-if="option.picture" :src="option.picture">
          <div>
            <strong>{{ option.title }}</strong>
            <br>
            <small>{{ option.description }}</small>
          </div>
        </div>
      </template>
    </cool-select>
  </div>
</template>

<script>
import { CoolSelect } from 'vue-cool-select'
export default {
  name: 'form-entities-select',
  props: ['items', 'form', 'field'],
  data () {
    return { 
      entity: [],
    }
  },
  created: function () {
    this.entity = this.items.find(item => { return item.id == this.form[this.field][0].target_id })
  },
  methods: {
    addItem () {
      this.form[this.field] = [{ target_id: this.entity.id }]
    }, 
    removeItem (id) {
      this.form[this.field] = this.form[this.field].filter(item => (item.target_id != id))
    }
  },
  components: {
    CoolSelect
  }
};
</script>
