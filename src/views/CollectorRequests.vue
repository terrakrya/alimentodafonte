<template>
<div class="collector-requests">
  <breadcrumb :active="'Pedidos para '+currentUser.name" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <list-headline name="Pedidos" :filters="filters" />
      <div class="info-content">
        <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        <loading :loading="!collectors_requests && !error" msg="Carregando lista de pedidos" />
        <no-item :list="collectors_requests" />
        <div v-if="collectors_requests && collectors_requests.length">
          <b-table stacked="md" :fields="table_fields" :items="collectors_requests" :sort-by="'created'" :sort-desc="true" :filter="filters.search">
            <template slot="seed" slot-scope="data">
              {{data.value.name}}
            </template>
            <template slot="qtd" slot-scope="data">
              {{data.value | currency('', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}} kg
            </template>
            <template slot="qtd_delivered" slot-scope="data">
              {{data.value | currency('', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}} kg
            </template>
            <template slot="qtd_remaining" slot-scope="data">
              {{data.value | currency('', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}} kg
            </template>
            <template slot="compensation_collect" slot-scope="data">
							{{data.item.compensation_collect * data.item.qtd | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}}
            </template>
            <!-- eslint-disable-next-line -->
            <template slot="bottom-row" slot-scope="data">
              <td></td>
              <td><strong>{{total_qtd | currency('', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}} kg</strong></td>
              <td><strong>{{total_qtd_delivered | currency('', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}} kg</strong></td>
              <td><strong>{{total_qtd_remaining | currency('', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}} kg</strong></td>
              <td><strong>{{total_compensation_collect | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}}</strong></td>
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

  name: 'CollectorRequests',
  data() {
    return {
      filters: {
        search: null
      },
			collectors_requests: null,
      table_fields: [
        {
          key: 'seed',
          label: 'Semente',
          sortable: true
        },
        {
          key: 'qtd',
          label: 'Pedido',
          sortable: true
        },
        {
          key: 'qtd_delivered',
          label: 'Entregue',
          sortable: true
        },
        {
          key: 'qtd_remaining',
          label: 'Restante',
          sortable: true
        },
        {
          key: 'compensation_collect',
          label: 'Remuneração total do pedido',
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
      return this.collectors_requests.map(collectors_request => {
        return collectors_request.qtd
      }).reduce((a, b) => a + b)
    },
    total_qtd_delivered() {
      return this.collectors_requests.map(collectors_request => {
        return collectors_request.qtd_delivered
      }).reduce((a, b) => a + b)
    },
    total_qtd_remaining() {
      return this.collectors_requests.map(collectors_request => {
        return collectors_request.qtd_remaining
      }).reduce((a, b) => a + b)
    },
    total_compensation_collect() {
      return this.collectors_requests.map(collectors_request => {
        return collectors_request.compensation_collect * collectors_request.qtd
      }).reduce((a, b) => a + b)
    }
  },
  methods: {
		list() {
      axios.get('collector/requests', {
        params: {
          populate: 'seed_items.seed'
        }
      }).then(response => {
        this.collectors_requests = response.data
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
