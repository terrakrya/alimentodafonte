<template>
	<div class="collection-area-form">
		<breadcrumb v-bind:links="[['Áreas de coleta', '/areas-de-coleta']]" v-bind:active="isEditing() ? form.title[0].value : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="área de coleta" />
				<loading v-bind:loading="loading" />
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-sm-12">
							<b-form-group label="Nome da área *">
								<b-form-input v-model="form.title[0].value" v-validate="'required'" name="title" />
								<field-error v-bind:msg="veeErrors" field="title" />
							</b-form-group>							
						</div>
					</div>						
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Descrição da área" description="Descreva aqui as características da área">
								<b-form-textarea v-model="form.field_description[0].value" :rows="3" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<documents-upload v-bind:form="form" v-bind:preview="documents_preview" v-bind:error="error" field="field_upload" url="file/upload/node/collection_area/field_upload?_format=json" /> 
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
import FieldError from '@/components/FieldError'
import DocumentsUpload from '@/components/DocumentsUpload'

export default {
	
	name: 'CollectionAreaForm', 
	
	data () {

		return { 
			error: false,
			loading: false,
			sending: false,
			documents_preview: [],
			form: {
				type:[{ target_id: "collection_area" }],
				title: [{ value: '' }],
				field_location_name: [{ value: '' }],
				field_description: [{ value: '' }],
				field_geolocation: [{ lat: '', lng: '' }],
				field_upload: [],
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
			axios.get('node/' + id + '?_format=json').then(response => {
				var data = response.data
				this.apiDataToForm(this.form, data)
				this.documents_preview = response.data.field_upload
				this.loading = false
			}).catch(error => { this.error = error.message; this.loading = false });
		},
		save () {
			this.$validator.validate().then(isValid => {
				if (isValid) {
					this.sending = true
					this.error = false

					this.form.field_location_name = this.form.title

					axios({
						method: (this.isEditing() ? 'PATCH' : 'POST'),
						url: 'node' + (this.isEditing() ? '/' + this.$route.params.id : '')+'?_format=json',
						data: this.form
					}).then(resp => {
						var collection_area = resp.data
						if (collection_area && collection_area.nid) {
							this.$router.replace('/area-de-coleta/'+collection_area.nid[0].value)
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
		FormSubmit, 
		FieldError,
		DocumentsUpload
	}

};
</script>
