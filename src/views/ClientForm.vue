<template>
	<div class="cliente-form">
		<breadcrumb :links="[['Clientes', '/clientes']]" :active="isEditing() ? form.name : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="cliente" />
				<loading :loading="isLoading" />
				<b-form @submit.prevent="save" v-if="!isLoading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Nome *">
								<b-form-input v-model="form.name" v-validate="'required'" name="name" />
								<field-error :msg="veeErrors" field="name" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Apelido *">
								<b-form-input v-model="form.nickname" v-validate="'required'" name="nickname" />
								<field-error :msg="veeErrors" field="nickname" />
							</b-form-group>
						</div>
					</div>
					<div class="row gray">
						<div class="col-sm-6">
							<b-form-group label="Telefone *">
								<b-form-input v-model="form.contact" v-validate="'required'" name="contact" v-mask="['(##) ####-####', '(##) #####-####']" />
								<field-error :msg="veeErrors" field="contact" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="CPF/CNPJ">
								<the-mask  v-model="form.cpf" masked="true" :mask="['###.###.###-##', '##.###.###/####-##']" />
							</b-form-group>
						</div>
					</div>
					<form-address :form="form" />
					<form-bank-account :form="form" :gray="true" />
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Nome de usuário *" description="Nome que será usado para acessar o sistema">
								<b-form-input v-model="form.username" v-validate="'required'" name="username" />
								<field-error :msg="veeErrors" field="username" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Email">
								<b-form-input v-model="form.email" v-validate="'email'" name="email" />
								<field-error :msg="veeErrors" field="email" />
								<div class="text-right" v-if="isEditing()">
									<a class="pointer" @click="changePassword">Alterar senha</a>
								</div>
							</b-form-group>
						</div>
					</div>
					<div class="row gray" v-if="showPasswordFields">
						<div class="col-sm-6">
							<b-form-group label="Senha *">
								<b-form-input v-model="form.password" type="password" v-validate="'required'" name="pass" />
								<field-error :msg="veeErrors" field="pass" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Confirmar senha *">
								<b-form-input v-model="form.password_confirmation" type="password" v-validate="'required'" name="pass_confirmation" />
								<field-error :msg="veeErrors" field="pass_confirmation" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<pictures-upload :form="form" :preview="images_preview" :error="error" field="image" url="uploads/images" />
						</div>
					</div>
					<form-submit :errors="error" :sending="isSending" />
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
import FormAddress from '@/components/FormAddress'
import FormBankAccount from '@/components/FormBankAccount'
import FormSubmit from '@/components/FormSubmit'
import PicturesUpload from '@/components/PicturesUpload'
import FieldError from '@/components/FieldError'
import tipos_de_usuario from '@/data/tipos-de-usuario.json'

export default {

	name: 'CollectorForm',
	computed: {
		showPasswordFields () {
			return !this.isEditing() || this.show_password
		}
	},
	data () {
		return {
			images_preview: [],
			log: false,
			show_password: false,
			tipos_de_usuario: tipos_de_usuario,
			form: {
				username: '',
				email: '',
				password: '',
				password_confirmation: '',
				cpf: '',
				name: '',
				nickname: '',
				contact: '',
				image: {},
				address: {
					uf: "",
					city: "",
					postal_code: "",
					address: ""
				},
				bank_account: {
					bank_number: '',
					agency: '',
					account: '',
					type: 'corrente',
				},
				roles: ['client'],
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
			axios.get('users/' + id).then(response => {
				this.apiDataToForm(this.form, response.data)
				if (response.data.image) {
					this.images_preview = [response.data.image]
				}
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
						url: (this.isEditing() ? 'users/'+ this.$route.params.id : 'users'),
						data: this.form
					}).then(resp => {
						var user = resp.data
						if (user && user._id) {
							if (user._id == this.currentUser._id) {
								this.$store.dispatch('login', user)
							}
							this.$router.replace('/cliente/'+user._id)
						}
						this.isSending = false
					}).catch(this.showError)
				}
			})
		},
		changePassword () {
			this.show_password = !this.show_password
		}
	},
	components: {
		Breadcrumb,
		Loading,
		FormHeadline,
		FormAddress,
		FormBankAccount,
		FormSubmit,
		FieldError,
		PicturesUpload
	}

};
</script>
