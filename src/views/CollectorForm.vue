<template>
	<div class="dashboard">
		<breadcrumb v-bind:links="[['Coletores', '/coletores']]" v-bind:active="isEditing() ? form.name[0].value : 'Cadastrar coletor'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="coletor" />
				<loading v-bind:loading="loading" msg="Carregando dados do formulário" />
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Nome do coletor *">
								<b-form-input v-model="form.field_name[0].value" v-validate="'required'" name="name" />
								<span class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</span>
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="Apelido *">
								<b-form-input v-model="form.field_nickname[0].value" v-validate="'required'" name="nickname" />
								<span class="text-danger" v-show="errors.has('nickname')">{{ errors.first('nickname') }}</span>
							</b-form-group>							
						</div>
					</div>						
					<div class="row gray">
						<div class="col-sm-6">
							<b-form-group label="Telefone *">
								<b-form-input v-model="form.field_contact[0].value" v-validate="'required'" name="contact" v-mask="['(##) ####-####', '(##) #####-####']" />
								<span class="text-danger" v-show="errors.has('contact')">{{ errors.first('contact') }}</span>
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="CPF">
								<b-form-input v-model="form.field_cpf[0].value" v-mask="['###.###.###-##', '##.###.###/####-##']" />
							</b-form-group>							
						</div>
					</div>						
					<div class="row">
						<div class="col-sm-12">
							<b-form-group label="Endereço">
								<b-form-input v-model="form.field_address[0].address_line1" :options="estados" />
							</b-form-group>					
						</div>
					</div>						
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Cidade">
								<b-form-input v-model="form.field_address[0].locality" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="Estado">
								<b-form-select v-model="form.field_address[0].administrative_area" :options="estados" />
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
					<div class="row">
						<div class="col-sm-4">
							<b-form-group label="Nome de usuário">
								<b-form-input v-model="form.field_address[0].locality" />
							</b-form-group>							
						</div>
						<div class="col-sm-4">
							<b-form-group label="Email">
								<b-form-input v-model="form.field_address[0].locality" />
							</b-form-group>							
						</div>
						<div class="col-sm-4">
							<b-form-group label="Senha">
								<b-form-input v-model="form.field_address[0].locality" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="">
								<b-form-select v-model="form.field_address[0].administrative_area" :options="estados" />
							</b-form-group>							
						</div>
					</div>						
					
					<div class="row">
						<div class="col-md-12">
							<pictures-upload v-bind:form="form" v-bind:preview="this.images_preview" v-bind:error="error" />							
						</div>					
					</div>					
					<div class="row">
						<div class="col-md-12 text-center">
							<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
							<b-alert variant="danger" show v-if="errors && errors.items.length">Verifique os erros acima para continuar</b-alert>
							<div class="btn-group">
								<button v-if="sending" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Enviando dados...</button>
								<button v-if="!sending" role="button" class="btn btn-primary btn-lg fa fa-save"> Salvar</button>
							</div>
						</div>
					</div>	
				</b-form>
				<pre>{{form}}</pre>
				<pre v-if="log">{{log}}</pre>
			</div>				
		</div>
	</div>
</template>
<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormHeadline from '@/components/FormHeadline'
import PicturesUpload from '@/components/PicturesUpload'
import estados from '@/data/estados.json';
import bancos from '@/data/bancos.json';
import tipos_de_conta from '@/data/tipos-de-conta.json';

export default {
	
	name: 'SeedForm', 
	
	data () {

		return { 
			error: false,
			loading: false,
			sending: false,
			images_preview: [],
			log: false,
			estados: estados,
			bancos: bancos,
			tipos_de_conta: tipos_de_conta,
			form: {
				timezone: [{ value: "America/Sao_Paulo" }],
				roles: [{ target_id: "collector" }],
				name: [{ value: '' }],
				mail: [{ value: '' }],
				field_address: [{
					country_code: "BR",
					administrative_area: "",
					locality: "Alto Paraíso de Goiás",
					postal_code: "73770000",
					address_line1: "Luiz Gonzaga, Qd 24, Lt 12"
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
		edit(id) {
			this.loading = true
			axios.get('user/' + id + '?_format=json').then(response => {
				var data = response.data
				this.apiDataToForm(this.form, data)
				this.log = data
				this.images_preview = data.user_picture
				this.loading = false

			}).catch(error => { this.error = error; this.loading = false });
		},
		save() {
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
		
	},

	components: { 
		'breadcrumb': Breadcrumb, 
		'loading': Loading, 
		'form-headline': FormHeadline, 
		'pictures-upload' : PicturesUpload
	}


};
</script>
