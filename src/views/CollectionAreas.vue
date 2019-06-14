<template>
	<div class="collection-areas">
		<breadcrumb active="Áreas de coleta" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Áreas de coleta" addUrl="/cadastrar-area-de-coleta" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!collection_areas && !error" msg="Carregando lista de áreas" />
					<div v-if="collection_areas">
						<b-table stacked="md" :fields="table_fields" :items="collection_areas" :sort-by="'title'" :filter="filters.search">
							<template slot="title" slot-scope="data">
								<router-link :to="'/area-de-coleta/'+ data.item.id">
									{{data.item.title}}
									<small v-if="data.item.estimated_area">
										<br>
										{{data.item.estimated_area}} hectares
									</small>
								</router-link>
							</template>
							<template slot="group_collector" slot-scope="data">
								<router-link v-if="data.item.collectors_group" :to="'/grupo-de-coletores/'+ data.item.collectors_group.id">
									{{data.item.collectors_group.title}}
								</router-link>
								<router-link v-if="data.item.collector" :to="'/coletor/'+ data.item.collector.id">
									{{data.item.collector.title}}
								</router-link>
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-area-de-coleta/'+ data.item.id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item.id)" class="fa fa-trash btn btn-danger btn-xs"></a>
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
	
	name: 'CollectionAreas', 
	
	data () {
		return { 
			
			filters: { search: null },
			table_fields: [
				{ key: 'title', label: 'Nome da área', sortable: true },
				{ key: 'group_collector', label: 'Grupo / Coletor', sortable: true },
				{ key: 'city', label: 'Localidade', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			]
		}
	},
	created () {
		this.loadList('collection_areas')
	},
	computed: {
		collection_areas () {
			return this.$store.state.collection_areas
		},
	},
	methods: {
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('node/' + id + '?_format=json').then(() => {
					this.loadList('collection_areas')
				}).catch(this.showError)	
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
