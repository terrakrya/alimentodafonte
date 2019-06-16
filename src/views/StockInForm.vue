<template>
	<div class="stock-in-form">
		<breadcrumb :links="[['Estoque', '/estoque']]" active="Entrada de estoque" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<h1>
					Cadastrar entrada
				</h1>
				<br>
				<loading :loading="isLoading" />
				<b-form @submit.prevent="save" v-if="!isLoading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Casa de sementes *" >
								<form-entity-select :input="seedsHouseSelected" type="seeds_houses" :form="form" field="seeds_house" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Semente *" >
								<form-entity-select :input="seedSelected" type="seeds" :form="form" field="seed" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Coletor" >
								<form-entity-select type="collectors" :form="form" field="collector" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Grupo de coletores" >
								<form-entity-select type="collectors_groups" :form="form" field="group" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-4">
							<b-form-group label="Quantidade (Kg) *">
								<b-form-input v-model="form.qty" type="number" v-validate="'required'" name="qty" />
								<field-error :msg="veeErrors" field="qty" />
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Data da coleta">
								<b-form-input v-model="form.collection_date" type="date" />
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Lote *" v-if="lot_filtered_options.length && !add_new_lot">
								<form-entity-select :items="lot_filtered_options" :form="form" field="lot" />
								<a @click="newLot" class="pull-right pointer">Adicionar novo lote</a>
							</b-form-group>
							<b-form-group label="Novo lote *" v-if="!lot_filtered_options.length || add_new_lot" description="Um novo lote será criado com esse código">
								<b-form-input v-model="new_lot" v-validate="'required'" name="new_lot" />
								<field-error :msg="veeErrors" field="new_lot" />
							</b-form-group>
						</div>
					</div>
					<div class="row" v-if="qty_error">
						<div class="col-sm-12 text-center">
							<b-alert variant="danger" show >{{qty_error}}</b-alert>
						</div>
					</div>
					<form-submit :errors="error" :sending="isSending" />
				</b-form>
			</div>
		</div>
		<pre>{{form}}</pre>
	</div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'

export default {

	name: 'StockInForm',

	data () {

		return {
			qty_error: null,
			seed: null,
			lot_filtered_options: [],
			new_lot: null,
			add_new_lot: false,
			price: null,
			form: {
				price: 0,
				seeds_house: [],
				collectors_group: [],
				collector: [],
				seed: [],
				qty: 0,
				lot: null,
				collection_date: ""
			}
		}
	},
	created () {
		this.getList('lots')
		this.getList('collectors_requests')

		if (this.isEditing()) {
			this.edit(this.$route.params.id)
		}

	},
	computed: {
    seeds_houses () {
      return this.$store.state.seeds_houses
    },
    seeds () {
      return this.$store.state.seeds
    },
    lots () {
      return this.$store.state.lots
    },
    collectors_requests () {
      return this.$store.state.collectors_requests
    }

	},
	methods: {
		edit (id) {
			this.isLoading = true
			axios.get('node/' + id + '?_format=json').then(response => {
				var data = response.data
				this.apiDataToForm(this.form, data)
				this.isLoading = false
			}).catch(this.showError);
		},
		save () {
			this.$validator.validate().then(isValid => {
				if (isValid && this.validateQty()) {
					this.isSending = true
					this.error = false

					if (this.present(this.form.qty)) {
						this.form.qty = Number(this.form.qty)

						if (this.price) {
							this.form.price = [{ value: this.price * this.form.qty }]
						}
					}

					if (!this.present(this.form.lot) && this.new_lot) {
						axios.post('taxonomy/term', {
							vid: [{ target_id: 'seed_lot' }],
							name: [{ value: this.new_lot }],
							code: [{ value: this.new_lot }],
							seeds_house: this.form.seeds_house,
							species: this.form.seed,
						}).then(resp => {
							this.form.lot = [{ target_id: resp.data.tid[0].value }]
							this.saveItem()
						}).catch(this.showError);
					} else {
						this.saveItem()
					}
				}
			})
		},
		saveItem () {
			axios({
				method: (this.isEditing() ? 'PATCH' : 'POST'),
				url: 'node' + (this.isEditing() ? '/' + this.$route.params.id : '')+'?_format=json',
				data: this.form
			}).then(resp => {
				var stock_in = resp.data
				if (stock_in && stock_in.nid) {
					axios.get('product/'+stock_in.seed[0].target_id+'?_format=json').then(seed => {
						axios.get('/entity/commerce_product_variation/'+seed.data.variations[0].target_id+'?_format=json').then(variation => {

							let variation_form = { type:[{ target_id: "default" }] }

							if (this.present(variation.data.stock)){
								variation_form.stock = [{value: Number(variation.data.stock[0].value) + Number(stock_in.qty)}]
							} else {
								variation_form.stock = [{value: Number(stock_in.qty)}]
							}
							axios.patch('/entity/commerce_product_variation/'+seed.data.variations[0].target_id+'?_format=json', variation_form).then(() => {
								this.isSending = false
								this.$router.replace('/estoque')
							})
						})
					}).catch(this.showError);
				}

			}).catch(this.showError)
		},
		seedSelected (seed) {
			if (seed) {
				this.price = Number(seed.compensation_collect)
				this.filterOptions()
			}
		},
		seedsHouseSelected () {
			this.filterOptions()
		},
		newLot () {
			this.add_new_lot = true
			this.form.lot = [{ target_id: '' }]
		},
		filterOptions () {
			if (this.present(this.form.seed, 'target_id') && this.present(this.form.seeds_house, 'target_id')) {
				this.lot_filtered_options = this.lots.filter(lot => {
					return lot.seed == this.form.seed[0].target_id && lot.seeds_house == this.form.seeds_house[0].target_id
				})
				this.form.lot = [{ target_id: '' }]
			}
		},
		validateQty () {
			this.qty_error = ''
			if ((this.form.group.length || this.form.collector.length) && this.form.seed.length && this.collectors_requests) {
				let collectors_request = this.collectors_requests.find(cr => {

					let collector = this.present(this.form.collector, 'target_id') ? this.form.collector[0].target_id : null

					let group = this.present(this.form.group, 'target_id') ? this.form.group[0].target_id : null

					return (
						(
							(collector && cr.collector && cr.collector.id == collector) ||
							(group && cr.collectors_group && cr.collectors_group.id == group)
						) &&
						cr.seeds && cr.seeds.find(s => (s.id == this.form.seed[0].target_id))
					)
				})

				if (collectors_request) {
					let seed = collectors_request.seeds.find(s => (s.id == this.form.seed[0].target_id))
					if (Number(seed.weight) < Number(this.form.qty)) {
						this.qty_error = 'Quantidade maior que a solicitada no Pedido '+collectors_request.id+': '+ seed.weight + ' kg de '+seed.title
						return false
					} else {
						return true
					}
				} else {
					this.qty_error = 'Não existe registro de pedido dessa semente para este coletor/grupo'
					return false
				}
			}
		}
	},
	components: {
		Breadcrumb,
		Loading,
		FormEntitySelect,
		FormSubmit,
		FieldError,
	}

};
</script>
