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
    <div class="entity-select-preview">
      <h5> Selecionados: </h5> 
      <div class="list-group" v-if="preview && preview.length > 0">
        <div class="list-group-item" v-for="(item_preview, index) in preview" :key="index" >
          <div> 
            <img v-if="item_preview && item_preview.picture" :src="item_preview.picture" />
            <span v-if="item_preview">{{item_preview.title}}</span>
            <b-button v-if="item_preview" class="btn btn-sm btn-danger fa fa-trash pull-right" @click="removeItem(item_preview.id)"></b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CoolSelect } from 'vue-cool-select'
export default {
  name: 'form-entities-select',
  props: ['items', 'form', 'field'],
  data () {
    return { 
      entity: null
    }
  },
  computed: {
    preview () {
      if (this.form && this.form[this.field] && this.items) {
        return this.form[this.field].map(selected => {
          return this.getItem(selected.target_id)
        })      
      } 
      return []
    }
  },
  methods: {
    addItem () {
      if (!this.form[this.field].find(item => (item.target_id 
        == this.entity.id))) {
        this.form[this.field].push({ target_id: this.entity.id })

      }
      this.entity = null
    }, 
    removeItem (id) {
      this.form[this.field] = this.form[this.field].filter(item => (item.target_id != id))
    }, 
    getItem (id) {
      return this.items.find(i => {
        return i.id == id
      })
    }
  },
  components: {
    CoolSelect
  }
};
</script>
