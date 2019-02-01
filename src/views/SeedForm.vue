<template>
	<div class="dashboard">
		<ol class="breadcrumb">
			<li><router-link to="/painel">Painel do gestor</router-link></li>
			<li><router-link to="/sementes">Sementes</router-link></li>
			<li class="active">{{ isEditing() ? form.title[0].value : 'Cadastrar semente' }}</li>
		</ol>
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<div class="row">
					<div class="col-md-8">
						<h1>
							{{ isEditing() ? 'Editar' : 'Cadastrar' }} semente
						</h1>
						<br>
					</div>
				</div>
				<button v-if="loading" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Carregando dados do formulário...</button>
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-md-6">
							<b-form-group label="Nome da espécie *">
								<b-form-input v-model="form.title[0].value" v-validate="'required'" name="title"></b-form-input>
								<span class="text-danger" v-show="errors.has('title')">{{ errors.first('title') }}</span>
							</b-form-group>							
						</div>
						<div class="col-md-6">
							<b-form-group label="Nome científico *">
								<b-form-input v-model="form.field_scientific_name[0].value" v-validate="'required'" name="field_scientific_name" ></b-form-input>
								<span class="text-danger" v-show="errors.has('field_scientific_name')">{{ errors.first('field_scientific_name') }}</span>
							</b-form-group>
						</div>
					</div>						
					<div class="row gray">
						<div class="col-md-12">
							<b-form-group label="Nome(s) regional(is) *" description="Escreva todos os nome regionais que essa semente possa ter separado por virgula.">
								<b-form-input v-model="form.field_local_name[0].value" v-validate="'required'" name="field_local_name"></b-form-input>
								<span class="text-danger" v-show="errors.has('field_local_name')">{{ errors.first('field_local_name') }}</span>
							</b-form-group>
						</div>
					</div>						
					<div class="row">
						<div class="col-md-12">
							<b-form-group label="Descrição da semente">
								<b-form-textarea v-model="form.body[0].value" :rows="3"></b-form-textarea>
							</b-form-group>							
						</div>
					</div>						
					<div class="row gray">
						<div class="col-md-3"> 
							<b-form-group label="Preço *">
								<money v-model="variations_form.price[0].number"></money>
							</b-form-group>
						</div>
						<div class="col-md-3">
							<b-form-group label="Preço no atacado *">
								<money v-model="variations_form.field_wholesale_price[0].number"></money>
							</b-form-group>
						</div>
						<div class="col-md-3">
							<b-form-group label="Remuneração do coletor *"> 
								<money v-model="form.field_compensation_collect[0].number"></money>
							</b-form-group>
						</div>
						<div class="col-md-3">
							<b-form-group label="Qtd. em estoque (Kg)"> 
								<b-form-input v-model="variations_form.field_stock[0].value" type="number"></b-form-input>
							</b-form-group>
						</div>
					</div>				
					<div class="row">
						<div class="col-md-4">
							<b-form-group label="Qtd. de sementes / Kg *" v-bind:description="form.field_seeds_kg[0].value > 0 ? form.field_seeds_kg[0].value + ' sementes por quilo' : ''">
								<b-form-input v-model="form.field_seeds_kg[0].value" type="number"></b-form-input>
							</b-form-group>
						</div>
						<div class="col-md-4">
							<b-form-group label="Taxa de viabilidade *" v-bind:description="(form.field_viability_rate[0].value || 0) + '% de viabilidade'">
								<b-form-input v-model="form.field_viability_rate[0].value" type="range"></b-form-input>
							</b-form-group>
						</div>
						<div class="col-md-4">
							<b-form-group label="Limite de peso por lote (Kg)" v-bind:description="form.field_lot_limit[0].value > 0 ? 'Limite de '+ form.field_lot_limit[0].value + ' quilos por lote' : ''"> 
								<b-form-input type="number" v-model="form.field_lot_limit[0].value"></b-form-input>
							</b-form-group>
						</div>
					</div>						
					<div class="row gray">
						<div class="col-md-6">
							<button v-if="!ecosystem_options" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Carregando lista de ecossistemas...</button>
							<b-form-group label="Ecossistema *" v-if="ecosystem_options">
								<b-form-checkbox-group v-model="form.field_ecosystem" :options="ecosystem_options"  v-validate="'required'" name="field_ecosystem" />
								<span class="text-danger" v-show="errors.has('field_ecosystem')">{{ errors.first('field_ecosystem') }}</span>
							</b-form-group>
						</div>
						<div class="col-md-6">
							<button v-if="!fruiting_season_options" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Carregando lista de meses...</button>
							<b-form-group label="Época da frutificação *" v-if="fruiting_season_options">
								<b-form-checkbox-group  v-model="form.field_fruiting_season" :options="fruiting_season_options" v-validate="'required'" name="field_fruiting_season" />
								<span class="text-danger" v-show="errors.has('field_fruiting_season')">{{ errors.first('field_fruiting_season') }}</span>
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
			</div>				
		</div>
	</div>
