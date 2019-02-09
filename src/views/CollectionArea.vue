<template>
	<div class="collection-area">
		<breadcrumb v-bind:links="[['Áreas de coleta', '/areas-de-coleta']]" active="Dados da área" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading v-bind:loading="loading" />
				<div v-if="collection_area && !loading">
					<div class="row item-title">
						<div class="col-md-10">
							<h1>
								{{ collection_area.title[0].value }}								
							</h1>
							<p v-if="collection_area.field_state.length">
								<span>{{ [collection_area.field_state[0].locality, collection_area.field_state[0].administrative_area].filter(Boolean).join(' - ') }}</span>
							</p>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-6" >
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Detalhes</strong>
									<i @click="edit" class="pull-right fa fa-pencil"></i>
								</div>
								<div class="list-group-item">
									<dl v-if="present(collection_area.field_description)">
										<dd>{{ collection_area.field_description[0].value }}</dd>
									</dl>
									<dl v-if="present(collection_area.field_estimated_area)">
										<dt>Área estimada</dt>
										<dd>{{ collection_area.field_estimated_area[0].value }} hectares</dd>
									</dl>
									<dl v-if="present(collection_area.field_upload, 'url')">
										<dt>Documento anexo</dt>
										<dd><a v-bind:href="collection_area.field_upload[0].url" target="_blank"><i class="fa fa-download"></i> {{ fileName }}</a></dd>
									</dl>
								</div>
							</div>
						</div>
						<div class="col-sm-6" >
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Localização</strong>
								</div>
								<div class="list-group-item">
									<dl v-if="present(collection_area.field_geolocation, 'lat')">
										<dt>Latitude</dt>
										<dd>{{ collection_area.field_geolocation[0].lat }}</dd>
									</dl>
									<dl v-if="present(collection_area.field_geolocation, 'lng')">
										<dt>Longitude</dt>
										<dd>{{ collection_area.field_geolocation[0].lng }}</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'

export default {

	name: 'CollectionArea', 

	data () {
		return { 
			collection_area: null,
			error: false,
			loading: false,
		}
	},

	computed: {
		fileName () {
			let url = this.collection_area.field_upload[0].url.split('/')
			return url[url.length -1]
		}
	},

	created () {
		
		this.loading = true
		
		axios.get('node/' + this.$route.params.id + '?_format=json').then(collection_area => {
			this.collection_area = collection_area.data 
			this.loading = false
		}).catch(error => { this.error = error.message, this.loading = false })

	},

	methods: {
		edit () {
			this.$router.replace('/editar-area-de-coleta/'+this.collection_area.nid[0].value)
		}
	},

	components: { 
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
