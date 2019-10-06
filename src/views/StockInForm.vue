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
          <div class="col-sm-12">
            <b-form-group label="Casa de sementes *">
              <form-entity-select :input="seedsHouseSelected" type="seeds_houses" :form="form" field="seeds_house" :validate="'required'" />
            </b-form-group>
          </div>
        </div>
        <form-group-collector :form="form" v-if="this.form.seeds_house" />
        <div class="row">
          <div class="col-sm-12">
            <form-stock-item :form="form" field="stock_items" />
          </div>
        </div>
        <form-submit :errors="error" :sending="isSending" v-if="this.form.seeds_house && this.form.stock_items && this.form.stock_items.length" />
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
import FormStockItem from '@/components/FormStockItem'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import utils from '@/views/utils'

export default {

  name: 'StockInForm',

  data() {

    return {
      seeds_house_name: '',
      form: {
        seeds_house: null,
        collectors_group: '5d6927111ba0621391fcb086',
        collector: null,
        stock_items: [],
        createdBy: this.$store.state.currentUser._id
      }
    }
  },
  created() {
    axios.get('stock/fix_stock_items').then(response => {
      console.log(response);
    }).catch(this.showError);


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

      this.$validator.validate().then(async isValid => {

        if (isValid) {
          this.isSending = true
          await Promise.all(this.form.stock_items.map (async (stock_item, i) => {
            if (!stock_item.lot && stock_item.new_lot) {
              var lot = await axios.post('lots', {
                code: stock_item.new_lot,
                seeds_house: this.form.seeds_house,
                seed: stock_item.seed,
              })
              this.form.stock_items[i].lot = lot.data._id
            }
          })).catch(this.showError)
          this.saveItem()
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
    seedsHouseSelected(seeds_house) {
      console.log('seedsHouseSelected');
      if (seeds_house) {
        this.seeds_house_name = seeds_house.title
      }
      // TODO limpar tudo quando mudar a casa de sementes
      // this.filterOptions()
    }
  },
  watch: {
    'form.collector': function() {
      this.stock_items = []
    },
    'form.collectors_group': function() {
      this.stock_items = []
    }
  },
  components: {
    Breadcrumb,
    Loading,
    FormEntitySelect,
    FormGroupCollector,
    FormStockItem,
    FormSubmit,
    FieldError,
  }

};
</script>
