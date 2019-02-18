<template>
	<div class="collectors-request-form">
		<breadcrumb v-bind:links="[['Pedidos para coletores', '/pedidos-para-coletores']]" v-bind:active="isEditing() ? form.title[0].value : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="pedido para coletores" />
				<loading v-bind:loading="loading" />
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-sm-4">
							<b-form-group label="Coletor" >
								<form-entity-select :items="collector_options" :form="form" field="field_requests_collector" />
							</b-form-group>							
						</div>					
						<div class="col-sm-4">
							<b-form-group label="Grupo de coletores" >
								<form-entity-select :items="collectors_group_options" :form="form" field="field_requests_group" />
							</b-form-group>							
						</div>					
						<div class="col-sm-4">
							<b-form-group label="Casa de sementes" >
								<form-entity-select :items="seeds_house_options" :form="form" field="field_requests_seeds_house" />
							</b-form-group>							
						</div>					
					</div>					
					<div class="row">
						<div class="col-sm-12 seeds-select">
							<b-form-group label="Adicionar semente">
								<cool-select :arrowsDisableInstantSelection="true" placeholder="Selecione a semente" :items="seeds_options" item-text="title" class="col-sm-6">
									<template slot="item" slot-scope="{ item: option }">
										<div style="display: flex; align-items: center;">
											<img v-if="option.picture" :src="option.picture">
											<div>
												<strong>{{ option.title }}</strong>
												<br>
												<small>{{ option.description }}</small>
											</div>
										</div>
									</template>
								</cool-select>
								<div class="col-sm-6">
									<input v-model="seed_form.weight" class="weight" placeholder="Peso" /> Kg
									<b-button class="btn btn-primary fa fa-plus pull-right" @click="addSeed()">Adicionar</b-button>
								</div>
								<br>
								<br>
								<loading v-bind:loading="sending" msg="Adicionando semente" />
							</b-form-group>							
						</div>					
					</div>					
					<form-submit v-bind:error="error" />
				</b-form>
			</div>				
		</div>
		<pre>{{seed_form}}</pre>
		<pre>{{form}}</pre>
	</div>
</template>

<script>
import axios from 'axios'
import { CoolSelect } from 'vue-cool-select'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormHeadline from '@/components/FormHeadline'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'

export default {
	
	name: 'CollectorsRequestForm', 
	
	data () {

		return { 
			error: false,
			loading: false,
			sending: false,
			sending_seed: false,
			error_seed: false,
			seed: null,
			seeds_options: [],
			seeds_house_options: [],
			collectors_group_options: [],
			collector_options: [],
			seeds: [],
			form: {
				type: [{ target_id: "requests_for_collectors" }],
				title: [{ value: Date.now() }],
				field_requests_seeds_house: [],
				field_requests_group: [],
				field_requests_collector: [],
				field_paragraph_seeds: [{target_id: 3}],
			},
			seed_form: {
				type: [{ target_id: "collectors_seeds_requests" }],
				parent_id: [{ value: "93" }],
				parent_type: [{ value: "node" }],
				parent_field_name: [{ value: "field_paragraph_seeds" }],
				field_paragraph_seed: [{ target_id: "3" }],
				field_paragraph_weight: [{ value: "0" }],
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
					city: collectors_group.field_address.length ? 
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
			this.seeds_options = response.data.map(seed => {
				return { 
					id: seed.product_id[0].value,
					title: seed.title[0].value,
					description: seed.field_scientific_name[0].value,
					picture: this.present(seed.field_images, 'url') ? seed.field_images[0].url : null,
				}
			})
		}).catch(error => { this.error = error.message })

		axios.get('rest/seeds-houses?_format=json').then(response => {
			this.seeds_house_options = response.data.map(seeds_house => {
				return { 
					id: seeds_house.store_id[0].value,
					title: seeds_house.name[0].value,
					city: seeds_house.field_address.length ? 
					[seeds_house.field_address[0].locality, seeds_house.field_address[0].administrative_area].filter(Boolean).join(' - ') : ''
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

					axios({
						method: (this.isEditing() ? 'PATCH' : 'POST'),
						url: 'node' + (this.isEditing() ? '/' + this.$route.params.id : '')+'?_format=json',
						data: this.form
					}).then(resp => {
						var collectors_request = resp.data
						if (collectors_request && collectors_request.nid) {
							this.$router.replace('/pedido-para-coletores/'+collectors_request.nid[0].value)
						}
						this.sending = false						
					}).catch(error => { this.error = error.response.data.message; this.sending = false })
				}
			})
		},

		addSeed () {
			this.sending_seed = true
			this.error_seed = false

			axios({
				method: 'POST',
				url: '/entity/paragraph?_format=json',
				data: this.seed_form
			}).then(resp => {
				console.log(resp)
				this.sending = false
			}).catch(error => { this.error_seed = error.response.data.message; this.sending = false })
		}

	},

	components: { 
		Breadcrumb, 
		Loading, 
		FormHeadline, 
		FormEntitySelect, 
		FormSubmit, 
		FieldError,
		CoolSelect
	}

};
</script>
