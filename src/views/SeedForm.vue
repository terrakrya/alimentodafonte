<template>
	<div class="dashboard">
		<ol class="breadcrumb">
			<li><router-link to="/painel">Painel do Gestor</router-link></li>
			<li><router-link to="/sementes">Sementes</router-link></li>
			<li class="active">Cadastrar semente</li>
		</ol>
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<div class="row">
					<div class="col-md-8">
						<h1>
							Cadastrar semente
						</h1>
					</div>
				</div>
				<b-form @submit="save" enctype="multipart/form-data">
					<div class="row">
						<div class="col-md-6">
							<b-form-group label="Nome da espécie *">
								<b-form-input v-model="form.title.value" required></b-form-input>
								<b-form-text v-if="variations_form.sku[0].value">{{'Código: '+ variations_form.sku[0].value}}</b-form-text>
							</b-form-group>							
						</div>
						<div class="col-md-6">
							<b-form-group label="Fotos" description="Tipos permetidos: PNG, GIF, JPG e JPEG. Tamanho máximo 32 MB.">
								<b-form-file ref="files" id="files" multiple accept="image/*" v-on:change="handleFileUploads"></b-form-file>
							</b-form-group>
						</div>
					</div>						
					<div class="row gray">
						<div class="col-md-6">
							<b-form-group label="Nome científico *">
								<b-form-input v-model="form.field_scientific_name[0].value" required></b-form-input>
							</b-form-group>
						</div>
						<div class="col-md-6">
							<b-form-group label="Nome(s) regional(is) *" description="Escreva todos os nome regionais que essa semente possa ter separado por virgula.">
								<b-form-input v-model="form.field_local_name[0].value" required></b-form-input>
							</b-form-group>
						</div>
					</div>						
					<div class="row">
						<div class="col-md-12">
							<b-form-group label="Descrição da semente">
								<b-form-textarea v-model="form.body" :rows="3"></b-form-textarea>
							</b-form-group>							
						</div>
					</div>						
					<div class="row gray">
						<div class="col-md-3"> 
							<b-form-group label="Preço *">
								<b-form-input v-model="variations_form.price[0].number" v-money="{}" required></b-form-input>
							</b-form-group>
						</div>
						<div class="col-md-3">
							<b-form-group label="Preço no atacado *">
								<b-form-input v-model="variations_form.field_wholesale_price[0].number" v-money="{}" required></b-form-input>
							</b-form-group>
						</div>
						<div class="col-md-3">
							<b-form-group label="Remuneração do coletor *"> 
								<b-form-input v-model="form.field_compensation_collect[0].number" v-money="{}" required></b-form-input> 
							</b-form-group>
						</div>
						<div class="col-md-3">
							<b-form-group label="Quantidade em estoque"> 
								<b-form-input v-model="variations_form.field_stock[0].value" type="number" required></b-form-input>
							</b-form-group>
						</div>
					</div>						
					<div class="row">
						<div class="col-md-4">
							<b-form-group label="Qtd. de sementes / Kg *" v-bind:description="form.field_seeds_kg[0].value > 0 ? form.field_seeds_kg[0].value + ' sementes / Kg' : ''">
								<b-form-input v-model="form.field_seeds_kg[0].value" type="number" required></b-form-input>
							</b-form-group>
						</div>
						<div class="col-md-4">
							<b-form-group label="Taxa de viabilidade *" v-bind:description="(form.field_viability_rate[0].value || 0) + '% de viabilidade'">
								<b-form-input v-model="form.field_viability_rate[0].value" type="range" required></b-form-input>
							</b-form-group>
						</div>
						<div class="col-md-4">
							<b-form-group label="Limite de peso por lote (g)" v-bind:description="form.field_lot_limit[0].value > 0 ? 'Limite de '+ form.field_lot_limit[0].value + ' gramas por lote' : ''"> 
								<b-form-input type="number" v-model="form.field_lot_limit[0].value" required></b-form-input>
							</b-form-group>
						</div>
					</div>						
					<div class="row">
						<div class="col-md-6">
							<button v-if="!ecosystem_options" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Carregando lista de ecossistemas...</button>
							<b-form-group label="Ecossistema *" v-if="ecosystem_options">
								<b-form-checkbox-group v-model="form.field_ecosystem" :options="ecosystem_options" />
							</b-form-group>
						</div>
						<div class="col-md-6">
							<button v-if="!fruiting_season_options" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Carregando lista de meses...</button>
							<b-form-group label="Época da frutificação *" v-if="fruiting_season_options">
								<b-form-checkbox-group  v-model="form.field_fruiting_season" :options="fruiting_season_options" />
							</b-form-group>								
						</div>
					</div>
					<div class="row">
						<div class="col-md-12 text-center">
							<b-alert variant="danger" show v-if="error">{{error}}</b-alert>

							<div class="btn-group">
								<a @click="save" role="button" class="btn btn-primary btn-lg"><i class="fa fa-save" aria-hidden="true"></i> Salvar</a>
							</div>
						</div>
					</div>						
				</b-form>
				<pre>{{variations_form}}</pre>
				<pre>{{form}}</pre>
				<pre>{{ecosystem_options}}</pre>
				<pre>{{fruiting_season_options}}</pre>
			</div>				
		</div>
	</div>
