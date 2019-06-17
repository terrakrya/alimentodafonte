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
								<form-entity-select type="collectors_groups" :form="form" field="collectors_group" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-4">
							<b-form-group label="Quantidade (Kg) *">
								<b-form-input v-model="form.qtd" type="number" v-validate="'required'" name="qtd" />
								<field-error :msg="veeErrors" field="qtd" />
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
					<div class="row" v-if="qtd_error">
						<div class="col-sm-12 text-center">
							<b-alert variant="danger" show >{{qtd_error}}</b-alert>
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
			qtd_error: null,
			lot_filtered_options: [],
			new_lot: null,
			add_new_lot: false,
			price: null,
			collectors_requests: [],
			lots: [],
			form: {
				price: 0,
				seeds_house: null,
				collectors_group: null,
				collector: null,
				seed: null,
				qtd: 0,
				lot: null,
				collection_date: ""
			}
		}
	},
	created () {
		axios.get('collectors_requests', {
			params: {
				populate: 'seed_items.seed'
			}
		}).then(response => {
			this.collectors_requests = response.data
		}).catch(this.showError)

		axios.get('lots').then(response => {
			this.lots = response.data
		}).catch(this.showError)

		if (this.isEditing()) {
			this.edit(this.$route.params.id)
		}

	},
	methods: {
		edit (id) {
			this.isLoading = true
			axios.get('stock_in/' + id).then(response => {
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

					if (this.present(this.form.qtd)) {
						this.form.qtd = this.form.qtd

						if (this.price) {
							this.form.price = this.price * this.form.qtd
						}
					}

					if (!this.form.lot && this.new_lot) {
						this.form.lot = {
							code: this.new_lot,
							seeds_house: this.form.seeds_house,
							seed: this.form.seed,
						}
						this.saveItem()
						// axios.post('lots', {
						// 	code: this.new_lot,
						// 	seeds_house: this.form.seeds_house,
						// 	seed: this.form.seed,
						// }).then(resp => {
						// 	this.form.lot = resp.data._id
						// 	this.saveItem()
						// }).catch(this.showError);
					} else {
						this.saveItem()
					}
				}
			})
		},
		saveItem () {
			axios({
				method: 'POST',
				url: 'stock_in' + (this.isEditing() ? '/' + this.$route.params.id : ''),
				data: this.form
			}).then(resp => {
				var stock_in = resp.data
				if (stock_in && stock_in._id) {
					this.isSending = false
					this.$router.replace('/estoque')
				}
			}).catch(this.showError)
		},
		seedSelected (seed) {
			if (seed) {
				this.price = seed.compensation_collect
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
			if (this.form.seed && this.form.seeds_house) {
				this.lot_filtered_options = this.lots.filter(lot => {
					return lot.seed == this.form.seed && lot.seeds_house == this.form.seeds_house
				})
				this.form.lot = null
			}
		},
		validateQty () {
			this.qtd_error = ''
			if ((this.form.collectors_group || this.form.collector) && this.form.seed && this.collectors_requests) {
				let collectors_request = this.collectors_requests.find(cr => {
					let collector = this.form.collector
					let group = this.form.collectors_group
					return (
						(
							(collector && cr.collector && cr.collector == collector) ||
							(group && cr.collectors_group && cr.collectors_group == group)
						) &&
						cr.seed_items && cr.seed_items.find(s => (s.seed._id == this.form.seed))
					)
				})
				console.log('collectors_request');
				console.log(collectors_request);
				if (collectors_request) {
					let seed_item = collectors_request.seed_items.find(s => (s.seed._id == this.form.seed))
					if (Number(seed_item.qtd) < Number(this.form.qtd)) {
						this.qtd_error = 'Quantidade maior que a solicitada no Pedido '+collectors_request.code+': '+ seed_item.qtd + ' kg de '+seed_item.seed.name
						return false
					} else {
						return true
					}
				} else {
					this.qtd_error = 'Não existe registro de pedido dessa semente para este coletor/grupo'
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
