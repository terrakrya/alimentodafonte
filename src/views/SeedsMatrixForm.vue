<template>
	<div class="seeds-matrix-form">
		<breadcrumb :links="[['Matrizes de semente', '/matrizes-de-sementes']]" :active="isEditing() ? form.title[0].value : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="matriz de sementes" />
				<loading :isLoading="loading" />
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Nome da matriz *">
								<b-form-input v-model="form.title[0].value" v-validate="'required'" name="title" />
								<field-error :msg="veeErrors" field="title" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="Nome científico">
								<b-form-input v-model="form.field_seed_matrix_scient_name[0].value" />
							</b-form-group>							
						</div>
					</div>
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Grupo de coletores" >
								<form-entity-select v-if="collectors_groups" :items="collectors_groups" :form="form" field="field_seed_matrix_group" />
							</b-form-group>							
						</div>					
						<div class="col-sm-6">
							<b-form-group label="Coletor" >
								<form-entity-select v-if="collectors" :items="collectors" :form="form" field="field_seed_matrix_collector" />
							</b-form-group>							
						</div>					
					</div>					
					<div class="row gray">
						<div class="col-sm-6">
							<b-form-group label="Latitude" >
								<b-form-input v-model="form.field_geolocation[0].lat" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="Longitude" >
								<b-form-input v-model="form.field_geolocation[0].lng" />
							</b-form-group>							
						</div>					
					</div>					
					<div class="row">
						<div class="col-sm-4">
							<b-form-group label="Categoria *">
								<b-form-radio-group v-model="form.field_seed_matrix_category[0].value" :options="categorias_de_matrizes" stacked v-validate="'required'" name="field_seed_matrix_category" />
								<field-error :msg="veeErrors" field="field_seed_matrix_category" />
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Origem *">
								<b-form-radio-group v-model="form.field_seed_matrix_source[0].value" :options="origens_de_matrizes" stacked v-validate="'required'" name="field_seed_matrix_source" />
								<field-error :msg="veeErrors" field="field_seed_matrix_source" />
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Meses prováveis de coleta">
								<b-form-checkbox-group v-model="form.field_seed_matrix_collec_month" :options="meses" stacked />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12">
							<documents-upload :form="form" :multiple="true" :preview="documents_preview" :error="error" field="field_seed_matrix_files" url="file/upload/node/seed_matrix/field_seed_matrix_files?_format=json" /> 
						</div>
					</div>	
					<form-submit :errors="error" :sending="sending" />
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
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import DocumentsUpload from '@/components/DocumentsUpload'
import categorias_de_matrizes from '@/data/categorias_de_matrizes.json'
import origens_de_matrizes from '@/data/origens_de_matrizes.json'
import meses from '@/data/meses.json'


export default {
	
	name: 'SeedsMatrixForm', 
	
	data () {

		return { 
			
			
			
			categorias_de_matrizes: categorias_de_matrizes,
			origens_de_matrizes: origens_de_matrizes,
			meses: meses,
			documents_preview: [],
			form: {
				type:[{ target_id: "seed_matrix" }],
				title: [{ value: '' }],
				field_seed_matrix_scient_name: [{ value: '' }],
				field_seed_matrix_category: [{ value: '' }],
				field_seed_matrix_source: [{ value: '' }],
				field_seed_matrix_code: [{ value: '' }],
				field_geolocation: [{ lat: '', lng: '' }],
				field_seed_matrix_files: [],
				field_seed_matrix_collec_month: [],
				field_seed_matrix_group: [],
				field_seed_matrix_collector: [],
			},
		}
	},
	
	created () {

		this.getList('collectors')
		this.getList('collectors_groups')

		if (this.isEditing()) {
			this.edit(this.$route.params.id)
		}

	},
	computed: {
		collectors () {
			return this.$store.state.collectors
		},
		collectors_groups () {
			return this.$store.state.collectors_groups
		}
	},
	methods: {
		edit (id) {
			this.loading = true
			axios.get('node/' + id + '?_format=json').then(response => {
				var data = response.data
				this.apiDataToForm(this.form, data)
				this.documents_preview = response.data.field_seed_matrix_files
				this.loading = false
			}).catch(this.showError);
		},
		save () {
			this.$validator.validate().then(isValid => {
				if (isValid) {
					this.sending = true
					this.error = false
					
					this.form.field_seed_matrix_code = [{ value: 'teste' }]
					
					if (this.present(this.form.geolocation, 'lat')) {
						this.form.geolocation[0].lat = Number(this.form.geolocation[0].lat)
					}
					if (this.present(this.form.geolocation, 'lng')) {
						this.form.geolocation[0].lng = Number(this.form.geolocation[0].lng)
					}
					
					axios({
						method: (this.isEditing() ? 'PATCH' : 'POST'),
						url: 'node' + (this.isEditing() ? '/' + this.$route.params.id : '')+'?_format=json',
						data: this.form
					}).then(resp => {
						var seeds_matrix = resp.data
						if (seeds_matrix && seeds_matrix.nid) {
							this.loadList('seeds_matrixes')
							this.$router.replace('/matriz-de-sementes/'+seeds_matrix.nid[0].value)
						}
						this.sending = false						
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
		FormSubmit, 
		FieldError,
		DocumentsUpload
	}

};
</script>
