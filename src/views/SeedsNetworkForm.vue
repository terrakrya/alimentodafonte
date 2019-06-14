<template>
	<div class="seeds-network-form">
		<breadcrumb :links="[['Redes de sementes', '/redes-de-sementes']]" :active="isEditing() ? form.title[0].value : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="rede de sementes" />
				<loading :loading="isLoading" />
				<b-form @submit.prevent="save" v-if="!isLoading">
					<div class="row">
						<div class="col-sm-12">
							<b-form-group label="Nome da rede *">
								<b-form-input v-model="form.title[0].value" v-validate="'required'" name="title" />
								<field-error :msg="veeErrors" field="title" />
							</b-form-group>							
						</div>
					</div>						
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Contatos" description="Liste todas as formas de contato com a rede">
								<b-form-textarea v-model="form.field_contact[0].value" :rows="3" />
								<field-error :msg="veeErrors" field="contact" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="Área de abrangência" description="Descreva aqui a área de abrangência da rede de sementes">
								<b-form-textarea v-model="form.field_coverage_area[0].value" :rows="3" />
							</b-form-group>							
						</div>
					</div>	
					<div class="row">
						<div class="col-sm-12">
							<b-form-group label="Casas de sementes" >
								<form-entities-select v-if="seeds_house_options && seeds_house_options.length" :items="seeds_house_options" :form="form" field="field_house_seed" />
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
import FormHeadline from '@/components/FormHeadline'
import FormEntitiesSelect from '@/components/FormEntitiesSelect'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'

export default {
	
	name: 'SeedsNetworkForm', 
	
	data () {

		return { 
			
			
			
			seed: null,
			seeds_house_options: [],
			form: {
				type:[{ target_id: "seeds_network" }],
				title: [{ value: '' }],
				field_coverage_area: [{ value: '' }],
				field_contact: [{ value: '' }],
				field_house_seed: [],
			},
		}
	},
	
	created () {

		if (this.isEditing()) {
			this.edit(this.$route.params.id)
		}

		axios.get('rest/seeds-houses?_format=json').then(response => {
			this.seeds_house_options = response.data.map(seeds_house => {
				return { 
					id: seeds_house.store_id[0].value,
					title: seeds_house.name[0].value,
					description: '',
					picture: ''
				}
			})
		}).catch(this.showError)

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
				if (isValid) {
					this.isSending = true
					this.error = false
					axios({
						method: (this.isEditing() ? 'PATCH' : 'POST'),
						url: 'node' + (this.isEditing() ? '/' + this.$route.params.id : '')+'?_format=json',
						data: this.form
					}).then(resp => {
						var seeds_house = resp.data
						if (seeds_house && seeds_house.nid) {
							this.$router.replace('/rede-de-sementes/'+seeds_house.nid[0].value)
						}
						this.isSending = false						
					}).catch(this.showError)
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
