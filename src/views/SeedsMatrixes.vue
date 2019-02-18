<template>
	<div class="seeds-matrixes">
		<breadcrumb active="Matrizes de sementes" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Matrizes de sementes" addUrl="/cadastrar-matriz-de-sementes" v-bind:filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading v-bind:loading="!seeds_matrixes && !error" msg="Carregando lista de matrizes" />
					<div v-if="seeds_matrixes">
						<b-table :fields="table_fields" :items="seeds_matrixes" :sort-by="'title'" :filter="filters.search">
							<template slot="title" slot-scope="data">
								<router-link v-bind:to="'/matriz-de-sementes/'+ data.item.nid">{{data.item.title}}</router-link>
								<p v-if="data.item.seed_matrix_scient_name">
									<small>{{data.item.seed_matrix_scient_name}}</small>
								</p>
							</template>
							<template slot="category" slot-scope="data">
								<p v-if="data.item.category">
									<small>{{origens_de_matrizes.find(v => (data.item.source == v.value)).text}} - {{categorias_de_matrizes.find(v => (data.item.category == v.value)).text}}</small>
								</p>
							</template>
							<template slot="actions" slot-scope="data">
								<router-link v-bind:to="'/editar-matriz-de-sementes/'+ data.item.nid" class="fa fa-edit btn btn-primary btn-xs "></router-link>
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
import categorias_de_matrizes from '@/data/categorias_de_matrizes.json'
import origens_de_matrizes from '@/data/origens_de_matrizes.json'

export default {
	
	name: 'CollectionAreas', 
	
	data () {
		return { 
			error: false,
			filters: { search: null },
			categorias_de_matrizes: categorias_de_matrizes,
			origens_de_matrizes: origens_de_matrizes,
			table_fields: [
				{ key: 'title', label: 'Nome da matriz', sortable: true },
				{ key: 'category', label: 'Origem / Categoria', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			],
			seeds_matrixes: null
		}
	},
	
	created () {
		this.list()
	},

	methods: {
		list () {
			axios.get('rest/seeds-matrixes?_format=json').then(response => {
				this.seeds_matrixes = response.data.map(seeds_matrix => {
					return { 
						nid: seeds_matrix.nid[0].value,
						title: seeds_matrix.title[0].value,
						seed_matrix_scient_name: seeds_matrix.field_seed_matrix_scient_name.length ? seeds_matrix.field_seed_matrix_scient_name[0].value : '',
						category: seeds_matrix.field_seed_matrix_category[0].value,
						source: seeds_matrix.field_seed_matrix_source[0].value
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
