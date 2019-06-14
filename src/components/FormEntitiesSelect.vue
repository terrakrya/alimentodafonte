<template>
<div>
  <cool-select :arrowsDisableInstantSelection="true" placeholder="Busque pelo nome clique para adicionar à lista" v-model="entity" :items="items" item-text="title" @select="addItem()">
    <template slot="item" slot-scope="{ item: option }">
      <div style="display: flex; align-items: center;">
        <img v-if="option.picture" :src="baseUrl + option.picture">
        <div>
          <strong>{{ option.title }}</strong>
          <br>
          <small>{{ option.description }}</small>
        </div>
      </div>
    </template>
  </cool-select>
  <div class="entity-select-preview" v-if="preview && preview.length > 0">
    <h5> Selecionados: </h5>
    <div class="list-group">
      <div class="list-group-item" v-for="(item_preview, index) in preview" :key="index">
        <div>
          <img v-if="item_preview && item_preview.picture" :src="baseUrl + item_preview.picture" />
          <span v-if="item_preview">{{item_preview.title}}</span>
          <b-button v-if="item_preview" class="btn btn-xs btn-danger fa fa-trash pull-right" @click="removeItem(item_preview.id)"></b-button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  CoolSelect
} from 'vue-cool-select'
export default {
  name: 'form-entities-select',
  props: ['type', 'form', 'field'],
  inject: ['$validator'],
  data() {
    return {
      items: [],
      entity: null
    }
  },
  async created() {
    switch (this.type) {
      case 'seeds':
        this.items = (await this.loadList('seeds')).map(seed => ({
          id: seed._id,
          title: seed.name,
          description: seed.scientific_name,
          picture: seed.images && seed.images.length ? seed.images[0].thumb : '',
        }))
        break;
      case 'collectors':
        this.items = (await this.loadList('collectors')).map(collector => ({
          id: collector._id,
          title: collector.name,
          description: collector.nickname,
          picture: collector.image ? collector.image.thumb : '',
        }))
        break;
    }
  },
  computed: {
    preview() {
      if (this.form && this.form[this.field] && this.items) {
        return this.form[this.field].map(selected => {
          return this.getItem(selected)
        }).filter(preview => preview)
      }
      return []
    }
  },
  methods: {
    addItem() {
      if (!this.form[this.field].find(item => (item == this.entity.id))) {
        this.form[this.field].push(this.entity.id)
      }
      this.entity = null
    },
    removeItem(id) {
      this.form[this.field] = this.form[this.field].filter(item => (item != id))
    },
    getItem(id) {
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
