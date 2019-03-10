<template>
	<div class="collectors-requests">
		<breadcrumb active="Pedidos para coletores" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Pedidos para coletores" addUrl="/cadastrar-pedido-para-coletores" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!collectors_requests && !error" msg="Carregando lista de pedidos" />
					<div v-if="collectors_requests">
						<b-table stacked="md" :fields="table_fields" :items="collectors_requests" :sort-by="'created'" :filter="filters.search">
							<template slot="created" slot-scope="data">
								<router-link v-if="data.item.created" :to="'/pedido-para-coletores/'+ data.item.id"> 
									{{data.item.created | moment("DD/MM/YYYY")}} 
									<br>
									Pedido {{data.item.id}}
								</router-link>
							</template>
							<template slot="seeds_house" slot-scope="data">
								<router-link v-if="data.item.seeds_house" :to="'/casa-de-sementes/'+ data.item.seeds_house.id"> {{data.item.seeds_house.title}} </router-link>
							</template>
							<template slot="collector" slot-scope="data">
								<router-link v-if="data.item.collectors_group" :to="'/grupo-de-coletores/'+ data.item.collectors_group.id"> {{data.item.collectors_group.title}} </router-link>
								<router-link v-if="data.item.collector" :to="'/coletor/'+ data.item.collector.id"> {{data.item.collector.title}} </router-link>
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-pedido-para-coletores/'+ data.item.id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item.id)" class="fa fa-trash btn btn-danger btn-xs"></a>
							</template>
							<template slot="weight" slot-scope="data">
								{{data.item.weight}} kg
							</template>
							<template slot="price" slot-scope="data">
								{{data.item.price | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}
							</template>
							<!-- eslint-disable-next-line -->
							<template slot="bottom-row" slot-scope="data">
								<td/>
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
		<pre>{{collectors_requests}}</pre>
	</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import ListHeadline from '@/components/ListHeadline'
import Breadcrumb from '@/components/Breadcrumb'

export default {
	
	name: 'CollectorsRequests', 
	
	data () {
		return { 
			error: false,
			filters: { search: null },
			table_fields: [
			{ key: 'created', label: 'ID / Data', sortable: true },
			{ key: 'seeds_house', label: 'Casa de sementes', sortable: true },
			{ key: 'collector', label: 'Grupo / Coletor', sortable: true },
			{ key: 'weight', label: 'Quantidade', sortable: true },
			{ key: 'price', label: 'Total', sortable: true },
			{ key: 'actions', label: 'Ações', 'class': 'actions' },
			]
		}
	},
	created () {
		this.loadList('collectors_requests')
	},
	computed: {
		collectors_requests () {
			return this.$store.state.collectors_requests
		},
		total_weight () {
			return this.collectors_requests.map(collectors_request => {
				return collectors_request.weight
			}).reduce((a, b) => a + b)
		},
		total_price () {
			return this.collectors_requests.map(collectors_request => {
				return collectors_request.price
			}).reduce((a, b) => a + b)
		}
	},
	methods: {
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('node/' + id + '?_format=json').then(() => {
					this.list()
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
