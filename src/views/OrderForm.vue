<template>
	<div class="collectors-request-form">
		<breadcrumb :links="[['Encomendas', '/encomendas']]" :active="isEditing() ? form.title[0].value : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="encomenda" />
				<loading :loading="loading" />
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-sm-4">
							<b-form-group label="Cliente *" >
								<form-entity-select v-if="client_options.length" :items="client_options" :form="form" field="field_order_entry_clients" />
							</b-form-group>							
						</div>			
						<div class="col-sm-4">
							<b-form-group label="Área total" description="Área total a ser restaurada em hectares">
								<b-form-input v-model="form.field_order_entry_restored_area[0].value" type="number" />
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Tipo de compra">
								<b-form-radio-group v-model="form.field_order_entry_purchase_type[0].value" :options="
								['Atacado', 'Varejo']" stacked />
							</b-form-group>
						</div>	
					</div>					
					<div class="row gray">
						<div class="col-sm-4">
							<b-form-group label="Data do recebimento">
								<b-form-input v-model="form.field_order_entry_date_receiving[0].value" type="date" />
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Prazo final">
								<b-form-input v-model="form.field_order_entry_deadline[0].value" type="date" />
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Status do contrato">
								<b-form-radio-group v-model="form.field_order_entry_contract[0].value" :options="
								['Enviado', 'Assinado']" stacked />
							</b-form-group>
						</div>	
					</div>
					<div class="row">
						<div class="col-sm-4">
							<b-form-group label="Fitofisionomia">
								<b-form-select v-model="form.field_order_entry_vegetation[0].value" :options="
								fitofisionomias" stacked />
							</b-form-group>
						</div>	
						<div class="col-sm-4">
							<b-form-group label="Brejo?">
								<b-form-checkbox v-model="form.field_order_entry_bog[0].value">O local fica inundado por mais de um mês?</b-form-checkbox>
							</b-form-group> 
						</div>
						<div class="col-sm-4">
							<b-form-group label="Alaga?">
								<b-form-checkbox v-model="form.field_order_entry_flood[0].value">O solo fica encharcado por mais de um mês?</b-form-checkbox>
							</b-form-group>
						</div>	
					</div>					
					<div class="row">
						<div class="col-sm-12">
							<form-seeds-select :form="form" field="this.$route.params.id" fieldtype="order_entry_seeds" :parent="this.$route.params.id" />
						</div>					
					</div>					
					<form-submit :error="error" :sending="sending" />
				</b-form>
			</div>				
		</div>
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
import FormSeedsSelect from '@/components/FormSeedsSelect'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import fitofisionomias from '@/data/fitofisionomias.json'

export default {
	
	name: 'OrderForm', 
	
	data () {

		return { 
			error: false,
			loading: false,
			sending: false,
			seeds_house_options: [],
			collectors_group_options: [],
			client_options: [],
			seeds: [],
			fitofisionomias: fitofisionomias,
			form: {
				type: [{ target_id: "order_entry" }],
				title: [{ value: 'encomenda-'+Date.now() }],
				field_order_entry_clients: [],
				field_order_entry_seeds: [],
				field_order_entry_date_receiving: [{value: ''}],
				field_order_entry_deadline: [{value: ''}],
				field_order_entry_purchase_type: [{value: ''}],
				field_order_entry_contract: [{value: ''}],
				field_order_entry_vegetation: [{value: ''}],
				field_order_entry_restored_area: [{value: ''}],
				field_order_entry_bog: [{value: false}],
				field_order_entry_flood: [{value: false}],
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

		axios.get('rest/clients?_format=json').then(response => {
			this.client_options = response.data.map(client => {
				return { 
					id: client.uid[0].value,
					title: client.field_name[0].value,
					description: client.field_nickname[0].value,
					picture: this.present(client.user_picture, 'url') ? client.user_picture[0].url : null,
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
							this.$router.replace('/encomenda/'+collectors_request.nid[0].value)
						}
						this.sending = false						
					}).catch(error => { this.error = error.response.data.message; this.sending = false })
				}
			})
		},

	},

	components: { 
		Breadcrumb, 
		Loading, 
		FormHeadline, 
		FormEntitySelect, 
		FormSeedsSelect, 
		FormSubmit, 
		FieldError,
		CoolSelect
	}

};
</script>