</template>
<script>
import axios from 'axios'
import slugify from '@sindresorhus/slugify'

export default {
	
	name: 'SeedForm', 
	
	data () {
		return { 
			error: false,
			form: null,
			variations_form: null,
			showSkuInput: false,
			ecosystem_options: null,
			fruiting_season_options: null
		}
	},
	
	created () {
		this.form = {
			type:[{ target_id: "seed" }],
			title: { value: '' },
			field_scientific_name: [{ value: '' }],
			field_local_name: [{ value: '' }],
			field_seeds_kg: [{ value: 0 }],
			field_viability_rate: [{ value: 50 }],
			field_lot_limit: [{ value: 0 }],
			field_compensation_collect: [{ number: 0, currency_code:	'BRL' }],
			field_ecosystem: [],
			field_fruiting_season: [],
			stores:[{ target_id: 1 }],
			variations: [{target_id: null}],
		}

		this.variations_form = {
			type:[{ target_id: "default" }],
			price: [{ number: 0, currency_code:	'BRL' }],				
			field_wholesale_price: [{ number: 0, currency_code:	'BRL' }],				
			field_stock: [{ value: 0 }],
			sku: [{ value: 0 }]
		}

		axios.get('entity/commerce_product_variation/1?_format=json').then(response => {
			this.variations = response.data
		}).catch(error => {
			this.error = error
		});
		
		axios.get('entity/field_storage_config/commerce_product.field_ecosystem?_format=json').then(response => {
			let values = response.data.settings.allowed_values
			this.ecosystem_options = Object.keys(values).map(function(key) {
				return { text: values[key], value: { value: key } }
			});
		}).catch(error => {
			this.error = error
		});

		axios.get('entity/field_storage_config/commerce_product.field_fruiting_season?_format=json').then(response => {
			let values = response.data.settings.allowed_values
			this.fruiting_season_options = Object.keys(values).map(function(key) {
				return { text: values[key], value: { value: key } }
			});
		}).catch(error => {
			this.error = error
		});

	},
	
	methods: {
		save() {
			this.error = false
			this.variations_form.uid = [{ target_id: this.currentUser.current_user.uid }]
			this.form.uid = [{ target_id: this.currentUser.current_user.uid }]
			axios.post('entity/commerce_product_variation?_format=json', this.variations_form).then(response => {
				this.form.variations = [{ target_id: response.data.variation_id[0].value }]
				axios.post('entity/commerce_product?_format=json', this.form).then(response => {
					var product = response.data
					if (product && product.product_id) {
						this.$router.replace('/semente/'+product.product_id[0].value)
					}
				}).catch(error => {
					this.error = error.response.data.message
				})

			}).catch(error => {
				this.error = error.response.data.message
			})
		},
		handleFileUploads (e) {
			let files = e.target.files || e.dataTransfer.files;
			
			for (var i = 0; i < files.length; i++) {

				var reader  = new FileReader();
				var file = files[i]
				reader.onloadend = () => {
					axios.post('entity/file?_format=hal_json', {
						"_links": {
							"type": {
								"href": axios.defaults.baseURL + "rest/type/file/image"
							}
						},
						"filename": [
						{
							"value": file.name
						}
						],
						"data": [
						{
							"value": reader.result
						}
						]
					}, 
					{
						headers: {
							'Content-Type': 'application/hal+json',
							'Authorization': 'Basic c2VtZW50ZXMtYWRtaW46bjNqdWtqZjk4NG4=',
							'X-CSRF-Token': this.currentUser.csrf_token
						}
					})
					.then(response => {
						this.images = response.data 
					})
					.catch(error => {
						this.error = error
					});	

				}

				reader.readAsDataURL(files[i]);

			}


		}
	},
	
	computed: {
		currentUser () {
			return this.$store.state.currentUser
		},
	},
	watch: { 
		'form.title.value': function (newValue) {
			this.variations_form.sku[0].value = slugify(newValue.toLowerCase())
		}
	}


};
</script>
