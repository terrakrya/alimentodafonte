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
								<router-link :to="'/area-de-coleta/'+ data.item.nid">
									{{data.item.title}}
									<small v-if="data.item.estimated_area">
										<br>
										{{data.item.estimated_area}} hectares
									</small>
								</router-link>
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-area-de-coleta/'+ data.item.nid" class="fa fa-edit btn btn-primary btn-xs "></router-link>
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
	
	name: 'CollectionAreas', 
	
	data () {
		return { 
			error: false,
			filters: { search: null },
			table_fields: [
				{ key: 'title', label: 'Nome da área', sortable: true },
				{ key: 'city', label: 'Localidade', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			],
			collection_areas: null
		}
	},
	
	created () {
		this.list()
	},

	methods: {
		list () {
			axios.get('rest/collection-areas?_format=json').then(response => {
				this.collection_areas = response.data.map(collection_area => {
					return { 
						nid: collection_area.nid[0].value,
						title: collection_area.title[0].value,
						estimated_area: collection_area.field_estimated_area.length ? collection_area.field_estimated_area[0].value : '',
						city: collection_area.field_state.length ? 
							[collection_area.field_state[0].locality, collection_area.field_state[0].administrative_area].filter(Boolean).join(' - ')
							: ''
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
