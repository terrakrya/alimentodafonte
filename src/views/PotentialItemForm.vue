<template>
	<div class="potential-item-form">
		<breadcrumb :links="[['Lista de potencial', '/lista-de-potencial']]" :active="isEditing() ? 'Editar' : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="item na lista de potencial" />
				<loading :loading="loading" />
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Semente *" >
								<form-entity-select :items="seed_options" :form="form" field="field_potential_seed" />
							</b-form-group>							
						</div>					
						<div class="col-sm-3">
							<b-form-group label="Quantidade (Kg) *">
								<b-form-input v-model="form.field_potential_qty[0].value" type="number" v-validate="'required'" name="field_potential_qty" />
								<field-error :msg="veeErrors" field="field_potential_qty" />
							</b-form-group>
						</div>
						<div class="col-sm-3">
							<b-form-group label="Data da coleta">
								<b-form-input v-model="form.field_potential_date[0].value" type="date" />
							</b-form-group>
						</div>
					</div>					
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Coletor" >
								<form-entity-select :items="collector_options" :form="form" field="field_potential_collector" />
							</b-form-group>							
						</div>					
						<div class="col-sm-6">
							<b-form-group label="Grupo de coletores" >
								<form-entity-select :items="collectors_group_options" :form="form" field="field_potential_group" />
							</b-form-group>							
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
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormHeadline from '@/components/FormHeadline'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'

export default {
	
	name: 'PotentialItemForm', 
	
	data () {

		return { 
			error: false,
			loading: false,
			sending: false,
			collectors_group_options: [],
			collector_options: [],
			seed_options: [],
			form: {
				type:[{ target_id: "potential_collection" }],
				title: [{ value: 'item-potencial-'+Date.now() }],
				field_potential_seed: [],
				field_potential_group: [],
				field_potential_collector: [],
				field_potential_qty: [{ value: '' }],
				field_potential_date: [{ value: '' }],
			},
		}
	},
	
	async created () {

		await axios.get('rest/collectors-groups?_format=json').then(response => {
			this.collectors_group_options = response.data.map(collectors_group => {
				return { 
					id: collectors_group.nid[0].value,
					title: collectors_group.title[0].value,
					city: collectors_group.field_address.length ? 
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
					compensation_collect: seed.field_compensation_collect[0].number,
					picture: this.present(seed.field_images, 'url') ? seed.field_images[0].url : null,
				}
			})
		}).catch(error => { this.error = error.message })

		if (this.isEditing()) {
			this.edit(this.$route.params.id)
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
						var potential_item = resp.data
						if (potential_item && potential_item.nid) {
							this.$router.replace('/lista-de-potencial/')
						}
						this.sending = false						
					}).catch(error => { this.error = error.response.data.message; this.sending = false })
				}
			})
		}
	},

	components: { 
		Breadcrumb, 
		Loading, 
		FormHeadline, 
		FormEntitySelect, 
		FormSubmit, 
		FieldError
	}

};
</script>
