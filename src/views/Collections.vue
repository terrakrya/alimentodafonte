<template>
	<div class="collections">
		<breadcrumb active="Coletas" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Coletas" addUrl="/cadastrar-coleta" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!collections && !error" msg="Carregando lista de coletas" />
					<div v-if="collections">
						<b-table stacked="md" :fields="table_fields" :items="collections" :sort-by="'title'" :filter="filters.search">
							<template slot="date_time" slot-scope="data">
								<router-link v-if="data.item.date_time" :to="'/coleta/'+ data.item.id">
									{{data.item.date_time | moment("DD/MM/YYYY")}}
									<br>
									{{data.item.date_time | moment("H:mm:ss")}}
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
							<template slot="seed" slot-scope="data">
								<router-link v-if="data.item.seed" :to="'/semente/'+ data.item.seed.id">
									{{data.item.seed.title}}
								</router-link>
							</template>
							<template slot="weight_gross" slot-scope="data">
								<span v-if="data.item.weight_gross">
									{{data.item.weight_gross | currency('', 0, { thousandsSeparator: '' })}} kg
								</span>
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-coleta/'+ data.item.id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
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
	
	name: 'Collections', 
	
	data () {
		return { 
			error: false,
			filters: { search: null },
			table_fields: [
				{ key: 'date_time', label: 'Data/Hora', sortable: true },
				{ key: 'group_collector', label: 'Grupo / Coletor', sortable: true },
				{ key: 'seed', label: 'Semente', sortable: true },
				{ key: 'weight_gross', label: 'Peso bruto', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			]
		}
	},
	created () {
		this.loadList('collections')
	},
	computed: {
		collections () {
			return this.$store.state.collections
		},
		total_weight () {
			return this.potential_lists.map(potential_list => {
				return potential_list.weight
			}).reduce((a, b) => a + b)
		},
		total_compensation_collect () {
			return this.potential_lists.map(potential_list => {
				return potential_list.compensation_collect
			}).reduce((a, b) => a + b)
		}
	},
	methods: {
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('node/' + id + '?_format=json').then(() => {
					this.loadList('collections')
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
