<template>
  <div>  
    <div class="seeds-select">
      <b-form-group label="Adicionar semente">
        <cool-select v-if="seeds" v-model="seed_form[fieldseed][0].target_id" :arrowsDisableInstantSelection="true" placeholder="Selecione a semente" :items="seeds" item-text="title" item-value="id" class="col-sm-6">
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
        <div class="col-sm-6">
          <input v-model="seed_form[fieldextra][0].value" class="weight" placeholder="Quantidade" type="number" /> Kg
          <b-button class="btn btn-primary fa fa-plus pull-right" @click="addSeed()">Adicionar</b-button>
        </div>
        <br>
        <br>
        <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        <loading :loading="sending" msg="Adicionando semente" />
      </b-form-group>             
    </div>
    <div class="entity-select-preview" v-if="preview && preview.length > 0">
      <table class="table b-table b-table-stacked-md">
        <thead>
          <tr>
            <th>Espécie</th>
            <th>Valor / Kg</th>
            <th>Quantidade</th>
            <th>Valor total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item_preview, index) in preview" :key="index">
            <td>
              {{item_preview.name}}
            </td>
            <td>
              {{item_preview.price | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}
            </td>
            <td>
              {{item_preview.extra | currency('', 0, { thousandsSeparator: '' })}} kg
            </td>
            <td>
              {{item_preview.price * item_preview.extra | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}
            </td>
            <td class="text-right">
              <b-button v-if="item_preview" class="btn btn-xs btn-danger fa fa-trash" @click="removeItem(item_preview.id)"></b-button>
            </td>
          </tr>
          <tr class="b-table-bottom-row">
            <td></td>
            <td text-right>
              <strong>Totais:</strong>
            </td>
            <td>
              <strong>{{totalQty}} kg</strong>
            </td>
            <td>
              <strong>{{totalPrice | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}</strong>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { CoolSelect } from 'vue-cool-select'
import Loading from '@/components/Loading'

export default {
  name: 'form-entities-select',
  props: ['form', 'field', 'fieldtype', 'parent', 'fieldseed', 'fieldextra', 'seeds'],
  inject: ['$validator'],
  data () {
    var seed_form = {
        type: [{ target_id: this.fieldtype }],
        parent_id: [{ value: this.parent }],
        parent_type: [{ value: "node" }],
        parent_field_name: [{ value: this.field }]
      }   
    seed_form[this.fieldseed] = [{ target_id: '' }]
    seed_form[this.fieldextra] = [{ value: '' }]

    return { 
      error: false,      
      sending: false,      
      items: [],
      seed_form: seed_form
    }
  },
  created () {
    if (this.isEditing()) {
      this.edit()
    }
  },
  computed: {
    preview () {
      if (this.form && this.form[this.field] && this.items) {
        return this.form[this.field].map(selected => {
          return this.getItem(selected.target_id)
        }).filter(preview => preview)
      } 
      return []
    },
    totalQty () {
      if (this.preview) {
        return this.preview.map((item) => Number(item.extra)).reduce((a, b) => a + b)
      } else {
        return 0
      }
    },
    totalPrice () {
      if (this.preview) {
        return this.preview.map((item) => Number(item.price) * Number(item.extra)).reduce((a, b) => a + b)
      } else {
        return 0
      }
    }
  },
  methods: {
    addSeed () {
      this.sending = true
      this.error = false

      axios({
        method: 'POST',
        url: '/entity/paragraph?_format=json',
        data: this.seed_form
      }).then((response) => {
        var paragraph = response.data
        this.form[this.field].push({ target_id: paragraph.id[0].value, target_revision_id: paragraph.revision_id[0].value })

        this.addItem(paragraph)
        this.sending = false
      }).catch(error => { this.error = error.message; this.sending = false })
    },

    removeItem (id) {
      this.form[this.field] = this.form[this.field].filter(item => (item.target_id != id))
    }, 
    getItem (id) {
      return this.items.find(i => {
        return i.id == id
      })
    },
    addItem(paragraph) {
      if (this.seeds) {
        var seed = this.seeds.find(s => {
          return s.id == paragraph[this.fieldseed][0].target_id
        })
        this.items.push({ 
          id: paragraph.id[0].value, 
          name: seed.title, 
          extra: paragraph[this.fieldextra][0].value,
          price: seed.price 
        })
      }
    },
    edit () {
      this.loading = true
      if (this.form[this.field]) {
        this.form[this.field].forEach(item => {
          axios.get('entity/paragraph/' + item.target_id + '?_format=json').then(response => {
            this.addItem(response.data)
          }).catch(error => { this.error = error.message; this.loading = false });
        })        
      }
    }
  },
  components: {
    CoolSelect,
    Loading
  }
};
</script>
