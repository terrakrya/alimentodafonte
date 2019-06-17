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
											<filter-entity-select :items="collectors_groups" :form="filters" field="collectors_group" :input="applyFilters" placeholder="Grupo de coletores" item-text="title" item-value="id" />
										</div>
										<div class="col-sm-4">
											<filter-entity-select :items="collectors" :form="filters" field="collector" :input="applyFilters" placeholder="Coletor" item-text="title" item-value="id" />
										</div>
										<div class="col-sm-4">
											<filter-entity-select :items="buyers" :form="filters" field="buyer" :input="applyFilters" placeholder="Cliente" item-text="title" item-value="id" />
										</div>
									</div>
									<div class="row">
										<div class="col-sm-4">
											<filter-entity-select :items="seeds_houses" :form="filters" field="seeds_house" :input="applyFilters" placeholder="Casa de sementes" item-text="title" item-value="id" />
										</div>
										<div class="col-sm-4">
											<filter-entity-select :items="seeds" :form="filters" field="seed" :input="applyFilters" placeholder="Semente" item-text="title" item-value="id" />
										</div>
										<div class="col-sm-4">
											<filter-entity-select :items="lots" :form="filters" field="lot" :input="applyFilters" placeholder="Lote" item-text="title" item-value="id" />
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
								<b-table stacked="md" @filtered="onFiltered" :fields="table_fields" :items="filtered_stock">
									<template slot="createdAt" slot-scope="data">
										<div>
											<a @click="setFilter('type', data.item.type)" :class="data.item.type == 'stock_in' ? 'text-success' : 'text-danger'">
												{{data.item.type == 'stock_in' ? 'Entrada' : 'Saída'}}
											</a>
											{{data.value | moment("DD/MM/YYYY")}}
											<a @click="setFilter('out_mode', data.item.out_mode)" v-if="data.item.out_mode">
												<small>({{data.item.out_mode}})</small>
											</a>
										</div>
									</template>
									<template slot="seeds_house" slot-scope="data">
										<a @click="setFilter(data.field.key, data.value._id)" v-if="data.value">
											{{data.value.name}}
										</a>
									</template>
									<template slot="group_collector_buyer" slot-scope="data">
										<a v-for="(type, index) in ['group_collector', 'collector', 'buyer']" :key="index" @click="setFilter(type, data.item[type]._id)" v-if="data.item[type]">
											{{data.item[type].name}}
										</a>
									</template>
									<template slot="seed" slot-scope="data">
										<a @click="setFilter(data.field.key, data.value._id)" v-if="data.value">
											{{data.value.name}}
										</a>
									</template>
									<template slot="lot" slot-scope="data">
										<a @click="setFilter(data.field.key, data.value._id)" v-if="data.value">
											<small>{{data.value.code}}</small>
										</a>
									</template>
									<template slot="qtd" slot-scope="data">
										{{data.value | currency('', 0, { thousandsSeparator: '' })}} Kg
									</template>
									<template slot="price" slot-scope="data">
										{{data.value * data.item.qtd | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}
									</template>
									<!-- eslint-disable-next-line -->
									<template slot="bottom-row" slot-scope="data">
										<td/>
										<td/>
										<td/>
										<td/>
										<td><strong> Total</strong></td>
										<td><strong>{{total_qtd}} Kg</strong></td>
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
								<b-table stacked="md" @filtered="onFilteredSeed" :fields="seeds_table_fields" :items="seeds" :sort-by="'title'" :filter="filters.search">
									<template slot="title" slot-scope="data">
										<router-link :to="'/semente/'+ data.item.id">{{data.item.title}}</router-link>
									</template>
									<template slot="description" slot-scope="data">
										{{data.value}}
									</template>
									<template slot="stock" slot-scope="data">
										<span v-if="data.item.stock" :class="{'text-danger': data.item.stock < 1}">{{data.item.stock | currency('', 0, { thousandsSeparator: '' }) }} Kg</span>
									</template>
									<!-- eslint-disable-next-line -->
									<template slot="bottom-row" slot-scope="data">
										<td/>
										<td><strong> Total</strong></td>
										<td><strong>{{total_seeds_qtd}} Kg</strong></td>
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
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'
import FilterEntitySelect from '@/components/FilterEntitySelect'
import modos_de_saida from '@/data/modos-de-saida.json'

export default {

	name: 'Stock',

	data () {
		return {
			stock: null,
			filters: {
				search: null,
				type: null,
				seeds_house: null,
				group_collector_buyer: null,
				seed: null,
				lot: null,
				out_mode: null,
				from: null,
				to: null
			},
			total_qtd: 0,
			total_price: 0,
			total_seeds_qtd: 0,
			modos_de_saida: modos_de_saida,
			table_fields: [
			{ key: 'createdAt', label: 'Data', sortable: true },
			{ key: 'seeds_house', label: 'Casa de sementes', sortable: true },
			{ key: 'group_collector_buyer', label: 'Grupo / Coletor / Comprador', sortable: true },
			{ key: 'seed', label: 'Semente', sortable: true },
			{ key: 'lot', label: 'Lote', sortable: true },
			{ key: 'qtd', label: 'Quantidade', sortable: true },
			{ key: 'price', label: 'Preço', sortable: true },
			],
			seeds_table_fields: [
			{ key: 'title', label: 'Semente', sortable: true },
			{ key: 'description', label: 'Nome científico', sortable: true },
			{ key: 'stock', label: 'Estoque (Kg)', sortable: true },
			],
			filtered_stock: null
		}
	},
	computed: {
		seeds_houses () {
			return this.listFromStock('seeds_house')
		},
		seeds () {
			return this.listFromStock('seed')
		},
		collectors_groups () {
			return this.listFromStock('collectors_group')
		},
		collectors () {
			return this.listFromStock('collector')
		},
		buyers () {
			return this.listFromStock('buyer')
		},
		lots () {
			return this.listFromStock('lot')
		},
		showClearButton () {
			return Object.keys(this.filters).find(k => (this.filters[k]))
		}
	},
	created () {
		this.list()
	},
	methods: {
		async list () {
			this.stock = await this.loadList('stock')
			this.onFilteredSeed(this.seeds)
			this.onFiltered(this.stock)
		},
		listFromStock(type) {
			if (this.stock) {
				let items = this.stock.map(movement => {
					if (movement[type]) {
						return {
							id: movement[type]._id,
							title: (type == 'lot' ? movement[type].code : movement[type].name),
							description: (type == 'seed' ? movement[type].scientific_name : ''),
							stock: (type == 'seed' ? movement[type].stock : '')
						}
					}
				})
				return this.getUnique(items)
			}
		},
		onFiltered(filteredItems) {
			this.total_qtd = 0
			this.total_price = 0
			filteredItems.map(item => {
				if (item.price) {
					this.total_price += Number(item.price)
				}
				if (item.qtd) {
					this.total_qtd += Number(item.qtd)
				}
			})
		},
		onFilteredSeed(filteredItems) {
			this.total_seeds_qtd = 0
			filteredItems.map(item => {
				if (item.stock) {
					this.total_seeds_qtd += Number(item.stock)
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
							return new Date(item.createdAt) >= new Date(this.filters[filter])
						}
						if (filter == 'to') {
							let date = new Date(this.filters[filter]+'T23:59:59+00:00')
							return new Date(item.createdAt) <= date
						}
						return item[filter] && (item[filter]._id == this.filters[filter] || item[filter] == this.filters[filter])
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
		getUnique(arr){
			if (arr) {
				arr = arr.filter(a => a)
				return Array.from(new Map(arr.map(e=>[e.id, e])).values()).sort((a, b) => a.title > b.title )
			}
		}
	},
	watch: {
		stock () {
			this.applyFilters()
		}
	},
	components: {
		Loading,
		Breadcrumb,
		FilterEntitySelect,
	}

};
</script>
