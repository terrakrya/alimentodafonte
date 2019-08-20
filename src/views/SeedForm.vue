<template>
	<div class="seed-form">
		<breadcrumb :links="[['Sementes', '/sementes']]" :active="isEditing() ? form.name : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="semente" />
				<loading :loading="isLoading" />
				<b-form @submit.prevent="save" v-if="!isLoading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Nome da espécie *">
								<b-form-input v-model="form.name" v-validate="'required'" name="name"/>
								<field-error :msg="veeErrors" field="name" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Nome científico *">
								<b-form-input v-model="form.scientific_name" v-validate="'required'" name="scientific_name"  />
								<field-error :msg="veeErrors" field="scientific_name" />
							</b-form-group>
						</div>
					</div>
					<div class="row gray">
						<div class="col-md-12">
							<b-form-group label="Nome(s) regional(is)" description="Escreva todos os nome regionais que essa semente possa ter separado por virgula.">
								<b-form-input v-model="form.local_name" name="local_name" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<b-form-group label="Descrição da semente">
								<b-form-textarea v-model="form.description" :rows="3"></b-form-textarea>
							</b-form-group>
						</div>
					</div>
					<div class="row gray">
						<div class="col-md-3 col-sm-6">
							<b-form-group label="Preço *">
								<money v-model="form.price"></money>
							</b-form-group>
						</div>
						<div class="col-md-3 col-sm-6">
							<b-form-group label="Preço no atacado *">
								<money v-model="form.wholesale_price"></money>
							</b-form-group>
						</div>
						<div class="col-md-3 col-sm-6">
							<b-form-group label="Remuneração do coletor *">
								<money v-model="form.compensation_collect"></money>
							</b-form-group>
						</div>
						<div class="col-md-3 col-sm-6">
							<b-form-group label="Qtd. em estoque (Kg)">
								<b-form-input v-model="form.stock" type="number" step="0.01" lang="nb" min="0" disabled="disabled" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-4">
							<b-form-group label="Qtd. de sementes / Kg *" :description="form.seeds_kg > 0 ? form.seeds_kg + ' sementes por quilo' : ''">
								<b-form-input v-model="form.seeds_kg" type="number" step="0.01" lang="nb" min="0" v-validate="'required'" name="seeds_kg"  />
								<field-error :msg="veeErrors" field="seeds_kg" />
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Taxa de viabilidade *" :description="(form.viability_rate || 0) + '% de viabilidade'">
								<b-form-input v-model="form.viability_rate" type="range" v-validate="'required'" name="viability_rate" />
								<field-error :msg="veeErrors" field="viability_rate" />
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Limite de peso por lote (Kg)" :description="form.lot_limit > 0 ? 'Limite de '+ form.lot_limit + ' quilos por lote' : ''">
								<b-form-input type="number" step="0.01" lang="nb" min="0" v-model="form.lot_limit" />
							</b-form-group>
						</div>
					</div>
					<div class="row gray">
						<div class="col-sm-6">
							<b-form-group label="Ecossistema">
								<b-form-checkbox-group v-model="form.ecosystem" :options="ecossistemas" name="ecosystem" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Época da frutificação">
								<b-form-checkbox-group  v-model="form.fruiting_season" :options="meses" name="fruiting_season" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<pictures-upload :form="form" :preview="this.images_preview" :error="error" field="images" url="uploads/images" :multiple="true"  />
						</div>
					</div>
					<form-submit :errors="error" :sending="isSending"/>
				</b-form>
			</div>
		</div>
		<pre>
			{{form}}
		</pre>
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
import meses from '@/data/meses.json'
import ecossistemas from '@/data/ecossistemas.json'

export default {

	name: 'SeedForm',

	data () {

		return {
			meses: meses,
			ecossistemas: ecossistemas,
			form: {
				name: '',
				scientific_name: '',
				local_name: '',
				description: '',
				seeds_kg: 0,
				viability_rate: 50,
				lot_limit: 0,
				compensation_collect: 0,
				price: 0,
				wholesale_price: 0,
				stock: 0,
				ecosystem: [],
				fruiting_season: [],
				images: []
			},
			images_preview: [],
		}
	},

	created () {
		if (this.isEditing()) {
			this.edit(this.$route.params.id)
		}
	},

	methods: {
		edit(id) {
			this.isLoading = true
			axios.get('seeds/' + id).then(response => {
				var data = response.data
				this.apiDataToForm(this.form, data)
				Object.assign(this.images_preview, data.images)
				this.isLoading = false
			}).catch(this.showError);
		},
		save() {
			this.$validator.validate().then(isValid => {
				if (isValid) {
					this.isSending = true
					this.error = false
					axios({
						method: (this.isEditing() ? 'PUT' : 'POST'),
						url: (this.isEditing() ? 'seeds/'+ this.$route.params.id : 'seeds'),
						data: this.form
					}).then(resp => {
						var seed = resp.data
						if (seed && seed._id) {
							this.$router.replace('/semente/'+seed._id)
						} else {
							this.error = seed
						}
						this.isSending = false
					}).catch(this.showError)

				}
			})
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
