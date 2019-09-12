<template>
  <div class="filter-entity-select">
    <cool-select :arrowsDisableInstantSelection="true" :placeholder="placeholder" v-model="form[field]" :items="list" item-text="title" :itemValue="itemValue" @select="callback()">
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
