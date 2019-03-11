<template>
	<div class="potential-list">
		<breadcrumb active="Potencial de coleta" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Listas de potencial" addUrl="/cadastrar-lista-de-potencial" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!potential_lists && !error" msg="Carregando lista de potencial" />
					<div v-if="potential_lists">
						<b-table  @filtered="onFiltered" stacked="md" :fields="table_fields" :items="potential_lists" :sort-by="'title'" :filter="filters.search">
							<template slot="date" slot-scope="data">
								<router-link v-if="data.item.date" :to="'/lista-de-potencial/'+ data.item.id"> 
									{{data.item.date | moment("DD/MM/YYYY")}} 
									<br>
									Lista {{data.item.id}}
								</router-link>
							</template>
							<template slot="collector" slot-scope="data">
								<router-link v-if="data.item.collector" :to="'/coletor/'+ data.item.collector.id">{{data.item.collector.title}}</router-link>
							</template>
							<template slot="group" slot-scope="data">
								<router-link v-if="data.item.group" :to="'/grupo-de-coletores/'+ data.item.group.id">{{data.item.group.title}}</router-link>
							</template>
							<template slot="weight" slot-scope="data">
								{{data.item.weight}} kg
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-lista-de-potencial/'+ data.item.id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item.id)" class="fa fa-trash btn btn-danger btn-xs"></a>
							</template>
							<!-- eslint-disable-next-line -->
							<template slot="bottom-row" slot-scope="data">
								<td/>
								<td/>
								<td><strong> Total</strong></td>
								<td><strong>{{total_weight}} Kg</strong></td>
								<td/>
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
	
	name: 'PotentialLists', 
	
	data () {
		return { 
			error: false,
			filters: { search: null },
			collectors_group_options: [],
			collector_options: [],
			seed_options: [],
			total_qty: 0,
			table_fields: [
				{ key: 'date', label: 'Data', sortable: true },
				{ key: 'collector', label: 'Coletor', sortable: true },
				{ key: 'group', label: 'Grupo', sortable: true },
				{ key: 'weight', label: 'Quantidade', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			]
		}
	},
	
	created () {
		this.loadList('potential_lists')		
	},
	computed: {
		potential_lists () {
			return this.$store.state.potential_lists
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
					this.loadList('potential_lists')
				}).catch(error => { this.error = error.message })	
			}
		},
		onFiltered(filteredItems) {
			this.total_qty = 0
			filteredItems.map(item => {
				if (item.qty) {
					this.total_qty += Number(item.qty)
				}
			})
		}
	},

	components: { 
		'loading': Loading,
		'list-headline': ListHeadline,
		'breadcrumb': Breadcrumb
	}
		
};
</script>
