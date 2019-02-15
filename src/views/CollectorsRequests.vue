<template>
	<div class="collectors_requests">
		<breadcrumb active="Pedidos para coletores" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Pedidos para coletores" addUrl="/cadastrar-pedido-para-coletores" v-bind:filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading v-bind:loading="!collectors_requests && !error" msg="Carregando lista de pedidos" />
					<div v-if="collectors_requests">
						<b-table :fields="table_fields" :items="collectors_requests" :sort-by="'name'" :filter="filters.search">
							<template slot="name" slot-scope="data">
								<router-link v-bind:to="'/pedido-para-coletores/'+ data.item.nid">{{data.item.title}}</router-link>
<!-- 								<p v-if="data.item.collectors">
									<small>{{data.item.collectors.length}} {{data.item.collectors.length | pluralize('coletor', 'coletores')}}</small>
								</p>
 -->							</template>
							<template slot="actions" slot-scope="data">
								<router-link v-bind:to="'/editar-pedido-para-coletores/'+ data.item.nid" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item.nid)" class="fa fa-trash btn btn-danger btn-xs"></a>
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
				{ key: 'title', label: 'Título', sortable: true },
				{ key: 'nid', label: 'Localidade', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			],
			collectors_requests: null
		}
	},
	
	created () {
		this.list()
	},

	methods: {
		list () {
			axios.get('rest/collectors-requests?_format=json').then(response => {
				this.collectors_requests = response.data.map(collectors_request => {
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
