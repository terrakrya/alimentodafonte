<template>
	<div class="collectors-request-form">
		<breadcrumb :links="[['Encomendas', '/encomendas']]" :active="isEditing() ? 'Encomenda ' + $route.params.id : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="encomenda" />
				<loading :loading="loading" />
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Cliente *" >
								<form-entity-select v-if="clients.length" :items="clients" :form="form" field="field_order_entry_clients" />
							</b-form-group>							
						</div>			
						<div class="col-sm-6">
							<b-form-group label="Área total" description="Área total a ser restaurada em hectares">
								<b-form-input v-model="form.field_order_entry_restored_area[0].value" type="number" />
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
								<b-form-checkbox v-model="form.field_order_entry_bog[0].value">O solo fica encharcado por mais de um mês?</b-form-checkbox>
							</b-form-group> 
						</div>
						<div class="col-sm-4">
							<b-form-group label="Alaga?">
								<b-form-checkbox v-model="form.field_order_entry_flood[0].value">O local fica inundado por mais de um mês?</b-form-checkbox>
							</b-form-group>
						</div>	
					</div>					
					<div class="row gray">
						<div class="col-sm-4">
							<b-form-group label="Valor pago">
								<money v-model="form.field_order_entry_amount_paid[0].value"></money>
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Valor restante">
								<money v-model="form.field_order_entry_amount_remain[0].value"></money>
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Tipo de compra">
								<b-form-radio-group v-model="form.field_order_entry_purchase_type[0].value" :options="
								['Atacado', 'Varejo']" stacked />
							</b-form-group>
						</div>	
					</div>
					<div class="row">
						<div class="col-sm-12">
							<form-seeds-select :form="form" field="field_order_entry_seeds" fieldtype="order_entry_seeds" :parent="this.$route.params.id" fieldseed="field_order_entry_seed" fieldqtd="field_order_entry_seeds_qty" :seeds="seeds" v-if="seeds.length" />
						</div>					
					</div>					
					<form-submit :error="error" :sending="sending" />
				</b-form>
			</div>				
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormHeadline from '@/components/FormHeadline'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSeedsSelect from '@/components/FormSeedsSelect'
import FormSubmit from '@/components/FormSubmit'
import fitofisionomias from '@/data/fitofisionomias.json'

export default {
	
	name: 'OrderForm', 
	
	data () {

		return { 
			error: false,
			loading: false,
			sending: false,
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
				field_order_entry_amount_paid: [{value: ''}],
				field_order_entry_amount_remain: [{value: ''}],
			}
		}
	},
	
	created () {

		this.getList('clients')
		this.getList('seeds')
	
		if (this.isEditing()) {
			this.edit(this.$route.params.id)
		}
		
	},
	computed: {
		clients () {
			return this.$store.state.clients
		},
		seeds () {
			return this.$store.state.seeds
		}
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
						var order = resp.data
						if (order && order.nid) {
							this.loadList('orders')
							this.$router.replace('/encomenda/'+order.nid[0].value)
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
		FormSubmit
	}

};
</script>
