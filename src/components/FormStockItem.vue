<template>
<div>
  <div class="stock-items row" v-if="this.form.seeds_house && (this.form.collectors_group || this.form.collector)">
    <div class="col-sm-6">
      <b-form-group label="Adicionar semente">
        <cool-select :scrollItemsLimit="10000" :scrollItemsLimitAddAfterScroll="10000" v-if="seeds" v-model="item_form.seed" :arrowsDisableInstantSelection="true" placeholder="Selecione a semente" :items="seeds" item-text="name" item-value="_id"
          @select="seedSelected">
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
      </b-form-group>
    </div>
    <div class="col-sm-3">
      <b-form-group label="Quantidade (Kg) *">
        <b-form-input v-model="item_form.qtd" type="number" step="0.01" lang="nb" min="0" :max="max_qtd" v-validate="'required'" name="qtd" />
        <field-error :msg="veeErrors" field="qtd" />
        <small class="text-muted" v-if="max_qtd > 0">Máximo {{max_qtd}} kg</small>
        <span class="text-danger" v-if="max_qtd == 0">Não existem pedidos pendentes para esta casa/semente</span>
      </b-form-group>
    </div>
    <div class="col-sm-3">
      <b-form-group label="Data da coleta">
        <b-form-input v-model="form.collection_date" type="date" />
      </b-form-group>
    </div>
    <div class="col-sm-9">
      <b-form-group label="Lote *" v-if="lot_filtered_options.length && !item_form.add_new_lot">
        <form-entity-select :items="lot_filtered_options" :form="item_form" field="lot" :validate="'required'" />
        <a @click="newLot" class="pointer">Adicionar novo lote</a>
      </b-form-group>
      <b-form-group label="Novo lote *" v-if="!lot_filtered_options.length || item_form.add_new_lot"
        description="IMPORTANTE: o nome do lote deve conter, na seguinte ordem: sigla da Casa de Sementes (como CAN ou NX) em que está sendo dada a entrada; 3 a 24 letras do nome popular (como jat-mat OU mirindibinha-mat-do-valdo); Ano de coleta (2019); venda Livre (L) ou venda Restrita (R) à finalidade de restauração ecológica.">
        <b-form-input v-model="item_form.new_lot" v-validate="'required'" name="new_lot" />
        <field-error :msg="veeErrors" field="new_lot" />
      </b-form-group>
    </div>
    <div class="col-sm-3 text-center">
      <b-form-group label="">
        <b-button class="btn btn-primary fa fa-plus" @click="addItem()">Adicionar</b-button>
      </b-form-group>
    </div>
    <div class="col-sm-12 text-center" v-if="qtd_error">
      <b-alert variant="danger" show v-html="qtd_error"></b-alert>
    </div>
  </div>
  <br>
  <br>
  <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
  <loading :loading="isSending" msg="Adicionando semente" />
  <div class="entity-select-preview" v-if="seeds && seeds.length && preview && preview.length > 0">
    <table class="table b-table b-table-stacked-md">
      <thead>
        <tr>
          <th>Espécie</th>
          <th>Valor / Kg</th>
          <th>Quantidade</th>
          <th v-if="!basecalc || basecalc == 'price'">Valor (varejo)</th>
          <th v-if="basecalc == 'wholesale_price'">Valor (atacado)</th>
          <th v-if="basecalc == 'compensation_collect'">Remuneração</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item_preview, index) in preview" :key="index">
          <td>
            {{item_preview.seed.name}}
          </td>
          <td>
            {{item_preview.value | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}}
          </td>
          <td>
            {{item_preview.qtd}} kg
          </td>
          <td>
            {{item_preview.value * item_preview.qtd | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}}
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
            <strong>{{totalPrice | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}}</strong>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
  <pre>{{item_form}}</pre>
</div>
</template>

<script>
import axios from 'axios'
import {
  CoolSelect
} from 'vue-cool-select'
import Loading from '@/components/Loading'
import FormEntitySelect from '@/components/FormEntitySelect'
import FieldError from '@/components/FieldError'
import utils from '@/views/utils'

