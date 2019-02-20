<template>
	<div class="stock">
		<breadcrumb active="Estoque" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<div class="row">
					<div class="col-xs-4">
						<h1>
							Estoque 
						</h1>
					</div>
					<div class="col-xs-8">
						<a @click="clearFilters" class="btn btn-default" v-if="showClearButton">
							Limpar filtros
						</a>
						<router-link to="/entrada-de-estoque" class="btn btn-primary btn-xs">
							+ Entrada
						</router-link>
						<router-link to="/saida-de-estoque" class="btn btn-primary btn-xs">
							+ Saída
						</router-link>
					</div>
				</div>
				<div class="info-content"> 
					<b-tabs content-class="mt-3">
						<b-tab title="Movimentações do estoque" active>
							<div class="filters gray" v-if="filtered_stock">
								<b-form-group label="Filtrar por:" >
									<div class="row">
										<div class="col-sm-4">
											<filter-entity-select :items="seeds_house_options" :form="filters" field="seeds_house" :input="applyFilters" placeholder="Casa de sementes" /> 
										</div>
										<div class="col-sm-4">
											<filter-entity-select :items="groupCollectorClientOptions" :form="filters" field="group_collector_client" :input="applyFilters" placeholder="Grupo - Coletor - Comprador" /> 
										</div>
										<div class="col-sm-4">
											<filter-entity-select :items="seed_options" :form="filters" field="seed" :input="applyFilters" placeholder="Semente" /> 
										</div>
									</div>
									<div class="row">
										<div class="col-sm-3">
											<filter-entity-select :items="[{ title: 'Entrada', id: 'stock_in' }, { title: 'Saída', id: 'stock_out' }]" :form="filters" field="type" :input="applyFilters" placeholder="Tipo de movimentação" itemValue="id" /> 
										</div>
										<div class="col-sm-3">
											<filter-entity-select :items="modos_de_saida.map(m => ({title: m, id: m}))" :form="filters" field="out_mode" :input="applyFilters" placeholder="Modo de saída" itemValue="id" /> 
										</div>
										<div class="col-sm-6 from_to">
											De <b-form-input v-model="filters.from" type="date" @input="applyFilters" />
											Até <b-form-input v-model="filters.to" type="date" @input="applyFilters" />
										</div>
									</div>
								</b-form-group>
							</div>
							<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
							<loading :loading="!filtered_stock && !error" msg="Carregando relatório movimentações" />
							<div v-if="filtered_stock && !filtered_stock.length">
								<h4 class="text-center">Nenhuma movimentação encontrada</h4>
							</div> 
							<div v-if="filtered_stock && filtered_stock.length">
								<b-table stacked="md" striped @filtered="onFiltered" :fields="table_fields" :items="filtered_stock" :sort-by="'title'">
									<template slot="created" slot-scope="data">
										<div >
											<a @click="setFilter(data.field.key, data.value)" :class="data.item.type == 'stock_in' ? 'text-success' : 'text-danger'">
												{{data.item.type == 'stock_in' ? 'Entrada' : 'Saída'}}
											</a>
											{{data.value | moment("DD/MM/YYYY HH:MM")}}
											<a @click="setFilter('out_mode', data.item.out_mode)" v-if="data.item.out_mode">
												<small>({{data.item.out_mode}})</small>
											</a>
										</div>
									</template>
									<template slot="seeds_house" slot-scope="data">
										<a @click="setFilter(data.field.key, data.value)" v-if="data.value">
											{{data.value.title}}
										</a>
									</template>
									<template slot="group_collector_client" slot-scope="data">
										<a @click="setFilter(data.field.key, data.value)" v-if="data.value">
											{{data.value.title}}
										</a>
									</template>
									<template slot="seed" slot-scope="data">
										<a @click="setFilter(data.field.key, data.value)" v-if="data.value">
											{{data.value.title}}
										</a>
									</template>
									<template slot="lot" slot-scope="data">
										<a @click="setFilter(data.field.key, data.value)" v-if="data.value">
											<small v-if="data.value">{{data.value.title}}</small>
										</a>
									</template>
									<template slot="qty" slot-scope="data">
										{{data.value | currency('', 0, { thousandsSeparator: '' })}} Kg
									</template>
									<template slot="price" slot-scope="data">
										{{data.value | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}
									</template>
									<template slot="bottom-row">
										<td/>
										<td/>
										<td/>
										<td/>
										<td><strong>Total</strong></td>
										<td><strong>{{total_qty}} Kg</strong></td>
										<td><strong>{{total_price | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}</strong></td>
									</template>
								</b-table>
							</div>
						</b-tab>
						<b-tab title="Controle de sementes">
							<loading :loading="!seeds && !error" msg="Carregando lista de sementes" />
							<div v-if="seeds">
								<div class="row search">
									<div class="col-sm-4 col-sm-offset-8">
										<b-form-input v-model="filters.search" placeholder="Buscar" class="search-input" />
									</div>
								</div>
								<b-table stacked="md" :fields="seeds_table_fields" :items="seeds" :sort-by="'title'" :filter="filters.search">
									<template slot="title" slot-scope="data">
										<router-link :to="'/semente/'+ data.item.product_id">{{data.item.title[0].value}}</router-link>
									</template>
									<template slot="scientific_name" slot-scope="data">
										{{data.item.field_scientific_name[0].value}}
									</template>
									<template slot="stock_qtd" slot-scope="data">
										<span v-if="data.item.variation && present(data.item.variation.field_stock)" :class="{'text-danger': data.item.variation.field_stock[0].value < 1}">{{data.item.variation.field_stock[0].value | currency('', 0, { thousandsSeparator: '' }) }} Kg</span>
									</template>
								</b-table>
							</div>
						</b-tab>
					</b-tabs>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'
import FilterEntitySelect from '@/components/FilterEntitySelect'
import modos_de_saida from '@/data/modos-de-saida.json'

export default {
	
	name: 'Stock', 
	
	data () {
		return { 
			error: false,
			filters: { 
				search: null, 
				type: null, 
				seeds_house: null, 
				group_collector_client: null, 
				seed: null, 
				lot: null,
				out_mode: null, 
				from: null, 
				to: null 
			},
			collectors_group_options: [],
			collector_options: [],
			client_options: [],
			seed_options: [],
			seeds_house_options: [],
			lot_options: [],
			seeds: [],
			total_qty: 0,
			total_price: 0,
			modos_de_saida: modos_de_saida,
			table_fields: [
			{ key: 'created', label: 'Data', sortable: true },
			{ key: 'seeds_house', label: 'Casa de sementes', sortable: true },
			{ key: 'group_collector_client', label: 'Grupo / Coletor / Comprador', sortable: true },
			{ key: 'seed', label: 'Semente', sortable: true },
			{ key: 'lot', label: 'Lote', sortable: true },
			{ key: 'qty', label: 'Quantidade', sortable: true },
			{ key: 'price', label: 'Preço', sortable: true },
			],
			seeds_table_fields: [
			{ key: 'title', label: 'Semente', sortable: true },
			{ key: 'scientific_name', label: 'Nome científico', sortable: true },
			{ key: 'stock_qtd', label: 'Estoque (Kg)', sortable: true },
			],
			stock: null,
			filtered_stock: null
		}
	},
	computed: {
		groupCollectorClientOptions () {
			return this.collectors_group_options.concat(this.collector_options, this.client_options)
		}, 
		showClearButton () {
			return Object.keys(this.filters).find(k => (this.filters[k]))
		}
	},
	async created () {
		await axios.get('rest/collectors-groups?_format=json').then(response => {
			this.collectors_group_options = response.data.map(collectors_group => {
				return { 
					id: collectors_group.nid[0].value,
					title: collectors_group.title[0].value,
					description: "Grupo de coletores"
				}
			})
		}).catch(error => { this.error = error.message })

		await axios.get('rest/collectors?_format=json').then(response => {
			this.collector_options = response.data.map(collector => {
				return { 
					id: collector.uid[0].value,
					title: collector.field_name[0].value,
					description: "Coletor",
					picture: this.present(collector.user_picture, 'url') ? collector.user_picture[0].url : null,
				}
			})
		}).catch(error => { this.error = error.message })

		await axios.get('rest/clients?_format=json').then(response => {
			this.client_options = response.data.map(client => {
				return { 
					id: client.uid[0].value,
					title: client.field_name[0].value,
					description: "Comprador",
					picture: this.present(client.user_picture, 'url') ? client.user_picture[0].url : null,
				}
			})
		}).catch(error => { this.error = error.message })

		await axios.get('rest/seeds-list?_format=json').then(response => {
			this.seeds = response.data
			this.setVariations()
			this.seed_options = response.data.map(seed => {
				return { 
					id: seed.product_id[0].value,
					title: seed.title[0].value,
					description: seed.field_scientific_name[0].value,
					picture: this.present(seed.field_images, 'url') ? seed.field_images[0].url : null,
				}
			})
		}).catch(error => { this.error = error.message })

		await axios.get('rest/seeds-houses?_format=json').then(response => {
			this.seeds_house_options = response.data.map(seeds_house => {
				return { 
					id: seeds_house.store_id[0].value,
					title: seeds_house.name[0].value,
					description: seeds_house.field_address.length ? 
					[seeds_house.field_address[0].locality, seeds_house.field_address[0].administrative_area].filter(Boolean).join(' - ') : ''
				}
			})
		}).catch(error => { this.error = error.message })

		await axios.get('rest/lots?_format=json').then(response => {
			this.lot_options = response.data.map(lot => {
				return { 
					id: lot.tid[0].value,
					title: lot.name[0].value
				}
			})
		}).catch(error => { this.error = error.message })

		this.list()

	},

	methods: {
		list () {
			axios.get('rest/stock?_format=json').then(response => {
				this.stock = response.data.map(stock_movement => {

					let type = stock_movement.type[0 ].target_id == 'stock_in' ? '' : '_out' 

					let movement = { 
						nid: stock_movement.nid[0].value,
						created: stock_movement.created[0].value,
						type: stock_movement.type[0].target_id,
					}

					if (this.present(stock_movement['field_seeds_house'+type], 'target_id')) {
						movement.seeds_house = this.seeds_house_options.find(item => {
							return item.id == stock_movement['field_seeds_house'+type][0].target_id
						})
					}

					if (this.present(stock_movement.field_group, 'target_id')) {
						movement.group_collector_client = this.collectors_group_options.find(item => {
							return item.id == stock_movement.field_group[0].target_id
						})
						movement.group_collector_client.type = 'collectors_group'
					} else if (this.present(stock_movement.field_collector, 'target_id')) {
						movement.group_collector_client = this.collector_options.find(item => {
							return item.id == stock_movement.field_collector[0].target_id
						})
						movement.group_collector_client.type = 'collector'
					} else if (this.present(stock_movement.field_buyer, 'target_id')) {
						movement.group_collector_client = this.client_options.find(item => {
							return item.id == stock_movement.field_buyer[0].target_id
						})
						movement.group_collector_client.type = 'buyer'
					}

					if (this.present(stock_movement['field_seed'+type], 'target_id')) {
						movement.seed = this.seed_options.find(item => {
							return item.id == stock_movement['field_seed'+type][0].target_id
						})
					}

					if (this.present(stock_movement['field_lot'+type], 'target_id')) {
						movement.lot = this.lot_options.find(item => {
							return item.id == stock_movement['field_lot'+type][0].target_id
						})
					}

					if (this.present(stock_movement['field_qty'+type])) {
						movement.qty = Number(stock_movement['field_qty'+type][0].value)
					} 

					if (this.present(stock_movement['field_price'+type])) {
						movement.price = Number(stock_movement['field_price'+type][0].value)
					} 

					if (this.present(stock_movement.field_out_modes)) {
						movement.out_mode = stock_movement.field_out_modes[0].value
					} 

					return movement
				})
				
				this.filtered_stock = this.stock
			}).catch(error => { this.error = error.message })
		},
		onFiltered(filteredItems) {
			this.total_qty = 0
			this.total_price = 0
			filteredItems.map(item => {
				if (item.price) {
					this.total_price += Number(item.price)
				}
				if (item.qty) {
					this.total_qty += Number(item.qty)
				}
			})
		},
		setFilter(field, value) {
			this.filters[field] = value
			this.applyFilters()
		},
		applyFilters() {
			this.filtered_stock = this.stock
			Object.keys(this.filters).map((filter) => {
				if (filter && this.filters[filter] && filter != 'search') {
					this.filtered_stock = this.filtered_stock.filter(item => {
						if (filter == 'from') {
							return new Date(item.created) >= new Date(this.filters[filter])
						}
						if (filter == 'to') {
							let date = new Date(this.filters[filter]+'T23:59:59+00:00')
							return new Date(item.created) <= date
						}
						return item[filter] == this.filters[filter]
					})
				}				
			})
		},
		clearFilter(filter) {
			this.filters[filter] = null
			this.applyFilters()
		},
		clearFilters() {
			Object.keys(this.filters).map((filter) => {
				this.filters[filter] = null
			})
			this.filtered_stock = this.stock
		},
		setVariations() {
			axios.get('rest/product-variations?_format=json').then(resp => {
				this.product_variations = resp.data
				this.seeds = this.seeds.map(seed => {
					seed.variation = this.product_variations.find(product_variation => {
						return product_variation.variation_id[0].value == seed.variations[0].target_id
					})
					return seed
				})
				
			}).catch(error => { this.error = error.message })
		}		
	},

	components: { 
		Loading,
		Breadcrumb,
		FilterEntitySelect, 
	}

};
</script>
