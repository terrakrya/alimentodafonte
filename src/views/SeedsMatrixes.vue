<template>
	<div class="seeds-matrixes">
		<breadcrumb active="Matrizes de sementes" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Matrizes de sementes" addUrl="/cadastrar-matriz-de-sementes" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :isLoading="!seeds_matrixes && !error" msg="Carregando lista de matrizes" />
					<div v-if="seeds_matrixes">
						<b-table stacked="md" :fields="table_fields" :items="seeds_matrixes" :sort-by="'title'" :filter="filters.search">
							<template slot="title" slot-scope="data">
								<router-link :to="'/matriz-de-sementes/'+ data.item.id">{{data.item.title}}</router-link>
								<p v-if="data.item.seed_matrix_scient_name">
									<small>{{data.item.seed_matrix_scient_name}}</small>
								</p>
							</template>
							<template slot="group_collector" slot-scope="data">
								<router-link v-if="data.item.collectors_group" :to="'/grupo-de-coletores/'+ data.item.collectors_group.id">
									{{data.item.collectors_group.title}}
								</router-link>
								<router-link v-if="data.item.collector" :to="'/coletor/'+ data.item.collector.id">
									{{data.item.collector.title}}
								</router-link>
							</template>
							<template slot="category" slot-scope="data">
								<p v-if="data.item.category">
									<small>{{origens_de_matrizes.find(v => (data.item.source == v.value)).text}} - {{categorias_de_matrizes.find(v => (data.item.category == v.value)).text}}</small>
								</p>
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-matriz-de-sementes/'+ data.item.id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
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
import categorias_de_matrizes from '@/data/categorias_de_matrizes.json'
import origens_de_matrizes from '@/data/origens_de_matrizes.json'

export default {
	
	name: 'CollectionAreas', 
	
	data () {
		return { 
			
			filters: { search: null },
			categorias_de_matrizes: categorias_de_matrizes,
			origens_de_matrizes: origens_de_matrizes,
			table_fields: [
				{ key: 'title', label: 'Nome da matriz', sortable: true },
				{ key: 'group_collector', label: 'Grupo / Coletor', sortable: true },
				{ key: 'category', label: 'Origem / Categoria', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			]
		}
	},
	created () {
		this.loadList('seeds_matrixes')
	},
	computed: {
		seeds_matrixes () {
			return this.$store.state.seeds_matrixes
		},
	},
	methods: {
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('node/' + id + '?_format=json').then(() => {
					this.loadList('seeds_matrixes')
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
