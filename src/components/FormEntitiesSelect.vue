<template>
<div>
  <cool-select :scrollItemsLimit="10000" :scrollItemsLimitAddAfterScroll="10000" :arrowsDisableInstantSelection="true" placeholder="Busque pelo nome clique para adicionar à lista" v-model="entity" :items="list" item-text="title" @select="addItem()"
    inputForTextClass="form-control">
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
    <template slot="no-data">
      <br>
      <h5 class="text-center">Nenhum item encontrado</h5>
      <br>
    </template>
  </cool-select>
  <div class="entity-select-preview" v-if="preview && preview.length > 0">
    <br>
    <h5> Selecionados: </h5>
    <div class="list-group">
      <table class="table table-hover">
        <tbody>
          <tr v-for="(item_preview, index) in preview" :key="index">
            <td><img class="table-image" v-if="item_preview && item_preview.picture" :src="baseUrl + item_preview.picture" /></td>
            <td><span v-if="item_preview">{{item_preview.title}}</span></td>
            <td>
              <div class="btn-group btn-group-sm">
                <a v-if="item_preview" @click="removeItem(item_preview.id)" class="btn btn-danger pull-right">
                  <i class="material-icons">close</i>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
  props: ['items', 'type', 'form', 'field'],
  inject: ['$validator'],
  data() {
    return {
      list: [],
      entity: null
    }
  },
  async created() {
    if (this.items) {
      this.list = this.items.sort(function(a, b) {
        return a.title.localeCompare(b.title);
      })
    } else {
      switch (this.type) {
        case 'organizations':
          this.list = (await this.loadList('organizations')).map(organization => ({
            id: organization._id,
            title: organization.name,
            description: organization.description,
            picture: organization.images && organization.images.length ? organization.images[0].thumb : '',
          })).sort(function(a, b) {
            return a.title.localeCompare(b.title);
          })
          break;
      }
    }
  },
  computed: {
    preview() {
      if (this.form && this.form[this.field] && this.list) {
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
      return this.list.find(i => {
        return i.id == id
      })
    }
  },
  components: {
    CoolSelect
  }
};
</script>
