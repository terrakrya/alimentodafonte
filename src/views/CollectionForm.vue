<template>
	<div class="collection-form">
		<breadcrumb :links="[['Coletas de sementes', '/coletas']]" :active="isEditing() ? 'Coleta ' + $route.params.id : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="coleta" />
				<loading :loading="loading" />
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Data e hora da coleta *" class="date_time">
								<b-form-input class="date" v-model="date_time.date" type="date" v-validate="'required'" name="date_time"/>
								<b-form-input class="time" v-model="date_time.time" placeholder="00:00" type="text" v-mask="['##:##']" />
								<field-error :msg="veeErrors" field="field_seeds_collect_date_time" />
							</b-form-group>							
						</div>					
						<div class="col-sm-6">
							<b-form-group label="Semente" >
								<form-entity-select v-if="seeds" :items="seeds" :form="form" field="field_seeds_collect_seed" />
							</b-form-group>							
						</div>					
					</div>					
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Grupo de coletores" >
								<form-entity-select v-if="collectors_groups" :items="collectors_groups" :form="form" field="field_seeds_collect_group" />
							</b-form-group>							
						</div>					
						<div class="col-sm-6">
							<b-form-group label="Coletor" >
								<form-entity-select v-if="collectors" :items="collectors" :form="form" field="field_seeds_collect_collector" />
							</b-form-group>							
						</div>					
					</div>					
					<div class="row gray">
						<div class="col-sm-4">
							<b-form-group label="Peso bruto (Kg)" >
								<b-form-input v-model="form.field_seeds_collect_weight_gross[0].value" type="number" />
							</b-form-group>							
						</div>
						<div class="col-sm-4">
							<b-form-group label="Peso beneficiado (Kg)" >
								<b-form-input v-model="form.field_seeds_collect_weight_benef[0].value" type="number" />
							</b-form-group>							
						</div>					
						<div class="col-sm-4">
							<b-form-group label="Período de florescimento" >
								<b-form-input v-model="form.field_seeds_collect_flowering[0].value" type="date" />
							</b-form-group>							
						</div>					
					</div>					
					<div class="row">
						<div class="col-sm-6">
							<pictures-upload :form="form" :preview="pictures_preview" :error="error" field="field_seeds_collect_photo" url="file/upload/node/seeds_collection/field_seeds_collect_photo?_format=json" :multiple="true" /> 
						</div>
						<div class="col-sm-6">
							<audios-upload :form="form" :preview="audios_preview" :error="error" field="field_seeds_collect_audio" url="file/upload/node/seeds_collection/field_seeds_collect_audio?_format=json" /> 
						</div>
					</div>	
					<div class="row gray">
						<div class="col-sm-6">
							<b-form-group label="Comentários" description="Insira aqui os comentários sobre esta coleta">
								<b-form-textarea v-model="form.field_seeds_collect_commentary[0].value" :rows="3" />
							</b-form-group>							
						</div>
						<div class="col-sm-6">
							<b-form-group label="Latitude" >
								<b-form-input v-model="form.field_seeds_collect_geolocation[0].lat" />
							</b-form-group>							
							<b-form-group label="Longitude" >
								<b-form-input v-model="form.field_seeds_collect_geolocation[0].lng" />
							</b-form-group>							
						</div>					
					</div>					
					<form-submit :error="error" :sending="sending" />
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
import AudiosUpload from '@/components/AudiosUpload'
import PicturesUpload from '@/components/PicturesUpload'

export default {
	
	name: 'CollectionForm', 
	
	data () {

		return { 
			error: false,
			loading: false,
			sending: false,
			pictures_preview: [],
			audios_preview: [],
			date_time: { date: '', time: '' },
			form: {
				type:[{ target_id: "seeds_collection" }],
				title: [{ value: 'Cadastrado pelo frontend' }],
				field_seeds_collect_weight_gross: [{ value: '' }],
				field_seeds_collect_weight_benef: [{ value: '' }],
				field_seeds_collect_flowering: [{ value: '' }],
				field_seeds_collect_collector: [{ target_id: '' }],
				field_seeds_collect_group: [{ target_id: '' }],
				field_seeds_collect_seed: [{ target_id: '' }],
				field_seeds_collect_photo: [],
				field_seeds_collect_audio: [],
				field_seeds_collect_commentary: [{ value: '' }],
				field_seeds_collect_geolocation: [{ lat: '', lng: '' }],
				field_seeds_collect_date_time: [{ value: '' }],
			},
		}
	},
	
	created () {

		this.getList('collectors')
		this.getList('collectors_groups')
		this.getList('seeds')

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
		},
		seeds () {
			return this.$store.state.seeds
		}
	},
	methods: {
		edit (id) {
			this.loading = true
			axios.get('node/' + id + '?_format=json').then(response => {
				var data = response.data
				this.apiDataToForm(this.form, data)

				this.pictures_preview = response.data.field_seeds_collect_photo
				this.audios_preview = response.data.field_seeds_collect_audio

				if (this.present(this.form.field_seeds_collect_date_time)){
					var dt = this.form.field_seeds_collect_date_time[0].value.split('T')
					this.date_time.date = dt[0]
					this.date_time.time = dt[1]
				}
				this.loading = false
			}).catch(error => { this.error = error.message; this.loading = false });
		},
		save () {
			this.$validator.validate().then(isValid => {
				if (isValid) {
					this.sending = true
					this.error = false
					if (this.date_time.date && this.date_time.time) {
						this.form.field_seeds_collect_date_time[0].value = this.date_time.date+'T'+this.date_time.time+':00'						
					}

					axios({
						method: (this.isEditing() ? 'PATCH' : 'POST'),
						url: 'node' + (this.isEditing() ? '/' + this.$route.params.id : '')+'?_format=json',
						data: this.form
					}).then(resp => {
						var collection = resp.data
						if (collection && collection.nid) {
							this.loadList('collections')
							this.$router.replace('/coleta/'+collection.nid[0].value)
						}
						this.sending = false						
					}).catch(error => { this.error = error.response; this.sending = false })
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
		AudiosUpload,
		PicturesUpload
	}

};
</script>
