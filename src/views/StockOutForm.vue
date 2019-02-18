<template>
	<div class="stock-in-form">
		<breadcrumb v-bind:links="[['Estoque', '/estoque']]" active="Saída de estoque" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<h1>
					Saída de estoque
				</h1>
				<br>
				<loading v-bind:loading="loading" />
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Casa de sementes *" >
								<form-entity-select :input="seedsHouseSelected" :items="seeds_house_options" :form="form" field="field_seeds_house" />
							</b-form-group>							
						</div>					
						<div class="col-sm-6">
							<b-form-group label="Semente *" >
								<form-entity-select :input="seedSelected" :items="seed_options" :form="form" field="field_seed" />
							</b-form-group>							
						</div>					
					</div>					
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Coletor" >
								<form-entity-select :items="collector_options" :form="form" field="field_collector" />
							</b-form-group>							
						</div>					
						<div class="col-sm-6">
							<b-form-group label="Grupo de coletores" >
								<form-entity-select :items="collectors_group_options" :form="form" field="field_group" />
							</b-form-group>							
						</div>					
					</div>					
					<div class="row">
						<div class="col-sm-4">
							<b-form-group label="Quantidade (Kg) *">
								<b-form-input v-model="form.field_qty[0].value" type="number" v-validate="'required'" name="field_qty" />
								<field-error v-bind:msg="veeErrors" field="field_qty" />
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Data da coleta">
								<b-form-input v-model="form.field_collection_date[0].value" type="date" />
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Lote *" v-if="lot_filtered_options.length && !add_new_lot"> 
								<form-entity-select :items="lot_filtered_options" :form="form" field="field_lot" />
								<a @click="newLot" class="pull-right pointer">Adicionar novo lote</a>
							</b-form-group>
							<b-form-group label="Novo lote *" v-if="!lot_filtered_options.length || add_new_lot" description="Um novo lote será criado com esse código"> 
								<b-form-input v-model="new_lot" v-validate="'required'" name="new_lot" />
								<field-error v-bind:msg="veeErrors" field="new_lot" />
							</b-form-group>
						</div>
					</div>						

					<form-submit v-bind:error="error" />
				</b-form>
			</div>				
		</div>
		<pre>{{price}}</pre>
		<pre>{{lot_filtered_options}}</pre>
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
			error: false,
			loading: false,
			sending: false,
			sending_seed: false,
			error_seed: false,
			seed: null,
			seed_options: [],
			seeds_house_options: [],
			collectors_group_options: [],
			collector_options: [],
			lot_filtered_options: [],
			lot_options: [],
			seeds: [],
			new_lot: null,
			add_new_lot: false,
			price: null,
			form: {
				type: [{ target_id: "stock_in" }],
				title: [{ value: 'saida-'+Date.now() }], 
				field_price: [{ value: 0 }],
				field_seeds_house: [],
				field_group: [],
				field_collector: [],
				field_seed: [],
				field_qty: [{ value: "" }],
				field_lot: [{ target_id: "" }],
				field_collection_date: [{ value: "" }]
			}
		}
	},
	
	created () {

		if (this.isEditing()) {
			this.edit(this.$route.params.id)
		}
		
		axios.get('rest/collectors-groups?_format=json').then(response => {
			this.collectors_group_options = response.data.map(collectors_group => {
				return { 
					id: collectors_group.nid[0].value,
					title: collectors_group.title[0].value,
					description: collectors_group.field_address.length ? 
					[collectors_group.field_address[0].locality, collectors_group.field_address[0].administrative_area].filter(Boolean).join(' - ') : ''
				}
			})
		}).catch(error => { this.error = error.message })

		axios.get('rest/collectors?_format=json').then(response => {
			this.collector_options = response.data.map(collector => {
				return { 
					id: collector.uid[0].value,
					title: collector.field_name[0].value,
					description: collector.field_nickname[0].value,
					picture: this.present(collector.user_picture, 'url') ? collector.user_picture[0].url : null,
				}
			})
		}).catch(error => { this.error = error.message })

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
		}).catch(error => { this.error = error.message })

		axios.get('rest/seeds-houses?_format=json').then(response => {
			this.seeds_house_options = response.data.map(seeds_house => {
				return { 
					id: seeds_house.store_id[0].value,
					title: seeds_house.name[0].value,
					description: seeds_house.field_address.length ? 
					[seeds_house.field_address[0].locality, seeds_house.field_address[0].administrative_area].filter(Boolean).join(' - ') : ''
				}
			})
		}).catch(error => { this.error = error.message })

		axios.get('rest/lots?_format=json').then(response => {
			this.lot_options = response.data.map(lot => {
				return { 
					id: lot.tid[0].value,
					title: lot.name[0].value,
					seed: this.present(lot.field_species, 'target_id') ? lot.field_species[0].target_id : null,
					seeds_house: this.present(lot.field_seeds_house, 'target_id') ? lot.field_seeds_house[0].target_id : null
				}
			}) 
		}).catch(error => { this.error = error.message })


	},
	
	methods: {
		edit (id) {
			this.loading = true
			axios.get('node/' + id + '?_format=json').then(response => {
				var data = response.data
				this.apiDataToForm(this.form, data)
				this.loading = false
			}).catch(error => { this.error = error.message; this.loading = false });
		},
		save () {
			this.$validator.validate().then(isValid => {
				if (isValid) {
					this.sending = true
					this.error = false

					if (this.present(this.form.field_qty)) {
						this.form.field_qty[0].value = Number(this.form.field_qty[0].value)

						if (this.price) {
							this.form.field_price = [{ value: this.price * this.form.field_qty[0].value }]
						}
					}

					if (!this.present(this.form.field_lot) && this.new_lot) {
						axios.post('taxonomy/term', {
							vid: [{ target_id: 'seed_lot' }], 
							name: [{ value: this.new_lot }], 
							field_code: [{ value: this.new_lot }], 
							field_seeds_house: this.form.field_seeds_house, 
							field_species: this.form.field_seed, 
						}).then(resp => {
							this.form.field_lot = [{ target_id: resp.data.tid[0].value }]
							this.saveItem()
						}).catch(error => { this.error = error.message; this.sending = false })
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
				var collectors_request = resp.data
				if (collectors_request && collectors_request.nid) {
					this.$router.replace('/estoque')
				}
				this.sending = false						
			}).catch(error => { this.error = error.response.data.message; this.sending = false })
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
			this.form.field_lot = [{ target_id: '' }]
		},
		filterOptions () {
			if (this.present(this.form.field_seed, 'target_id') && this.present(this.form.field_seeds_house, 'target_id')) {
				this.lot_filtered_options = this.lot_options.filter(lot => {
					return lot.seed == this.form.field_seed[0].target_id && lot.seeds_house == this.form.field_seeds_house[0].target_id
				})
				this.form.field_lot = [{ target_id: '' }]
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
