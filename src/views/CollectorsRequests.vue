<template>
<div class="collectors-requests">
  <breadcrumb active="Pedidos para coletores" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <list-headline name="Pedidos para coletores" addUrl="/cadastrar-pedido-para-coletores" :filters="filters" />
      <div class="info-content">
        <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        <loading :loading="!collectors_requests && !error" msg="Carregando lista de pedidos" />
        <no-item :list="collectors_requests" />
        <div v-if="collectors_requests && collectors_requests.length">
          <b-table stacked="md" :fields="table_fields" :items="collectors_requests" :sort-by="'created'" :sort-desc="true" :filter="filters.search">
            <template slot="createdAt" slot-scope="data">
              <router-link v-if="data.item.createdAt" :to="'/pedido-para-coletores/'+ data.item._id">
                {{data.item.createdAt | moment("DD/MM/YYYY")}}
                <br>
                Pedido {{data.item.code}}
              </router-link>
            </template>
            <template slot="collector" slot-scope="data">
              <router-link v-if="data.item.collectors_group" :to="'/grupo-de-coletores/'+ data.item.collectors_group._id"> {{data.item.collectors_group.name}} </router-link>
              <router-link v-if="data.item.collector" :to="'/coletor/'+ data.item.collector._id"> {{data.item.collector.name}} </router-link>
            </template>
            <template slot="qtd" slot-scope="data">
              {{data.item.seed_items.map(seed_item => seed_item.qtd).reduce((a,b) => a + b)}} kg
            </template>
            <template slot="price" slot-scope="data">
							{{data.item.seed_items.map(seed_item => seed_item.price * seed_item.qtd).reduce((a,b) => a + b) | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}
            </template>
						<template slot="actions" slot-scope="data">
              <router-link :to="'/editar-pedido-para-coletores/'+ data.item._id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
              <a @click="remove(data.item._id)" class="fa fa-trash btn btn-danger btn-xs"></a>
            </template>
            <!-- eslint-disable-next-line -->
            <template slot="bottom-row" slot-scope="data">
              <td />
              <td><strong> Total</strong></td>
              <td><strong>{{total_qtd}} Kg</strong></td>
              <td><strong>{{total_price | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}</strong></td>
              <td />
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

  name: 'CollectorsRequests',
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
          key: 'collector',
          label: 'Grupo / Coletor',
          sortable: true
        },
        {
          key: 'qtd',
          label: 'Quantidade',
          sortable: true
        },
        {
          key: 'price',
          label: 'Total',
          sortable: true
        },
        {
          key: 'actions',
          label: 'Ações',
          'class': 'actions'
        },
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
    total_price() {
      return this.collectors_requests.map(collectors_request => {
        return collectors_request.seed_items.map(seed_item => seed_item.price * seed_item.qtd).reduce((a,b) => a + b)
      }).reduce((a, b) => a + b)
    }
  },
  methods: {
		list() {
      axios.get('collectors_requests', {
        params: {
          populate: 'collectors_group collector'
        }
      }).then(response => {
        this.collectors_requests = response.data
      }).catch(this.showError)
    },
    remove(id) {
      if (confirm("Tem certeza que deseja excluír?")) {
        axios.delete('collectors_requests/' + id).then(() => {
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
