<template>
	<div class="orders">
		<breadcrumb active="Encomendas" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Encomendas" addUrl="/cadastrar-encomenda" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!orders && !error" msg="Carregando lista de encomendas" />
					<no-item :list="orders" />
					<div v-if="orders && orders.length">
						<b-table stacked="md" :fields="table_fields" :items="orders" :sort-by="'date_receiving'" :sort-desc="true" :filter="filters.search">
							<template slot="date_receiving" slot-scope="data">
								<router-link :to="'/encomenda/'+ data.item._id">
									Encomenda {{data.item.code}}
									<br>
									<span v-if="data.item.date_receiving">{{data.item.date_receiving | moment("DD/MM/YYYY")}}</span>
								</router-link>
							</template>
							<template slot="client" slot-scope="data">
								<router-link v-if="data.item.client" :to="'/cliente/'+ data.item.client._id">{{data.item.client.name}}</router-link>
								<small v-if="data.item.restored_area">{{data.item.restored_area}} hectares</small>
							</template>
							<template slot="total" slot-scope="data">
								<span v-if="data.item.seed_items && data.item.seed_items.length">{{data.item.seed_items.map(seed_item => seed_item.qtd * (data.item.purchase_type == 'Atacado' ? seed_item.wholesale_price : seed_item.price)).reduce((a,b) => a + b) | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}</span>
								<small v-if="data.item.purchase_type"><br/>({{data.item.purchase_type}})</small>
							</template>
							<template slot="qtd" slot-scope="data">
								<span v-if="data.item.seed_items && data.item.seed_items.length">{{data.item.seed_items.map(seed_item => seed_item.qtd).reduce((a,b) => a + b)}} kg</span>
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-encomenda/'+ data.item._id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item._id)" class="fa fa-trash btn btn-danger btn-xs"></a>
							</template>
							<!-- eslint-disable-next-line -->
							<template slot="bottom-row" slot-scope="data">
								<td/>
								<td><strong> Total</strong></td>
								<td><strong>{{total_weight}} Kg</strong></td>
								<td><strong>{{total_price | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}</strong></td>
								<td/>
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

	name: 'Orders',

	data () {
		return {
			orders: null,
			filters: { search: null },
			table_fields: [
				{ key: 'date_receiving', label: 'Data / ID', sortable: true },
				{ key: 'client', label: 'Cliente', sortable: true },
				{ key: 'qtd', label: 'Quantidade', sortable: true },
				{ key: 'total', label: 'Total', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			]
		}
	},
	created () {
		this.list()
	},
	computed: {
		total_weight () {
			let values = this.orders.map(order => {
				if (order.seed_items && order.seed_items.length) {
					return order.seed_items.map(seed_item => seed_item.qtd).reduce((a,b) => a + b)
				} else {
					return 0
				}
			})
			return values.length ? values.reduce((a, b) => a + b) : 0
		},
		total_price () {
			let values = this.orders.map(order => {
				if (order.seed_items && order.seed_items.length) {
					return order.seed_items.map(seed_item => seed_item.qtd * (order.purchase_type == 'Atacado' ? seed_item.wholesale_price : seed_item.price)).reduce((a,b) => a + b)
				} else {
					return 0
				}
			})
			return values.length ? values.reduce((a, b) => a + b) : 0
		}
	},
	methods: {
		list() {
      axios.get('orders', {
        params: {
          populate: 'client'
        }
      }).then(response => {
        this.orders = response.data
      }).catch(this.showError)
    },
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('orders/' + id).then(() => {
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
