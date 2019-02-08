<template>
	<div class="collectors-group-form">
		<breadcrumb v-bind:links="[['Grupos de coletores', '/grupos-de-coletores']]" v-bind:active="isEditing() ? form.title[0].value : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="grupo de coletores" />
				<loading v-bind:loading="loading" />
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Nome do grupo *">
								<b-form-input v-model="form.title[0].value" v-validate="'required'" name="title" />
								<field-error v-bind:msg="veeErrors" field="title" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="CNPJ">
								<the-mask v-model="form.field_cnpj[0].value" :mask="['##.###.###/####-##']" />
							</b-form-group>							
						</div>
					</div>						
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Contatos *" description="Liste todas as formas de contato com o grupo">
								<b-form-textarea v-model="form.field_contact[0].value" v-validate="'required'" name="contact" :rows="3" />
								<field-error v-bind:msg="veeErrors" field="contact" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="Descrição do grupo" description="Descreva aqui um pouco do trabalho do grupo de coletores">
								<b-form-textarea v-model="form.body[0].value" :rows="3" name="body" />
							</b-form-group>							
						</div>
					</div>	
					<div class="row gray">
						<div class="col-md-3 col-sm-6">
							<b-form-group label="Banco">
								<b-form-select v-model="form.field_bank_number[0].value" :options="bancos" />
							</b-form-group>							
						</div>
						<div class="col-md-3 col-sm-6">
							<b-form-group label="Agência">
								<b-form-input v-model="form.field_agency_number[0].value" />
							</b-form-group>							
						</div>
						<div class="col-md-3 col-sm-6">
							<b-form-group label="Conta">
								<b-form-input v-model="form.field_account_number[0].value" />
							</b-form-group>							
						</div>
						<div class="col-md-3 col-sm-6">
							<b-form-group label="Tipo de conta">
								<b-form-radio-group v-model="form.field_account_type[0].value" :options="tipos_de_conta" stacked >
								</b-form-radio-group>
							</b-form-group>							
						</div>
					</div>		
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Sementes" >
								<form-entities-select v-if="seed_options && seed_options.length" :items="seed_options" :form="form" field="field_seeds" />
							</b-form-group>							
						</div>					
						<div class="col-sm-6">
							<b-form-group label="Coletores" >
								<form-entities-select v-if="collector_options && collector_options.length" :items="collector_options" :form="form" field="field_collectors" />
							</b-form-group>							
						</div>					
					</div>					
					<form-submit v-bind:error="error" />
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
import FormEntitiesSelect from '@/components/FormEntitiesSelect'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import bancos from '@/data/bancos.json';
import tipos_de_conta from '@/data/tipos-de-conta.json';

export default {
	
	name: 'CollectorsGroupForm', 
	
	data () {

		return { 
			error: false,
			loading: false,
			sending: false,
			bancos: bancos,
			tipos_de_conta: tipos_de_conta,
			seed: null,
			seed_options: [],
			collector_options: [],
			form: {
				type:[{ target_id: "collector_groups" }],
				title: [{ value: '' }],
				body: [{ value: '' }],
				field_cnpj: [{ value: '' }],
				field_contact: [{ value: '' }],
				field_bank_number: [{ value: '' }],
				field_agency_number: [{ value: '' }],
				field_account_number: [{ value: '' }],
				field_account_type: [{ value: 'corrente' }],
				field_seeds: [],
				field_collectors: [],
			},
		}
	},
	
	created () {

		if (this.isEditing()) {
			this.edit(this.$route.params.id)
		}
		
		axios.get('rest/seeds-list?_format=json').then(response => {
			this.seed_options = response.data.map(seed => {
				return { 
					id: seed.product_id[0].value,
					title: seed.title[0].value,
					description: seed.field_scientific_name[0].value,
					picture: this.present(seed.field_images, 'url') ? seed.field_images[0].url : null,
				}
			})
		}).catch(error => { this.error = error.message })


		axios.get('rest/collectors?_format=json').then(response => {
			this.collector_options = response.data.map(seed => {
				return { 
					id: seed.uid[0].value,
					title: seed.field_name[0].value,
					description: seed.field_nickname[0].value,
					picture: this.present(seed.user_picture, 'url') ? seed.user_picture[0].url : null,
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
						var collectors_group = resp.data
						if (collectors_group && collectors_group.nid) {
							this.$router.replace('/grupo-de-coletores/'+collectors_group.nid[0].value)
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
		FormEntitiesSelect, 
		FormSubmit, 
		FieldError
	}

};
</script>
