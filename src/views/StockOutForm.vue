<template>
	<div class="stock-in-form">
		<breadcrumb :links="[['Estoque', '/estoque']]" active="Saída de estoque" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<h1>
					Cadastrar saída
				</h1>
				<br>
				<loading :loading="isLoading" />
				<b-form @submit.prevent="save" v-if="!isLoading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Casa de sementes *" >
								<form-entity-select :input="seedsHouseSelected" :items="seeds_house_options" :form="form" field="field_seeds_house_out" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Semente *" >
								<form-entity-select :input="seedSelected" :items="seed_options" :form="form" field="field_seed_out" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Comprador" >
								<form-entity-select :items="client_options" :form="form" field="field_buyer" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Quantidade (Kg) *">
								<b-form-input v-model="form.field_qty_out[0].value" type="number" v-validate="'required'" name="field_qty_out" />
								<field-error :msg="veeErrors" field="field_qty_out" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Lote *" v-if="lot_filtered_options.length && !add_new_lot">
								<form-entity-select :items="lot_filtered_options" :form="form" field="field_lot_out" />
								<a @click="newLot" class="pull-right pointer">Adicionar novo lote</a>
							</b-form-group>
							<b-form-group label="Novo lote *" v-if="!lot_filtered_options.length || add_new_lot" description="Um novo lote será criado com esse código">
								<b-form-input v-model="new_lot" v-validate="'required'" name="new_lot" />
								<field-error :msg="veeErrors" field="new_lot" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Modos de saída *" >
								<b-form-radio-group v-model="form.field_out_modes[0].value" :options="modos_de_saida" stacked v-validate="'required'" name="field_out_modes" />
								<field-error :msg="veeErrors" field="field_out_modes" />
							</b-form-group>
						</div>
					</div>
					<form-submit :errors="error" :isSending="isSending" />
				</b-form>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import modos_de_saida from '@/data/modos-de-saida.json'

export default {

	name: 'StockOutForm',

	data () {

		return {



			seed_options: [],
			seeds_house_options: [],
			client_options: [],
			lot_filtered_options: [],
			lot_options: [],
			new_lot: null,
			add_new_lot: false,
			price: null,
			modos_de_saida: modos_de_saida,
			form: {
				type: [{ target_id: "stock_out" }],
				title: [{ value: 'saida-'+Date.now() }],
				field_price_out: [{ value: 0 }],
				field_seeds_house_out: [],
				field_buyer: [],
				field_out_modes: [{ value: ""}],
				field_seed_out: [],
				field_qty_out: [{ value: "" }],
				field_lot_out: [{ target_id: "" }]
			}
		}
	},

	created () {

		axios.get('rest/clients?_format=json').then(response => {
			this.client_options = response.data.map(client => {
				return {
					id: client.uid[0].value,
					title: client.field_name[0].value,
					description: client.field_nickname[0].value,
					picture: this.present(client.user_picture, 'url') ? client.user_picture[0].url : null,
				}
			})
		}).catch(this.showError)

		axios.get('rest/seeds-list?_format=json').then(response => {
			this.seed_options = response.data.map(seed => {
				return {
					id: seed.product_id[0].value,
					title: seed.title[0].value,
					description: seed.field_scientific_name[0].value,
					compensation_collect: seed.field_compensation_collect[0].number,
					picture: this.present(seed.field_images, 'url') ? seed.field_images[0].url : null,
				}
			})
		}).catch(this.showError)

		axios.get('rest/seeds-houses?_format=json').then(response => {
			this.seeds_house_options = response.data.map(seeds_house => {
				return {
					id: seeds_house.store_id[0].value,
					title: seeds_house.name[0].value,
					description: seeds_house.field_address.length ?
					[seeds_house.field_address[0].locality, seeds_house.field_address[0].administrative_area].filter(Boolean).join(' - ') : ''
				}
			})
		}).catch(this.showError)

		axios.get('rest/lots?_format=json').then(response => {
			this.lot_options = response.data.map(lot => {
				return {
					id: lot.tid[0].value,
					title: lot.name[0].value,
					seed: this.present(lot.field_species, 'target_id') ? lot.field_species[0].target_id : null,
					seeds_house: this.present(lot.field_seeds_house, 'target_id') ? lot.field_seeds_house[0].target_id : null
				}
			})
		}).catch(this.showError)
	},

	methods: {
		save () {
			this.$validator.validate().then(isValid => {
				if (isValid) {
					this.isSending = true
					this.error = false

					if (this.present(this.form.field_qty_out)) {
						this.form.field_qty_out[0].value = Number(this.form.field_qty_out[0].value)
						if (this.form.field_qty_out[0].value > 0) {
							this.form.field_qty_out[0].value = this.form.field_qty_out[0].value * -1
						}

						if (this.price) {
							this.form.field_price_out = [{ value: (this.price * this.form.field_qty_out[0].value)}]
						}
					}

					if (!this.present(this.form.field_lot_out) && this.new_lot) {
						axios.post('taxonomy/term', {
							vid: [{ target_id: 'seed_lot' }],
							name: [{ value: this.new_lot }],
							field_code: [{ value: this.new_lot }],
							field_seeds_house: this.form.field_seeds_house_out,
							field_species: this.form.field_seed_out,
						}).then(resp => {
							this.form.field_lot_out = [{ target_id: resp.data.tid[0].value }]
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
				var stock_out = resp.data
				if (stock_out && stock_out.nid) {
					axios.get('product/'+stock_out.field_seed_out[0].target_id+'?_format=json').then(seed => {
						axios.get('/entity/commerce_product_variation/'+seed.data.variations[0].target_id+'?_format=json').then(variation => {

							let variation_form = { type:[{ target_id: "default" }] }

							if (this.present(variation.data.field_stock)){
								variation_form.field_stock = [{value: Number(variation.data.field_stock[0].value) - Number(stock_out.field_qty_out[0].value)}]
							} else {
								variation_form.field_stock = [{value: Number(stock_out.field_qty_out[0].value)}]
							}
							axios.patch('/entity/commerce_product_variation/'+seed.data.variations[0].target_id+'?_format=json', variation_form).then(() => {
								this.isSending = false
								this.$router.replace('/estoque')
							})
						})
					}).catch(this.showError);
				}
				this.isSending = false
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
			this.form.field_lot_out = [{ target_id: '' }]
		},
		filterOptions () {
			if (this.present(this.form.field_seed_out, 'target_id') && this.present(this.form.field_seeds_house_out, 'target_id')) {
				this.lot_filtered_options = this.lot_options.filter(lot => {
					return lot.seed == this.form.field_seed_out[0].target_id && lot.seeds_house == this.form.field_seeds_house_out[0].target_id
				})
				this.form.field_lot_out = [{ target_id: '' }]
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
