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
						<b-table stacked="md" :fields="table_fields" :items="orders" :sort-by="'name'" :filter="filters.search">
							<template slot="name" slot-scope="data">
								<router-link :to="'/encomenda/'+ data.item.nid">{{data.item.title}}</router-link>
<!-- 								<p v-if="data.item.collectors">
									<small>{{data.item.collectors.length}} {{data.item.collectors.length | pluralize('coletor', 'coletores')}}</small>
								</p>
 -->							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-encomenda/'+ data.item.nid" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item.nid)" class="fa fa-trash btn btn-danger btn-xs"></a>
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
import ListHeadline from '@/components/ListHeadline'
import Breadcrumb from '@/components/Breadcrumb'

export default {
	
	name: 'CollectorsRequests', 
	
	data () {
		return { 
			error: false,
			filters: { search: null },
			table_fields: [
				{ key: 'title', label: 'Título', sortable: true },
				{ key: 'nid', label: 'Localidade', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			],
			orders: null
		}
	},
	
	created () {
		this.list()
	},

	methods: {
		list () {
			axios.get('rest/orders-entries?_format=json').then(response => {
				this.orders = response.data.map(collectors_request => {
					return { 
						nid: collectors_request.nid[0].value,
						title: collectors_request.title[0].value
					}
				})
			}).catch(error => { this.error = error.message })
		},
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
