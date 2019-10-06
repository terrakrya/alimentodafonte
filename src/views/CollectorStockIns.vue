<template>
<div class="collector-stock-ins">
  <breadcrumb :active="'Entregas de '+currentUser.name" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <list-headline name="Entregas" :filters="filters" />
      <div class="info-content">
        <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        <loading :loading="!stock_ins && !error" msg="Carregando lista de pedidos" />
        <no-item :list="stock_ins" />
        <div v-if="stock_ins && stock_ins.length">
          <b-table stacked="md" :fields="table_fields" :items="stock_ins" :sort-by="'created'" :sort-desc="true" :filter="filters.search">
            <template slot="createdAt" slot-scope="data">
              {{data.item.createdAt | moment("DD/MM/YYYY")}}
            </template>
            <template slot="seeds_house.name" slot-scope="data">
              {{data.value}}
            </template>
            <template slot="seed.name" slot-scope="data">
              {{data.value}}
            </template>
            <template slot="qtd" slot-scope="data">
              {{data.value| kg}}
            </template>
            <template slot="compensation_collect" slot-scope="data">
							{{data.value * data.item.qtd | moeda }}
            </template>
            <!-- eslint-disable-next-line -->
            <template slot="bottom-row" slot-scope="data">
              <td></td>
              <td></td>
              <td></td>
              <td><strong>{{total_qtd| kg}}</strong></td>
              <td><strong>{{total_compensation_collect | moeda}}</strong></td>
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

  name: 'CollectorStockIns',
  data() {
    return {
      filters: {
        search: null
      },
			stock_ins: null,
      table_fields: [{
          key: 'createdAt',
          label: 'Data da Entrega',
          sortable: true
        },
        {
          key: 'seeds_house.name',
          label: 'Casa de sementes',
          sortable: true
        },
        {
          key: 'seed.name',
          label: 'Semente',
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
        return stock_in.qtd
      }).reduce((a, b) => a + b)
    },
    total_compensation_collect() {
      return this.stock_ins.map(stock_in => {
        return stock_in.compensation_collect * stock_in.qtd
      }).reduce((a, b) => a + b)
    }
  },
  methods: {
		list() {
      axios.get('collector/stock_ins', {
        params: {
          populate: 'seeds_house seed'
        }
      }).then(response => {
        this.stock_ins = response.data
      }).catch(this.showError)
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
