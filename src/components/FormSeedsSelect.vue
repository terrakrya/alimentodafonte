<template>
  <div>
    <div class="seeds-select">
      <b-form-group label="Adicionar semente">
        <cool-select v-if="seeds" v-model="item_form.seed" :arrowsDisableInstantSelection="true" placeholder="Selecione a semente" :items="seeds" item-text="name" item-value="_id" class="col-sm-6" @keypress.13.prevent="addItem">
          <template slot="item" slot-scope="{ item: option }">
            <div style="display: flex; align-items: center;">
              <img v-if="option.images && option.images.length" :src="baseUrl + option.images[0].thumb">
              <div>
                <strong>{{ option.name }}</strong>
                <br>
                <small>{{ option.scientific_name }}</small>
              </div>
            </div>
          </template>
          <template slot="no-data">
            <br>
            <h5 class="text-center">Nenhum item encontrado</h5>
            <br>
          </template>
        </cool-select>
        <div class="col-sm-6">
          <input @keypress.13.prevent="addItem" v-model="item_form.qtd" class="weight" placeholder="Quantidade" type="number" /> Kg
          <b-button class="btn btn-primary fa fa-plus pull-right" @click="addItem()">Adicionar</b-button>
        </div>
        <br>
        <br>
        <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        <loading :loading="isSending" msg="Adicionando semente" />
      </b-form-group>
    </div>
    <div class="entity-select-preview" v-if="seeds && seeds.length && preview && preview.length > 0">
      <table class="table b-table b-table-stacked-md">
        <thead>
          <tr>
            <th>Espécie</th>
            <th>Valor / Kg</th>
            <th>Quantidade</th>
            <th>{{basecalc == 'compensation_collect' ? 'Remuneração' : 'Valor total'}}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item_preview, index) in preview" :key="index">
            <td>
              {{item_preview.seed.name}}
            </td>
            <td>
              {{item_preview.value | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}
            </td>
            <td>
              {{item_preview.qtd}} kg
            </td>
            <td>
              {{item_preview.value * item_preview.qtd | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}
            </td>
            <td class="text-right">
              <b-button v-if="item_preview" class="btn btn-xs btn-danger fa fa-trash" @click="removeItem(index)"></b-button>
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
  props: ['form', 'field', 'basecalc', 'callback'],
  inject: ['$validator'],
  data () {
    return this.emptyForm()
  },
  created () {
    this.list()
    if (this.isEditing()) {
      this.edit()
    }
  },
  computed: {
    preview () {
      if (this.form && this.form[this.field]) {
        return this.form[this.field].map(selected => {
          return this.previewItem(selected)
        }).filter(preview => preview)
      }
      return []
    },
    totalQty () {
      if (this.preview) {
        return this.preview.map((item) => Number(item.qtd)).reduce((a, b) => a + b)
      } else {
        return 0
      }
    },
    totalPrice () {
      if (this.preview) {
        return this.preview.map((item) => Number(item.value) * Number(item.qtd)).reduce((a, b) => a + b)
      } else {
        return 0
      }
    }
  },
  methods: {
    emptyForm () {
      return {
        seeds: [],
        form_field: [],
        item_form: {
          seed: null,
          qtd: null,
          compensation_collect: null,
          price: null,
          wholesale_price: null
        }
      }
    },
    async list () {
      this.seeds = (await this.loadList('seeds'))
    },
    removeItem (index) {
      this.form[this.field] = this.form[this.field].filter((item, i) => i != index)
      if (this.callback) {
        this.callback(this.form[this.field])
      }
    },
    previewItem (item) {
      var seed = this.seeds.find(s => {
        return s._id == item.seed
      })
      return {
        qtd: item.qtd,
        value: item[this.basecalc || 'price'],
        seed: seed
      }
    },
    addItem() {
      if (this.item_form.seed && this.item_form.qtd) {
        var seed = this.seeds.find(s => {
          return s._id == this.item_form.seed
        })
        this.item_form.compensation_collect = seed.compensation_collect
        this.item_form.price = seed.price
        this.item_form.wholesale_price = seed.wholesale_price
        this.form[this.field].push(Object.assign({}, this.item_form))
        this.item_form = this.emptyForm()

        if (this.callback) {
          this.callback(this.form[this.field])
        }
      }
    },
    edit () {
      this.isLoading = true
      if (this.form[this.field]) {
        this.form[this.field]
      }
    }
  },
  components: {
    CoolSelect,
    Loading
  }
};
</script>
