<template>
	<div class="seeds-houses">
		<breadcrumb active="Casas de semente" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Casas de semente" addUrl="/cadastrar-casa-de-sementes" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!seeds_houses && !error" msg="Carregando lista de casas" />
					<div v-if="seeds_houses">
						<b-table stacked="md" :fields="table_fields" :items="seeds_houses" :sort-by="'name'" :filter="filters.search">
							<template slot="name" slot-scope="data">
								<router-link :to="'/casa-de-sementes/'+ data.item.store_id">{{data.item.name}}</router-link>
								<p v-if="data.item.collectors">
									<small>{{data.item.collectors.length}} {{data.item.collectors.length | pluralize('coletor', 'coletores')}}</small>
								</p>
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-casa-de-sementes/'+ data.item.store_id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item.store_id)" class="fa fa-trash btn btn-danger btn-xs"></a>
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
	
	name: 'SeedsHouses', 
	
	data () {
		return { 
			error: false,
			filters: { search: null },
			table_fields: [
				{ key: 'name', label: 'Nome da casa', sortable: true },
				{ key: 'city', label: 'Localidade', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			],
			seeds_houses: null
		}
	},
	
	created () {
		this.list()
	},

	methods: {
		list () {
			axios.get('rest/seeds-houses?_format=json').then(response => {
				this.seeds_houses = response.data.map(seeds_house => {
					return { 
						store_id: seeds_house.store_id[0].value,
						name: seeds_house.name[0].value,
						collectors: seeds_house.field_collectors,
						city: seeds_house.field_address.length ? 
							[seeds_house.field_address[0].locality, seeds_house.field_address[0].administrative_area].filter(Boolean).join(' - ')
							: ''
					}
				})
			}).catch(error => { this.error = error.message })
		},
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('store/' + id + '?_format=json').then(() => {
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
