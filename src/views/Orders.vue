<template>
	<div class="orders">
		<breadcrumb active="Encomendas" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Encomendas" addUrl="/cadastrar-encomenda" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!orders && !error" msg="Carregando lista de encomendas" />
					<div v-if="orders">
						<b-table stacked="md" :fields="table_fields" :items="orders" :sort-by="'date_receiving'" :sort-desc="true" :filter="filters.search">
							<template slot="date_receiving" slot-scope="data">
								<router-link v-if="data.item.date_receiving" :to="'/encomenda/'+ data.item.id"> 
									{{data.item.date_receiving | moment("DD/MM/YYYY")}} 
									<br>
									Encomenda {{data.item.id}}
								</router-link>
							</template>
							<template slot="client" slot-scope="data">
								<router-link v-if="data.item.client" :to="'/cliente/'+ data.item.client.id">{{data.item.client.title}}</router-link>
								<small v-if="data.item.area">{{data.item.area}} hectares</small>
							</template>
							<template slot="total" slot-scope="data">
								{{data.item.total | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}
								<small v-if="data.item.total && data.item.purchase_type"><br/>({{data.item.purchase_type}})</small>
							</template>
							<template slot="weight" slot-scope="data">
								{{data.item.weight}} kg
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-encomenda/'+ data.item.id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item.id)" class="fa fa-trash btn btn-danger btn-xs"></a>
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
		<pre>{{orders}}</pre>
	</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import ListHeadline from '@/components/ListHeadline'
import Breadcrumb from '@/components/Breadcrumb'

export default {
	
	name: 'Orders', 
	
	data () {
		return { 
			error: false,
			filters: { search: null },
			table_fields: [
				{ key: 'date_receiving', label: 'Data / ID', sortable: true },
				{ key: 'client', label: 'Cliente', sortable: true },
				{ key: 'weight', label: 'Quantidade', sortable: true },
				{ key: 'total', label: 'Total', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			]
		}
	},
	created () {
		this.loadList('orders')
	},
	computed: {
		orders () {
			return this.$store.state.orders
		},
		total_weight () {
			return this.orders.map(order => {
				return order.weight
			}).reduce((a, b) => a + b)
		},
		total_price () {
			return this.orders.map(order => {
				return order.total 
			}).reduce((a, b) => a + b)
		}
	},
	methods: {
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('node/' + id + '?_format=json').then(() => {
					this.loadList('orders')
				}).catch(error => { this.error = error.message })	
			}
		}
	},

	components: { 
		'loading': Loading,
		'list-headline': ListHeadline,
		'breadcrumb': Breadcrumb
	}
		
};
</script>
