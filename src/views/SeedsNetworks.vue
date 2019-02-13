<template>
	<div class="dashboard">
		<breadcrumb active="Redes de sementes" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Redes de sementes" addUrl="/cadastrar-rede-de-sementes" v-bind:filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading v-bind:loading="!seeds_networks && !error" msg="Carregando lista de redes" />
					<div v-if="seeds_networks">
						<b-table :fields="table_fields" :items="seeds_networks" :sort-by="'title'" :filter="filters.search">
							<template slot="title" slot-scope="data">
								<router-link v-bind:to="'/rede-de-sementes/'+ data.item.nid">
									{{data.item.title}}
									<small v-if="data.item.seeds_houses">
										<br>
										{{data.item.seeds_houses.length}} {{data.item.seeds_houses.length | pluralize('casa de sementes', 'casas de sementes')}}
									</small>
								</router-link>
							</template>
							<template slot="actions" slot-scope="data">
								<router-link v-bind:to="'/editar-rede-de-sementes/'+ data.item.nid" class="fa fa-edit btn btn-primary btn-xs "></router-link>
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
	
	name: 'SeedsNetworks', 
	
	data () {
		return { 
			error: false,
			filters: { search: null },
			table_fields: [
				{ key: 'title', label: 'Rede', sortable: true },
				{ key: 'coverage_area', label: 'Área de Abrangência', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			],
			seeds_networks: null
		}
	},
	
	created () {
		this.list()
	},

	methods: {
		list () {
			axios.get('rest/seeds-networks?_format=json').then(response => {
				this.seeds_networks = response.data.map(seeds_network => {
					return { 
						nid: seeds_network.nid[0].value,
						title: seeds_network.title[0].value,
						seeds_houses: seeds_network.field_house_seed,
						coverage_area: this.present(seeds_network.field_coverage_area) ? seeds_network.field_coverage_area[0].value : ''
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
