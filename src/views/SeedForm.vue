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
				<b-form @submit.prevent="save">
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
							<b-form-group label="Quantidade em estoque"> 
								<b-form-input v-model="variations_form.field_stock[0].value" type="number"></b-form-input>
							</b-form-group>
						</div>
					</div>				
					<div class="row">
						<div class="col-md-4">
							<b-form-group label="Qtd. de sementes / Kg *" v-bind:description="form.field_seeds_kg[0].value > 0 ? form.field_seeds_kg[0].value + ' sementes / Kg' : ''">
								<b-form-input v-model="form.field_seeds_kg[0].value" type="number"></b-form-input>
							</b-form-group>
						</div>
						<div class="col-md-4">
							<b-form-group label="Taxa de viabilidade *" v-bind:description="(form.field_viability_rate[0].value || 0) + '% de viabilidade'">
								<b-form-input v-model="form.field_viability_rate[0].value" type="range"></b-form-input>
							</b-form-group>
						</div>
						<div class="col-md-4">
							<b-form-group label="Limite de peso por lote (g)" v-bind:description="form.field_lot_limit[0].value > 0 ? 'Limite de '+ form.field_lot_limit[0].value + ' gramas por lote' : ''"> 
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
							<b-form-group label="Fotos" description="Tipos permetidos: PNG, GIF, JPG e JPEG. Tamanho máximo 32 MB.">
								<b-form-file ref="files" id="files" multiple accept="image/*" v-on:change="uploadImages"></b-form-file>
							</b-form-group>
							<div class="row images_preview" v-if="images_preview.length > 0">
								<div class="col-md-4" v-for="(image, index) in images_preview" v-bind:key="index">
									<img v-bind:src="(image.uri ? baseURL() + image.uri[0].url : image.url)">
									<br>
									<br>
									<p class="text-center"><a class="btn btn-default btn-small" @click="deleteImage(index)"><i class="fa fa-trash"></i></a></p>
								</div>
							</div>
						</div>					
					</div>					
					<div class="row">
						<div class="col-md-12 text-center">
							<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
							<b-alert variant="danger" show v-if="errors && errors.items.length">Verifique os erros acima para continuar</b-alert>
							<div class="btn-group">
								<button role="button" class="btn btn-primary btn-lg fa fa-save"> Salvar</button>
							</div>
						</div>
						<pre>{{variations_form}}</pre>
						<pre>{{form}}</pre>
					</div>	
				</b-form>
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
		}
	},
	
	created () {

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

		if (this.$route.params.id) {
			this.edit(this.$route.params.id)
		}


	},
	
	methods: {
		edit(id) {
			axios.get('product/' + id + '?_format=json').then(response => {
				var data = response.data
				this.apiDataToForm(this.form, data)
				if (data && data.variations) {
					axios.get('entity/commerce_product_variation/' + data.variations[0].target_id + '?_format=json').then(resp => {
						this.apiDataToForm(this.variations_form, resp.data)
						this.images_preview = data.field_images

					}).catch(error => {
						this.error = error
					});
				}
			}).catch(error => {
				this.error = error
			});
		},
		save() {
			this.$validator.validate().then(result => {
        if (result) {
					this.error = false
					this.variations_form.uid = [{ target_id: this.currentUser.current_user.uid }]
					this.variations_form.sku[0].value = slugify(this.form.title[0].value.toLowerCase()) + "-" + Date.now()
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
						this.error = error
					})				
        }
      })
		},

		uploadImages(e) {
			let files = e.target.files || e.dataTransfer.files;
			
			for (var i = 0; i < files.length; i++) {

				var reader  = new FileReader();
				var file = files[i]
				reader.onloadend = () => {
					axios({
						method  : 'POST',
						url     : "file/upload/commerce_product/seed/field_images?_format=json",
						headers : {
							'Content-Type' : 'application/octet-stream',
							'Content-Disposition': 'file; filename="' + file.name + '"',
							'Authorization': 'Basic c2VtZW50ZXMtYWRtaW46bjNqdWtqZjk4NG4=',
							'X-CSRF-Token': this.currentUser.csrf_token
						},
						data    : reader.result,
					})
					.then(response => {
						this.images_preview.push(response.data)
						this.form.field_images.push({ target_id: response.data.fid[0].value })
					})
					.catch(() => {
						this.error ="Ocorreu um erro ao enviar: "+ file.name
					});	

				}

				reader.readAsArrayBuffer(files[i]);

			}


		},
		deleteImage(index) {
			this.$delete(this.images_preview, index)
			this.$delete(this.form.field_images, index)
		},
		baseURL() {
			return axios.defaults.baseURL
		},
		apiDataToForm(form, data) {
			Object.keys(form).map((key) => {
				var field = data[key]
				if (field && field.length) {
					form[key] = field.map((f) => {
						if (f.value) {
							return { value: f.value }
						}	else if (f.number) {
							return { number: Number(f.number) }
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
