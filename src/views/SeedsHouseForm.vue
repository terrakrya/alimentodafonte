<template>
	<div class="seeds-house-form">
		<breadcrumb :links="[['Casas de sementes', '/casas-de-sementes']]" :active="isEditing() ? form.name : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="casa de sementes" />
				<loading :loading="isLoading" />
				<b-form @submit.prevent="save" v-if="!isLoading">
					<div class="row">
						<div class="col-sm-12">
							<b-form-group label="Nome da casa *">
								<b-form-input v-model="form.name" v-validate="'required'" name="name" />
								<field-error :msg="veeErrors" field="name" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Telefone">
								<b-form-input v-model="form.phone" v-mask="['(##) ####-####', '(##) #####-####']" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Proprietário" >
								<form-entity-select type="users" :form="form" field="owner" />
							</b-form-group>
						</div>
					</div>
					<form-address :form="form" />
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Coletores" >
								<form-entities-select type="collectors" :form="form" field="collectors" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Grupos de coletores" >
								<form-entities-select type="collectors_groups" :form="form" field="collectors_groups" />
							</b-form-group>
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
			user_options: [],
			collectors_group_options: [],
			collector_options: [],
			form: {
				name: "",
				email:"",
				phone: "",
				collectors_groups: [],
				collectors: [],
        address: {
          uf: "",
          city: "",
          postal_code: "",
          address: ""
        },
				owner: null
			},
		}
	},

	created () {
		if (this.isEditing()) {
			this.edit(this.$route.params.id)
		}
	},

	methods: {
		edit (id) {
			this.isLoading = true
			axios.get('seeds_houses/' + id).then(response => {
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
						method: (this.isEditing() ? 'PUT' : 'POST'),
						url: (this.isEditing() ? 'seeds_houses/' + this.$route.params.id : 'seeds_houses'),
						data: this.form
					}).then(resp => {
						var seeds_house = resp.data
						if (seeds_house && seeds_house._id) {
							this.$router.replace('/casa-de-sementes/'+seeds_house._id)
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
		FormEntitySelect,
		FormEntitiesSelect,
		FormAddress,
		FormSubmit,
		FieldError
	}

};
</script>
