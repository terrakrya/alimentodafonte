<template>
	<div class="collector-form">
		<breadcrumb v-bind:links="[['Coletores', '/coletores']]" v-bind:active="isEditing() ? form.name[0].value : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="coletor" />
				<loading v-bind:loading="loading" />
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Nome do coletor *">
								<b-form-input v-model="form.field_name[0].value" v-validate="'required'" name="field_name" />
								<field-error v-bind:msg="veeErrors" field="field_name" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="Apelido *">
								<b-form-input v-model="form.field_nickname[0].value" v-validate="'required'" name="nickname" />
								<field-error v-bind:msg="veeErrors" field="nickname" />
							</b-form-group>							
						</div>
					</div>						
					<div class="row gray">
						<div class="col-sm-6">
							<b-form-group label="Telefone *">
								<b-form-input v-model="form.field_contact[0].value" v-validate="'required'" name="contact" v-mask="['(##) ####-####', '(##) #####-####']" />
								<field-error v-bind:msg="veeErrors" field="contact" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="CPF">
								<the-mask  v-model="form.field_cpf[0].value" :mask="['###.###.###-##']" />
							</b-form-group>							
						</div>
					</div>						
					<!-- <div class="row">
						<div class="col-sm-6">
							<b-form-group label="Estado *">
								<b-form-select v-model="form.field_address[0].administrative_area" :options="estados" v-validate="'required'" name="administrative_area" />
								<field-error v-bind:msg="veeErrors" field="administrative_area" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="Cidade *">
								<b-form-input v-model="form.field_address[0].locality"  name="locality" />
								<field-error v-bind:msg="veeErrors" field="locality" />
							</b-form-group>							
						</div>
					</div>						
					<div class="row">
						<div class="col-sm-8">
							<b-form-group label="Endereço *">
								<b-form-input v-model="form.field_address[0].address_line1" v-validate="'required'" name="address_line1" />
								<field-error v-bind:msg="veeErrors" field="address_line1" />
							</b-form-group>					
						</div>
						<div class="col-sm-4">
							<b-form-group label="CEP">
								<b-form-input v-model="form.field_address[0].postal_code" v-mask="['#####-###']" />
							</b-form-group>					
						</div>
					</div>	 -->					
					<div class="row">
						<div class="col-md-3 col-sm-6">
							<b-form-group label="Banco">
								<b-form-select v-model="form.field_bank_number[0].value" :options="bancos" />
							</b-form-group>							
						</div>
						<div class="col-md-3 col-sm-6">
							<b-form-group label="Agência">
								<b-form-input v-model="form.field_agency[0].value" />
							</b-form-group>							
						</div>
						<div class="col-md-3 col-sm-6">
							<b-form-group label="Conta">
								<b-form-input v-model="form.field_bank_account[0].value" />
							</b-form-group>							
						</div>
						<div class="col-md-3 col-sm-6">
							<b-form-group label="Tipo de conta">
								<b-form-radio-group v-model="form.field_type_account[0].value" :options="tipos_de_conta" stacked >
								</b-form-radio-group>
							</b-form-group>							
						</div>
					</div>		
					<div class="row gray">
						<div class="col-sm-6">
							<b-form-group label="Nome de usuário *" description="Nome que será usado para acessar o sistema">
								<b-form-input v-model="form.name[0].value" v-validate="'required'" name="name" />
								<field-error v-bind:msg="veeErrors" field="name" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="Email *">
								<b-form-input v-model="form.mail[0].value" v-validate="'required|email'" name="mail" />
								<field-error v-bind:msg="veeErrors" field="mail" />
								<div class="text-right" v-if="isEditing()">
									<a class="pointer" @click="changePassword">Alterar senha</a>
								</div>
							</b-form-group>							
						</div>
					</div>
					<div class="row gray" v-if="showPasswordFields">
						<div class="col-sm-6">
							<b-form-group label="Senha *">
								<b-form-input v-model="form.pass[0].value" type="password" v-validate="'required'" name="pass" />
								<field-error v-bind:msg="veeErrors" field="pass" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="Confirmar senha *">
								<b-form-input v-model="form.pass[0].confirmation" type="password" v-validate="'required'" name="pass_confirmation" />
								<field-error v-bind:msg="veeErrors" field="pass_confirmation" />
							</b-form-group>							
						</div>
					</div>						
					
					<div class="row">
						<div class="col-md-12">
							<pictures-upload v-bind:form="form" v-bind:preview="this.images_preview" v-bind:error="error" field="user_picture" url="file/upload/user/user/user_picture?_format=json" /> 
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
import FormSubmit from '@/components/FormSubmit'
import PicturesUpload from '@/components/PicturesUpload'
import FieldError from '@/components/FieldError'
import estados from '@/data/estados.json';
import bancos from '@/data/bancos.json';
import tipos_de_conta from '@/data/tipos-de-conta.json';

export default {
	
	name: 'SeedForm', 
	
	computed: {
		showPasswordFields () {
			return !this.isEditing() || this.show_password
		}
	},

	data () {

		return { 
			error: false,
			loading: false,
			sending: false,
			images_preview: [],
			log: false,
			show_password: false,
			estados: estados,
			bancos: bancos,
			tipos_de_conta: tipos_de_conta,
			form: {
				timezone: [{ value: "America/Sao_Paulo" }],
				status: [{ value: true }],
				roles: [{ target_id: "collector" }],
				name: [{ value: '' }],
				mail: [{ value: '' }],
				pass: [{ value: '' }],
				field_address: [{
					country_code: "BR",
					administrative_area: "",
					locality: "",
					postal_code: "",
					address_line1: ""
				}],
				field_agency: [{ value: '' }],
				field_bank_account: [{ value: '' }],
				field_type_account: [{ value: 'corrente' }],
				field_bank_number: [{ value: '' }],
				field_contact: [{ value: '' }],
				field_cpf: [{ value: '' }],
				field_name: [{ value: '' }],
				field_nickname: [{ value: '' }],
				user_picture: [],
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
			this.loading = true
			axios.get('user/' + id + '?_format=json').then(response => {
				var data = response.data
				this.apiDataToForm(this.form, data)
				this.log = data
				this.images_preview = data.user_picture
				this.loading = false

			}).catch(error => { this.error = error; this.loading = false });
		},
		save () {
			this.$validator.validate().then(isValid => {
				if (isValid) {
					this.sending = true
					this.error = false

					axios({
						method: (this.isEditing() ? 'PATCH' : 'POST'),
						url: (this.isEditing() ? 'user/'+ this.$route.params.id : 'entity/user')+'?_format=json', 
						data: this.form
					}).then(resp => {
						var collector = resp.data
						if (collector && collector.uid) {
							this.$router.replace('/coletor/'+collector.uid[0].value)
						}
						this.sending = false
						
					}).catch(error => { this.error = error.response.data.message; this.sending = false })
				}
			})
		},
		changePassword () {
			this.show_password = !this.show_password
		}
	},

	components: { 
		'breadcrumb': Breadcrumb, 
		'loading': Loading, 
		'form-headline': FormHeadline, 
		'form-submit': FormSubmit, 
		'field-error' : FieldError,
		'pictures-upload' : PicturesUpload
	}


};
</script>
