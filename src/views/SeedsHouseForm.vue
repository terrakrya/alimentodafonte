<template>
	<div class="seeds-house-form">
		<breadcrumb :links="[['Casas de sementes', '/casas-de-sementes']]" :active="isEditing() ? form.name[0].value : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="casa de sementes" />
				<loading :loading="loading" />
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-sm-12">
							<b-form-group label="Nome da casa *">
								<b-form-input v-model="form.name[0].value" v-validate="'required'" name="name" />
								<field-error :msg="veeErrors" field="name" />
							</b-form-group>							
						</div>
					</div>						
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Telefone">
								<the-mask  v-model="form.field_phone[0].value" :mask="['(##) ####-####', '(##) #####-####']" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="Proprietário" >
								<form-entity-select v-if="user_options && user_options.length > 0" :items="user_options" :form="form" field="uid" />
							</b-form-group>							
						</div>					
					</div>			
					<!-- <form-address :form="form" />		 -->
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Coletores" >
								<form-entities-select :items="collector_options" :form="form" field="field_collector" />
							</b-form-group>							
						</div>					
						<div class="col-sm-6">
							<b-form-group label="Grupos de coletores" >
								<form-entities-select :items="collectors_group_options" :form="form" field="field_group" />
							</b-form-group>							
						</div>					
					</div>					
					<form-submit :error="error" :sending="sending" />
				</b-form>
			</div>				
		</div>
		<!-- <pre>{{form}}</pre> -->
	</div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormHeadline from '@/components/FormHeadline'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormEntitiesSelect from '@/components/FormEntitiesSelect'
import FormAddress from '@/components/FormAddress'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'

export default {
	
	name: 'SeedsHouseForm', 
	
	data () {

		return { 
			error: false,
			loading: false,
			sending: false,
			seed: null,
			user_options: [],
			collectors_group_options: [],
			collector_options: [],
			seeds: [],
			form: {
				type:[{ target_id: "seeds_house" }],
				default_currency:[{ target_id: "BRL" }],
				mail:[{ value: "seeds_house@sementes.com" }],
				uid: [{ target_id: null }],
				name: [{ value: '' }],
				field_phone: [{ value: '' }],
				field_group: [],
				field_collector: [],
				// field_address: [{
				// 	country_code: "BR",
				// 	administrative_area: "",
				// 	locality: "",
				// 	postal_code: "",
				// 	address_line1: ""
				// }]
			},
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

		axios.get('rest/users?_format=json').then(response => {
			this.user_options = response.data.map(user => {
				return { 
					id: user.uid[0].value,
					title: user.field_name[0].value,
					mail: this.present(user.mail) ? user.mail[0].value : '',
					description: user.field_nickname[0].value,
					picture: this.present(user.user_picture, 'url') ? user.user_picture[0].url : null,
				}
			})
		}).catch(error => { this.error = error.message })

	},
	
	methods: {
		edit (id) {
			this.loading = true
			axios.get('store/' + id + '?_format=json').then(response => {
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

					this.form.address = this.form.field_address
					if (this.present(this.form.uid, 'target_id')) {
						let user = this.user_options.find(user_option => {
							return user_option.id == this.form.uid[0].target_id
						})

						if (user && user.mail) {
							this.form.mail = [{ value: user.mail } ]
						}
					}

					axios({
						method: (this.isEditing() ? 'PATCH' : 'POST'),
						url: (this.isEditing() ? 'store/' + this.$route.params.id : 'entity/commerce_store')+'?_format=json',
						data: this.form
					}).then(resp => {
						var seeds_house = resp.data
						if (seeds_house && seeds_house.store_id) {
							this.$router.replace('/casa-de-sementes/'+seeds_house.store_id[0].value)
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
		FormEntitiesSelect, 
		FormAddress, 
		FormSubmit, 
		FieldError
	}

};
</script>
