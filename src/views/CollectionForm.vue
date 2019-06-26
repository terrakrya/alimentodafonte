<template>
	<div class="collection-form">
		<breadcrumb :links="[['Coletas de sementes', '/coletas']]" :active="isEditing() ? 'Coleta ' : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="coleta" />
				<loading :loading="isLoading" />
				<b-form @submit.prevent="save" v-if="!isLoading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Data e hora da coleta *" class="date_time">
								<b-form-input class="date" v-model="date_time.date" type="date" v-validate="'required'" name="date_time"/>
								<b-form-input class="time" v-model="date_time.time" placeholder="00:00" type="text" v-mask="['##:##']" />
								<field-error :msg="veeErrors" field="date_time" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Semente" >
								<form-entity-select type="seeds" :form="form" field="seed" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Grupo de coletores" >
								<form-entity-select type="collectors_groups" :form="form" field="collectors_group" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Coletor" >
								<form-entity-select type="collectors" :form="form" field="collector" />
							</b-form-group>
						</div>
					</div>
					<div class="row gray">
						<div class="col-sm-4">
							<b-form-group label="Peso bruto (Kg)" >
								<b-form-input v-model="form.weight_gross" type="number" />
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Peso beneficiado (Kg)" >
								<b-form-input v-model="form.weight_benef" type="number" />
							</b-form-group>
						</div>
						<div class="col-sm-4">
							<b-form-group label="Período de florescimento" >
								<b-form-input v-model="form.flowering" type="date" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-6">
							<pictures-upload :form="form" :error="error" field="images" url="uploads/images" :multiple="true" />
						</div>
						<div class="col-sm-6">
							<audios-upload :form="form" :error="error" field="audio" url="uploads/audios" />
						</div>
					</div>
					<div class="row gray">
						<div class="col-sm-6">
							<b-form-group label="Comentários" description="Insira aqui os comentários sobre esta coleta">
								<b-form-textarea v-model="form.commentary" :rows="3" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Latitude" >
								<b-form-input v-model="form.geolocation.lat" />
							</b-form-group>
							<b-form-group label="Longitude" >
								<b-form-input v-model="form.geolocation.lng" />
							</b-form-group>
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
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import AudiosUpload from '@/components/AudiosUpload'
import PicturesUpload from '@/components/PicturesUpload'

export default {
	name: 'CollectionForm',
	data () {
		return {
			date_time: { date: '', time: '' },
			form: {
				date_time: '',
				weight_gross: '',
				weight_benef: '',
				flowering: '',
				collector: null,
				collectors_group: null,
				seed: null,
				images: [],
				audio: null,
				commentary: '',
				geolocation: {
          lat: "",
          lng: ""
        },
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
			axios.get('collections/' + id).then(response => {
				var data = response.data
				this.apiDataToForm(this.form, data)

				if (this.form.date_time){
					var dt = this.form.date_time.split('T')
					this.date_time.date = dt[0]
					this.date_time.time = dt[1]
				}
				this.isLoading = false
			}).catch(this.showError);
		},
		save () {
			this.$validator.validate().then(isValid => {
				if (isValid) {
					this.isSending = true
					this.error = false
					if (this.date_time.date && this.date_time.time) {
						this.form.date_time = this.date_time.date+'T'+this.date_time.time+':00'
					}
					axios({
						method: (this.isEditing() ? 'PUT' : 'POST'),
						url: 'collections' + (this.isEditing() ? '/' + this.$route.params.id : ''),
						data: this.form
					}).then(resp => {
						var collection = resp.data
						if (collection && collection._id) {
							this.$router.replace('/coleta/'+collection._id)
						}
						this.isSending = false
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
		AudiosUpload,
		PicturesUpload
	}

};
</script>
