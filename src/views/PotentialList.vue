<template>
	<div class="potential-list">
		<breadcrumb active="Potencial de coleta" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Lista de potencial" addUrl="/cadastrar-item-potencial" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!potential_items && !error" msg="Carregando lista de potencial" />
					<div v-if="potential_items">
						<b-table  @filtered="onFiltered" stacked="md" :fields="table_fields" :items="potential_items" :sort-by="'title'" :filter="filters.search">
							<template slot="date" slot-scope="data">
								{{data.value | moment("DD/MM/YYYY")}}
							</template>
							<template slot="seed" slot-scope="data">
								<router-link :to="'/semente/'+ data.item.nid">{{data.value.title[0].value}}</router-link>
								<p v-if="present(data.value.field_scientific_name)">
									<small>{{data.value.field_scientific_name[0].value}}</small>
								</p>
							</template>
							<template slot="collector" slot-scope="data">
								<router-link v-if="data.value" :to="'/coletor/'+ data.value.uid.value">{{data.value.field_name[0].value}}</router-link>
							</template>
							<template slot="group" slot-scope="data">
								<router-link v-if="data.value" :to="'/grupo-de-coletores/'+ data.value.nid[0].value">{{data.value.title[0].value}}</router-link>
							</template>
							<template slot="qty" slot-scope="data">
								{{data.value | currency('', 0, { thousandsSeparator: '' })}} Kg
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-item-potencial/'+ data.item.nid" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item.nid)" class="fa fa-trash btn btn-danger btn-xs"></a>
							</template>
							<!-- eslint-disable-next-line -->
							<template slot="bottom-row" slot-scope="data">
								<td/>
								<td/>
								<td/>
								<td><strong>Total</strong></td>
								<td><strong>{{total_qty}} Kg</strong></td>
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
	
	name: 'PotentialList', 
	
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
				{ key: 'seed', label: 'Semente', sortable: true },
				{ key: 'collector', label: 'Coletor', sortable: true },
				{ key: 'group', label: 'Grupo', sortable: true },
				{ key: 'qty', label: 'Quantidade', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			],
			potential_items: null
		}
	},
	
	async created () {
		await axios.get('rest/collectors-groups?_format=json').then(response => {
			this.collectors_group_options = response.data
		}).catch(error => { this.error = error.message })

		await axios.get('rest/collectors?_format=json').then(response => {
			this.collector_options = response.data
		}).catch(error => { this.error = error.message })
		
		await axios.get('rest/seeds-list?_format=json').then(response => {
			this.seed_options = response.data
		}).catch(error => { this.error = error.message })

		this.list()
	},

	methods: {
		list () {
			axios.get('rest/potential-list?_format=json').then(response => {
				this.potential_items = response.data.map(potential_item => {
					this.total_qty += Number(potential_item.field_potential_qty[0].value)
					return { 
						nid: potential_item.nid[0].value,
						seed: this.seed_options.find(seed => {
							return seed.product_id[0].value == potential_item.field_potential_seed[0].target_id
						}),
						collector: this.collector_options.find(collector => {
							return collector.uid[0].value == potential_item.field_potential_collector[0].target_id
						}),
						group: this.collectors_group_options.find(collectors_group => {
							return collectors_group.nid[0].value == potential_item.field_potential_group[0].target_id
						}), 
						qty: potential_item.field_potential_qty[0].value,
						date: potential_item.field_potential_date[0].value
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
