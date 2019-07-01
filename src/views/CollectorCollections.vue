<template>
<div class="collector-stock-ins">
  <breadcrumb :active="'Entregas de '+currentUser.name" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <list-headline name="Pedidos" :filters="filters" />
      <div class="info-content">
        <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        <loading :loading="!stock_ins && !error" msg="Carregando lista de pedidos" />
        <no-item :list="stock_ins" />
        <div v-if="stock_ins && stock_ins.length">
          <b-table stacked="md" :fields="table_fields" :items="stock_ins" :sort-by="'created'" :sort-desc="true" :filter="filters.search">
            <template slot="createdAt" slot-scope="data">
              {{data.item.createdAt | moment("DD/MM/YYYY")}}
              <br>
              Pedido {{data.item.code}}
            </template>
            <template slot="qtd" slot-scope="data">
              <div class="seed_item" v-for="(seed_item, index) in data.item.seed_items" :ref="index" >
                {{seed_item.qtd}} kg de {{seed_item.seed.name}}
              </div>
              <div class="seed_item" v-if="data.item.seed_items.length > 1" >
                <strong>{{data.item.seed_items.map(seed_item => seed_item.qtd).reduce((a,b) => a + b)}} kg total</strong>
              </div>
            </template>
            <template slot="compensation_collect" slot-scope="data">
							{{data.item.seed_items.map(seed_item => seed_item.compensation_collect * seed_item.qtd).reduce((a,b) => a + b) | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}
            </template>
            <!-- eslint-disable-next-line -->
            <template slot="bottom-row" slot-scope="data">
              <td></td>
              <td><strong>{{total_qtd}} Kg</strong></td>
              <td><strong>{{total_compensation_collect | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}</strong></td>
            </template>
          </b-table>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'
import ListHeadline from '@/components/ListHeadline'
import Breadcrumb from '@/components/Breadcrumb'

export default {

  name: 'CollectorCollections',
  data() {
    return {
      filters: {
        search: null
      },
			stock_ins: null,
      table_fields: [{
          key: 'createdAt',
          label: 'ID / Data',
          sortable: true
        },
        {
          key: 'qtd',
          label: 'Quantidade',
          sortable: true
        },
        {
          key: 'compensation_collect',
          label: 'Remuneração total',
          sortable: true
        }
      ]
    }
  },
  created() {
    this.list()
  },
  computed: {
    total_qtd() {
      return this.stock_ins.map(stock_in => {
        return stock_in.seed_items.map(seed_item => seed_item.qtd).reduce((a,b) => a + b)
      }).reduce((a, b) => a + b)
    },
    total_compensation_collect() {
      return this.stock_ins.map(stock_in => {
        return stock_in.seed_items.map(seed_item => seed_item.compensation_collect * seed_item.qtd).reduce((a,b) => a + b)
      }).reduce((a, b) => a + b)
    }
  },
  methods: {
		list() {
      axios.get('collector/stock_ins', {
        params: {
          populate: 'seed_items.seed'
        }
      }).then(response => {
        this.stock_ins = response.data
      }).catch(this.showError)
    },
    remove(id) {
      if (confirm("Tem certeza que deseja excluír?")) {
        axios.delete('stock_ins/' + id).then(() => {
          this.list()
        }).catch(this.showError)
      }
    }
  },
  components: {
    Loading,
    NoItem,
    ListHeadline,
    Breadcrumb
  }

};
</script>
