<template>
	<div class="stock">
		<breadcrumb active="Estoque" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<div class="row">
					<div class="col-xs-8">
						<h1>
							Estoque 
						</h1>
					</div>
					<div class="col-xs-4">
						<router-link to="/entrada-de-estoque" class="btn btn-primary btn-xs">
							+ Entrada
						</router-link>
						<router-link to="/saida-de-estoque" class="btn btn-primary btn-xs">
							+ Saída
						</router-link>
					</div>
				</div>

				<div class="info-content"> 
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading v-bind:loading="!stock && !error" msg="Carregando relatório movimentações" />
					<div v-if="stock">
						<b-table @filtered="onFiltered" :fields="table_fields" :items="stock" :sort-by="'title'" :filter="filters.search">
							<template slot="created" slot-scope="data">
								<div >
									<router-link v-if="data.value" v-bind:to="'/'+ (data.item.type == 'stock_in' ? 'entrada-de-estoque' : 'saida-de-estoque') + '/' + data.item.nid" v-bind:class="data.item.type == 'stock_in' ? 'text-success' : 'text-danger'">
										{{data.item.type == 'stock_in' ? 'Entrada' : 'Saída'}}
										<br>
										{{data.value | moment("DD/MM/YYYY")}}
										<small v-if="data.item.out_mode"><br>({{data.item.out_mode}})</small>
									</router-link>
								</div>
							</template>
							<template slot="seeds_house" slot-scope="data">
								<router-link v-if="data.value" v-bind:to="'/casa-de-sementes/'+ data.value.id">
									{{data.value.title}}
								</router-link>
							</template>
							<template slot="group_collector" slot-scope="data">
								<router-link v-if="data.value" v-bind:to="'/'+(data.value.type == 'collector' ? 'coletor' : 'grupo-de-coletores') + '/'+ data.value.id">
									{{data.value.title}}
								</router-link>
							</template>
							<template slot="seed" slot-scope="data">
								<router-link v-if="data.value" v-bind:to="'/semente/'+ data.value.id">
									{{data.value.title}}
								</router-link>
							</template>
							<template slot="lot" slot-scope="data">
								<small v-if="data.value">{{data.value.title}}</small>
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
				</div>
			</div>
		</div>
		<pre></pre>
	</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'

export default {
	
	name: 'Stock', 
	
	data () {
		return { 
			error: false,
			filters: { search: null },
			seeds_house_options: [],
			total_qty: 0,
			total_price: 0,
			table_fields: [
			{ key: 'created', label: 'Data', sortable: true },
			{ key: 'seeds_house', label: 'Casa de sementes', sortable: true },
			{ key: 'group_collector', label: 'Grupo / Coletor', sortable: true },
			{ key: 'seed', label: 'Semente', sortable: true },
			{ key: 'lot', label: 'Lote', sortable: true },
			{ key: 'qty', label: 'Quantidade', sortable: true },
			{ key: 'price', label: 'Preço', sortable: true },
			],
			stock: null
		}
	},
	
	async created () {
		await axios.get('rest/collectors-groups?_format=json').then(response => {
			this.collectors_group_options = response.data.map(collectors_group => {
				return { 
					id: collectors_group.nid[0].value,
					title: collectors_group.title[0].value,
					description: collectors_group.field_address.length ? 
					[collectors_group.field_address[0].locality, collectors_group.field_address[0].administrative_area].filter(Boolean).join(' - ') : ''
				}
			})
		}).catch(error => { this.error = error.message })

		await axios.get('rest/collectors?_format=json').then(response => {
			this.collector_options = response.data.map(collector => {
				return { 
					id: collector.uid[0].value,
					title: collector.field_name[0].value,
					description: collector.field_nickname[0].value,
					picture: this.present(collector.user_picture, 'url') ? collector.user_picture[0].url : null,
				}
			})
		}).catch(error => { this.error = error.message })

		await axios.get('rest/seeds-list?_format=json').then(response => {
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
						movement.group_collector = this.collectors_group_options.find(item => {
							return item.id == stock_movement.field_group[0].target_id
						})
					} else if (this.present(stock_movement.field_collector, 'target_id')) {
						movement.group_collector = this.collector_options.find(item => {
							return item.id == stock_movement.field_collector[0].target_id
						})
						movement.group_collector.type = 'collector'
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
		}
	},

	components: { 
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
