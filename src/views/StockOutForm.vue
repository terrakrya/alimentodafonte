<template>
<div class="stock-in-form">
  <breadcrumb :links="[['Estoque', '/estoque']]" active="Saída de estoque" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <h1>
        Cadastrar saída
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
        <div class="row" v-if="lot_filtered_options.length">
          <div class="col-sm-6">
            <b-form-group label="Lote *">
              <form-entity-select :items="lot_filtered_options" :form="form" field="lot" :validate="'required'" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="Quantidade (Kg) *" >
              <b-form-input v-model="form.qtd" type="number" step="0.01" lang="nb" min="0" :max="max_lot" v-validate="'required'" name="qtd" />
              <field-error :msg="veeErrors" field="qtd" />
              <small class="text-muted" v-show="max_lot">Máximo de {{max_lot}} kg para este lote</small>
            </b-form-group>
          </div>
        </div>
        <div class="row" v-if="lot_filtered_options.length">
          <div class="col-sm-6">
            <b-form-group label="Comprador">
              <form-entity-select type="clients" :form="form" field="buyer" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="Modos de saída *">
              <b-form-radio-group v-model="form.out_mode" :options="modos_de_saida" stacked v-validate="'required'" name="out_mode" />
              <field-error :msg="veeErrors" field="out_mode" />
            </b-form-group>
          </div>
        </div>
        <div class="row" v-if="form.seeds_house && form.seed">
          <div class="col-sm-12">
            <no-item :list="lot_filtered_options" msg="Nenhum lote encontrado para esta casa/semente" />
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
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import modos_de_saida from '@/data/modos-de-saida.json'
import NoItem from '@/components/NoItem'

export default {

  name: 'StockOutForm',

  data() {

    return {
      lot_filtered_options: [],
      lot_options: [],
      price: null,
      modos_de_saida: modos_de_saida,
      form: {
        price: 0,
        out_mode: null,
        qtd: 0,
        seeds_house: null,
        seed: null,
        buyer: null,
        lot: null
      }
    }
  },
  created() {
    axios.get('lots', {
      params: {
        populate: 'stock_ins stock_outs'
      }
    }).then(response => {
      this.lots = response.data
    }).catch(this.showError)
  },
  computed: {
    max_lot () {
      if (this.lots && this.form.lot) {
        var lot = this.lots.find(lot => { return lot._id == this.form.lot })
        var stock_ins_total = lot.stock_ins.map(stock_in => stock_in.qtd)
        var stock_outs_total = lot.stock_outs.map(stock_out => stock_out.qtd)
        if (stock_ins_total.length > 0) {
          if (stock_outs_total.length > 0) {
            return stock_ins_total.reduce((a, b) => a + b) + stock_outs_total.reduce((a, b) => a + b)
          } else {
            return stock_ins_total.reduce((a, b) => a + b)
          }
        }
      }
      return 0
    }
  },
  methods: {
    save() {
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.isSending = true
          this.error = false

          if (this.form.qtd) {
            if (this.form.qtd > 0) {
              this.form.qtd = this.form.qtd * -1
            }
            if (this.price) {
              this.form.price = this.price * this.form.qtd
            }
          }

          this.saveItem()
        }
      })
    },
    saveItem() {
      axios({
        method: 'POST',
        url: 'stock_out',
        data: this.form
      }).then(resp => {
        var stock_out = resp.data
        if (stock_out && stock_out._id) {
          this.isSending = false
          this.$router.replace('/estoque')
        }
        this.isSending = false
      }).catch(this.showError)
    },
    seedSelected(seed) {
      if (seed) {
        this.price = parseFloat(seed.compensation_collect)
        this.filterOptions()
      }
    },
    seedsHouseSelected() {
      this.filterOptions()
    },
    filterOptions() {
      if (this.form.seed && this.form.seeds_house) {
        this.lot_filtered_options = this.lots.filter(lot => {
          return lot.seed == this.form.seed && lot.seeds_house == this.form.seeds_house
        }).map(lot => ({
          id: lot._id,
          title: lot.code
        }))
        this.form.lot = null
      }
    },
  },
  components: {
    Breadcrumb,
    Loading,
    FormEntitySelect,
    FormSubmit,
    FieldError,
    NoItem
  }

};
</script>