</template>
<script>
import axios from 'axios'
import slugify from '@sindresorhus/slugify'
import PicturesUpload from '@/components/PicturesUpload'

export default {
	
	name: 'SeedForm', 
	
	components: { 'pictures-upload' : PicturesUpload }, 

	data () {

		return { 
			error: false,
			form: {
				type:[{ target_id: "seed" }],
				title: [{ value: '' }],
				field_scientific_name: [{ value: '' }],
				field_local_name: [{ value: '' }],
				body: [{ value: '' }],
				field_seeds_kg: [{ value: 0 }],
				field_viability_rate: [{ value: 50 }],
				field_lot_limit: [{ value: 0 }],
				field_compensation_collect: [{ number: 0, currency_code:	'BRL' }],
				field_ecosystem: [],
				field_fruiting_season: [],
				stores:[{ target_id: 1 }],
				variations: [{target_id: null}],
				field_images: [],
			},
			variations_form: {
				type:[{ target_id: "default" }],
				price: [{ number: 0, currency_code:	'BRL' }],				
				field_wholesale_price: [{ number: 0, currency_code:	'BRL' }],				
				field_stock: [{ value: 0 }],
				sku: [{ value: 0 }],
				product_id: [{ target_id: 0 }]
			},
			showSkuInput: false,
			ecosystem_options: null,
			fruiting_season_options: null,
			images_preview: [],
			loading: false,
			sending: false,
		}
	},
	
	created () {

		axios.get('entity/field_storage_config/commerce_product.field_ecosystem?_format=json')
		.then(response => {
			let values = response.data.settings.allowed_values
			this.ecosystem_options = Object.keys(values).map(function(key) {
				return { text: values[key], value: { value: key } }
			});
		}).catch(error => { this.error = error });

		axios.get('entity/field_storage_config/commerce_product.field_fruiting_season?_format=json')
		.then(response => {
			let values = response.data.settings.allowed_values
			this.fruiting_season_options = Object.keys(values).map(function(key) {
				return { text: values[key], value: { value: key } }
			});
		}).catch(error => { this.error = error });

		if (this.isEditing()) {
			this.edit(this.$route.params.id)
		}
	},
	
	methods: {
		edit(id) {
			this.loading = true
			axios.get('product/' + id + '?_format=json').then(response => {
				var data = response.data
				this.apiDataToForm(this.form, data)

				if (data && data.variations) {
					axios.get('entity/commerce_product_variation/' + data.variations[0].target_id + '?_format=json').then(resp => {
						this.apiDataToForm(this.variations_form, resp.data)
						this.images_preview = data.field_images
						this.loading = false
					}).catch(error => { this.error = error; this.loading = false });
				}
			}).catch(error => { this.error = error; this.loading = false });
		},
		save() {
			this.$validator.validate().then(isValid => {
				if (isValid) {
					this.sending = true
					this.error = false
					if (this.isEditing()) {
						this.variations_form.sku = undefined
					} else {
						this.variations_form.sku[0].value = slugify(this.form.title[0].value.toLowerCase()) + "-" + Date.now()
					}
					
					this.form.uid = [{ target_id: this.currentUser.current_user.uid }]
					this.variations_form.uid = [{ target_id: this.currentUser.current_user.uid }]
					axios({
						method: (this.isEditing() ? 'PATCH' : 'POST'),
						url: 'entity/commerce_product_variation'+(this.isEditing() ? '/'+ this.form.variations[0].target_id : '')+'?_format=json',
						data: this.variations_form
					}).then(response => {
						this.form.variations = [{ target_id: response.data.variation_id[0].value }]
						axios({
							method: (this.isEditing() ? 'PATCH' : 'POST'),
							url: (this.isEditing() ? 'product/'+ this.$route.params.id : 'entity/commerce_product')+'?_format=json', 
							data: this.form
						}).then(resp => {
							var product = resp.data
							if (product && product.product_id) {
								this.$router.replace('/semente/'+product.product_id[0].value)
							}
							this.sending = false
						}).catch(error => { this.error = error.response.data.message; this.sending = false })
					}).catch(error => { this.error = error; this.sending = false })				
				}
			})
		},
		isEditing() {
			return !!this.$route.params.id
		},
		apiDataToForm(form, data) {
			Object.keys(form).map((key) => {
				var field = data[key]
				if (field && field.length) {
					form[key] = field.map((f) => {
						if (f.value) {
							return { value: f.value }
						}	else if (f.number) {
							return { number: Number(f.number), currency_code:	'BRL' }
						}	else if (f.target_id) {
							return { target_id: f.target_id }
						}

					})
				}
			})
		}
	},
	computed: {
		currentUser() {
			return this.$store.state.currentUser
		},
	}

};
</script>