export default {
  name: 'form-entities-select',
  props: ['form', 'field', 'basecalc', 'callback'],
  inject: ['$validator'],
  data() {
    return this.emptyForm()
  },
  created() {
    this.list()

    if (this.isEditing()) {
      this.edit()
    }
  },
  computed: {
    preview() {
      if (this.form && this.form[this.field]) {
        return this.form[this.field].map(selected => {
          return this.previewItem(selected)
        }).filter(preview => preview)
      }
      return []
    },
    totalQty() {
      if (this.preview) {
        return this.preview.map((item) => parseFloat(item.qtd)).reduce((a, b) => a + b)
      } else {
        return 0
      }
    },
    totalPrice() {
      if (this.preview) {
        return this.preview.map((item) => parseFloat(item.value) * parseFloat(item.qtd)).reduce((a, b) => a + b)
      } else {
        return 0
      }
    }
  },
  methods: {
    emptyForm() {
      return {
        seeds: [],
        collectors_requests: [],
        stock_ins: [],
        seed: null,
        form_field: [],
        lots: [],
        lot_filtered_options: [],
        max_qtd: null,
        qtd_error: null,
        item_form: {
          seed: null,
          qtd: null,
          compensation_collect: null,
          price: null,
          wholesale_price: null,
          lot: null,
          new_lot: null,
          add_new_lot: false,
        }
      }
    },
    async list() {
      this.seeds = (await this.loadList('seeds')).sort(function(a, b) {
        return a.name.localeCompare(b.name);
      })

      axios.get('lots').then(response => {
        this.lots = response.data
      }).catch(this.showError)

      axios.get('collectors_requests', {
        params: {
          populate: 'seed_items.seed'
        }
      }).then(response => {
        this.collectors_requests = response.data
      }).catch(this.showError)

      axios.get('stock_in').then(response => {
        this.stock_ins = response.data
      }).catch(this.showError)

    },
    removeItem(index) {
      this.form[this.field] = this.form[this.field].filter((item, i) => i != index)
      if (this.callback) {
        this.callback(this.form[this.field])
      }
    },
    previewItem(item) {
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
        var currentItem = this.form[this.field].find(s => {
          return s.seed == this.item_form.seed
        })

        if (currentItem) {
          currentItem.qtd = parseFloat(this.item_form.qtd) + parseFloat(currentItem.qtd)
        } else {
          var seed = this.seeds.find(s => {
            return s._id == this.item_form.seed
          })
          this.item_form.compensation_collect = seed.compensation_collect
          this.item_form.price = seed.price
          this.item_form.wholesale_price = seed.wholesale_price
          this.form[this.field].push(Object.assign({}, this.item_form))
        }

        this.item_form = this.emptyForm()

        if (this.callback) {
          this.callback(this.form[this.field])
        }
      }
    },
    edit() {
      this.isLoading = true
      if (this.form[this.field]) {
        this.form[this.field]
      }
    },
    seedSelected() {
      console.log(this.item_form.seed);
      if (this.item_form.seed) {
        this.seed = this.seeds.find(seed => {
          return seed._id == this.item_form.seed
        })

      }
      this.filterOptions()
    },
    filterOptions() {
      console.log('filterOptions');
      this.validateQty()
      this.item_form.add_new_lot = false
      if (this.item_form.seed && this.form.seeds_house) {
        this.lot_filtered_options = this.lots.filter(lot => {
          return lot.seed == this.item_form.seed && lot.seeds_house == this.form.seeds_house
        }).map(lot => ({
          id: lot._id,
          title: lot.code
        }))
        if (!this.lot_filtered_options.length) {
          this.item_form.new_lot = utils.generateCode([this.$parent.seeds_house_name, this.seed.name])
        }
        this.item_form.lot = null
      }
    },
    validateQty() {
      this.max_qtd = null
      this.qtd_error = ''
      this.error = null
      if ((this.form.collectors_group || this.form.collector) && this.item_form.seed && this.collectors_requests) {
        let collectors_requests = this.collectors_requests.filter(cr => {
          let collector = this.form.collector
          let group = this.form.collectors_group
          return (
            (
              (collector && cr.collector && cr.collector == collector) ||
              (group && cr.collectors_group && cr.collectors_group == group)
            ) &&
            cr.seed_items && cr.seed_items.find(s => (s.seed._id == this.item_form.seed))
          )
        })
        if (collectors_requests && collectors_requests.length) {

          let stock_ins = this.stock_ins.filter(stock_in => {
            let collector = this.form.collector
            let group = this.form.collectors_group
            return (
              (
                (collector && stock_in.collector && stock_in.collector == collector) ||
                (group && stock_in.collectors_group && stock_in.collectors_group == group)
              ) &&
              stock_in.seed == this.item_form.seed && stock_in.seeds_house == this.form.seeds_house
            )
          }).map(stock_in => stock_in.qtd)

          let stock_ins_total = 0
          if (stock_ins.length) {
            stock_ins_total = parseFloat(stock_ins.reduce((a, b) => a + b))
          }

          let seed_items = collectors_requests.map(collectors_request => collectors_request.seed_items.find(seed_item => (seed_item.seed._id == this.item_form.seed)))
          let collectors_request_total = parseFloat(seed_items.map(seed_item => this.sumQtd(seed_item.qtd)).reduce((a, b) => a + b))

          this.max_qtd = collectors_request_total - stock_ins_total

          if (this.max_qtd < parseFloat(this.item_form.qtd)) {
            this.qtd_error = 'Quantidade ' + this.item_form.qtd + ' kg maior que a solicitada nos pedidos: ' + this.max_qtd + ' kg'
            return false
          } else {
            return true
          }
        } else {
          this.qtd_error = 'Não existe registro de pedido dessa semente para este coletor/grupo'
          return false
        }
      } else {
        if (!this.form.collectors_group && !this.form.collector) {
          this.error = 'Selecione um grupo ou coletor'
        }
        return false
      }
    },
    newLot() {
      this.item_form.add_new_lot = true
      this.item_form.lot = null
      this.item_form.new_lot = utils.generateCode([this.$parent.seeds_house_name, this.seed.name])
    },
  },
  components: {
    CoolSelect,
    FieldError,
    FormEntitySelect,
    Loading
  }
};
</script>
