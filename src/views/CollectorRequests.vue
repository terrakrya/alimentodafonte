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
            <template slot="createdAt" slot-scope="data">
              {{data.item.createdAt | moment("DD/MM/YYYY")}}
              <br>
              Pedido {{data.item.code}}
            </template>
            <template slot="qtd" slot-scope="data">
              <div class="seed_item" v-for="(seed_item, index) in data.item.seed_items" :key="index" >
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

  name: 'CollectorRequests',
  data() {
    return {
      filters: {
        search: null
      },
			collectors_requests: null,
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
      return this.collectors_requests.map(collectors_request => {
        return collectors_request.seed_items.map(seed_item => seed_item.qtd).reduce((a,b) => a + b)
      }).reduce((a, b) => a + b)
    },
    total_compensation_collect() {
      return this.collectors_requests.map(collectors_request => {
        return collectors_request.seed_items.map(seed_item => seed_item.compensation_collect * seed_item.qtd).reduce((a,b) => a + b)
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
