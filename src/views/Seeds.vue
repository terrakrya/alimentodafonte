<template>
	<div class="seeds">
		<breadcrumb active="Sementes" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Sementes" addUrl="/cadastrar-semente" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!seeds && !error" msg="Carregando lista de sementes" />
					<div v-if="seeds">
						<b-table stacked="md" :fields="table_fields" :items="seeds" :sort-by="'title'" :filter="filters.search">
							<template slot="title" slot-scope="data">
								<router-link :to="'/semente/'+ data.item.product_id">{{data.item.title}}</router-link>
							</template>
							<template slot="compensation_collect" slot-scope="data">
								{{data.item.compensation_collect | currency('R$ ', 2, { decimalSeparator: ',' })}}
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-semente/'+ data.item.product_id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item.product_id)" class="fa fa-trash btn btn-danger btn-xs"></a>
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
	
	name: 'Seeds', 
	
	data () {
		return { 
			error: false,
			filters: { search: null },
			table_fields: [
				{ key: 'title', label: 'Semente', sortable: true },
				{ key: 'scientific_name', label: 'Nome científico', sortable: true },
				{ key: 'compensation_collect', label: 'Remuneração', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			],
			seeds: null
		}
	},
	
	created () {
		this.list()
	},

	methods: {
		list () {
			axios.get('rest/seeds-list?_format=json').then(response => {
				this.seeds = response.data.map(seed => {
					return { 
						product_id: seed.product_id[0].value,
						title: seed.title[0].value,
						scientific_name: seed.field_scientific_name[0].value,
						compensation_collect: seed.field_compensation_collect[0].number
					}
				})
			}).catch(error => { this.error = error.message })
		},
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('product/' + id + '?_format=json').then(() => {
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
