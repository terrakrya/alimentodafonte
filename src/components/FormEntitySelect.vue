<template>
<div>
  <cool-select :arrowsDisableInstantSelection="true" placeholder="Busque pelo nome clique para selecionar" v-model="entity" :items="list" item-text="title" @select="addItem(); callback(entity)">
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
</div>
</template>

<script>
import {
  CoolSelect
} from 'vue-cool-select'
export default {
  name: 'form-entity-select',
  props: ['items', 'type', 'form', 'field', 'input'],
  inject: ['$validator'],
  data() {
    return {
      list: [],
      entity: [],
    }
  },
  async created() {
    if (this.items) {
      this.list = this.items
    } else {
      switch (this.type) {
        case 'seeds':
          this.list = (await this.loadList('seeds')).map(seed => ({
            id: seed._id,
            title: seed.name,
            description: seed.scientific_name,
            picture: seed.images && seed.images.length ? seed.images[0].thumb : '',
          }))
          break;
        case 'users':
          this.list = (await this.loadList('users')).map(user => ({
            id: user._id,
            title: user.name,
            email: user.email,
            description: user.nickname,
            picture: user.image ? user.image.thumb : '',
          }))
          break;
        case 'collectors_groups':
          this.list = (await this.loadList('collectors_groups')).map(collectors_group => ({
            id: collectors_group._id,
            title: collectors_group.name,
            description: this.formatCity(collectors_group.address)
          }))
          break;
        case 'collectors':
          this.list = (await this.loadList('collectors')).map(collector => ({
            id: collector._id,
            title: collector.name,
            description: collector.nickname,
            picture: collector.image ? collector.image.thumb : '',
          }))
          break;
        case 'clients':
          this.list = (await this.loadList('clients')).map(client => ({
            id: client._id,
            title: client.name,
            description: client.nickname,
            picture: client.image ? client.image.thumb : '',
          }))
          break;
        case 'seeds_houses':
          this.list = (await this.loadList('seeds_houses')).map(seeds_house => ({
            id: seeds_house._id,
            title: seeds_house.name,
            description: this.formatCity(seeds_house.address)
          }))
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
