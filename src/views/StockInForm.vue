<template>
<div class="stock-in-form">
  <breadcrumb :links="[['Estoque', '/estoque']]" active="Entrada de estoque" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <h1>
        Cadastrar entrada
      </h1>
      <br>
      <loading :loading="isLoading" />
      <b-form @submit.prevent="save" v-if="!isLoading">
        <div class="row">
          <div class="col-sm-6">
            <b-form-group label="Casa de sementes *">
              <form-entity-select :input="seedsHouseSelected" type="seeds_houses" :form="form" field="seeds_house" :validate="'required'" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="Semente *">
              <form-entity-select :input="seedSelected" type="seeds" :form="form" field="seed" :validate="'required'" />
            </b-form-group>
          </div>
        </div>
        <form-group-collector :form="form" />
        <div class="row">
          <div class="col-sm-4">
            <b-form-group label="Lote *" v-if="lot_filtered_options.length && !add_new_lot">
              <form-entity-select :items="lot_filtered_options" :form="form" field="lot" :validate="'required'" />
              <a @click="newLot" class="pull-right pointer">Adicionar novo lote</a>
            </b-form-group>
            <b-form-group label="Novo lote *" v-if="!lot_filtered_options.length || add_new_lot" description="Deve conter as iniciais da casa, semente e ano. Exemplo: CAN-JAT-MAT-2019-Livre = Casa de Sementes de Canarana, Jatobá-da-mata, coletado em 2019, livre para qualquer comércio. ">
              <b-form-input v-model="new_lot" v-validate="'required'" name="new_lot" />
              <field-error :msg="veeErrors" field="new_lot" />
            </b-form-group>
          </div>
          <div class="col-sm-4">
            <b-form-group label="Quantidade (Kg) *">
              <b-form-input v-model="form.qtd" type="number" step="0.01" lang="nb" min="0" :max="max_qtd" v-validate="'required'" name="qtd" />
              <field-error :msg="veeErrors" field="qtd" />
              <small class="text-muted" v-if="max_qtd > 0">Máximo {{max_qtd}} kg</small>
              <span class="text-danger" v-if="max_qtd == 0">Não existem pedidos pendentes para esta casa/semente</span>
            </b-form-group>
          </div>
          <div class="col-sm-4">
            <b-form-group label="Data da coleta">
              <b-form-input v-model="form.collection_date" type="date" />
            </b-form-group>
          </div>
        </div>
        <div class="row" v-if="qtd_error">
          <div class="col-sm-12 text-center">
            <b-alert variant="danger" show v-html="qtd_error"></b-alert>
          </div>
        </div>
        <form-submit :errors="error" :sending="isSending" />
      </b-form>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormGroupCollector from '@/components/FormGroupCollector'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import utils from '@/views/utils'

export default {

  name: 'StockInForm',

  data() {

    return {
      qtd_error: null,
      lot_filtered_options: [],
      new_lot: null,
      add_new_lot: false,
      price: null,
      collectors_requests: [],
      stock_ins: [],
      lots: [],
      seed_name: '',
      seeds_house_name: '',
      max_qtd: null,
      form: {
        price: 0,
        qtd: 0,
        collection_date: "",
        seeds_house: null,
        collectors_group: null,
        collector: null,
        seed: null,
        lot: null
      }
    }
  },
  created() {
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

    axios.get('lots').then(response => {
      this.lots = response.data
    }).catch(this.showError)

  },
  methods: {
    edit(id) {
      this.isLoading = true
      axios.get('stock_in/' + id).then(response => {
        var data = response.data
        this.apiDataToForm(this.form, data)
        this.isLoading = false
      }).catch(this.showError);
    },
    save() {
      this.$validator.validate().then(isValid => {
        if (isValid && this.validateQty()) {
          this.isSending = true
          this.error = false

          if (this.form.qtd) {
            this.form.qtd = this.form.qtd

            if (this.price) {
              this.form.price = this.price * this.form.qtd
            }
          }

          if (!this.form.lot && this.new_lot) {
            axios.post('lots', {
              code: this.new_lot,
              seeds_house: this.form.seeds_house,
              seed: this.form.seed,
            }).then(resp => {
              this.form.lot = resp.data._id
              this.saveItem()
            }).catch(this.showError);
          } else {
            this.saveItem()
          }
        }
      })
    },
    saveItem() {
      axios({
        method: 'POST',
        url: 'stock_in',
        data: this.form
      }).then(resp => {
        var stock_in = resp.data
        if (stock_in && stock_in._id) {
          this.isSending = false
          this.$router.replace('/estoque')
        }
        this.isSending = false
      }).catch(this.showError)
    },
    seedSelected(seed) {
      if (seed) {
        this.price = seed.compensation_collect
        this.seed_name = seed.title
      }
      this.filterOptions()
    },
    seedsHouseSelected(seeds_house) {
      if (seeds_house) {
        this.seeds_house_name = seeds_house.title
      }
      this.filterOptions()
    },
    newLot() {
      this.add_new_lot = true
      this.form.lot = null
      this.new_lot = utils.generateCode([this.seeds_house_name, this.seed_name])
    },
    filterOptions() {
      this.validateQty()
      this.add_new_lot = false
      if (this.form.seed && this.form.seeds_house) {
        this.lot_filtered_options = this.lots.filter(lot => {
          return lot.seed == this.form.seed && lot.seeds_house == this.form.seeds_house
        }).map(lot => ({
          id: lot._id,
          title: lot.code
        }))
        if (!this.lot_filtered_options.length) {
          this.new_lot = utils.generateCode([this.seeds_house_name, this.seed_name])
        }
        this.form.lot = null
      }
    },
    validateQty() {
      this.max_qtd = null
      this.qtd_error = ''
      this.error = null
      if ((this.form.collectors_group || this.form.collector) && this.form.seed && this.collectors_requests) {
        let collectors_requests = this.collectors_requests.filter(cr => {
          let collector = this.form.collector
          let group = this.form.collectors_group
          return (
            (
              (collector && cr.collector && cr.collector == collector) ||
              (group && cr.collectors_group && cr.collectors_group == group)
            ) &&
            cr.seed_items && cr.seed_items.find(s => (s.seed._id == this.form.seed))
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
              stock_in.seed == this.form.seed && stock_in.seeds_house == this.form.seeds_house
            )
          }).map(stock_in => stock_in.qtd)

          let stock_ins_total = 0
          if (stock_ins.length) {
            stock_ins_total = parseFloat(stock_ins.reduce((a, b) => a + b))
          }

          let seed_items = collectors_requests.map(collectors_request => collectors_request.seed_items.find(seed_item => (seed_item.seed._id == this.form.seed)))
          let collectors_request_total = parseFloat(seed_items.map(seed_item => seed_item.qtd).reduce((a, b) => a + b))

          this.max_qtd = collectors_request_total - stock_ins_total

          if (this.max_qtd < parseFloat(this.form.qtd)) {
            this.qtd_error = 'Quantidade ' + this.form.qtd + ' kg maior que a solicitada nos pedidos: ' + this.max_qtd + ' kg'
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
    }
  },
  watch: {
    'form.collector': function() {
      this.validateQty()
    },
    'form.collectors_group': function() {
      this.validateQty()
    }
  },
  components: {
    Breadcrumb,
    Loading,
    FormEntitySelect,
    FormGroupCollector,
    FormSubmit,
    FieldError,
  }

};
</script>
