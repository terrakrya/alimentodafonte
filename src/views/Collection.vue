<template>
	<div class="collection-area">
		<breadcrumb :links="[['Coletas de sementes', '/coletas']]" active="Dados da coleta" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="loading" />
				<div v-if="collection && !loading">
					<div class="row item-title">
						<div class="col-md-2" v-if="collection.photos && collection.photos.length">
							<img :src="collection.photos[0]" class="img-responsive item-img" />
						</div>
						<div class="col-md-10">
							<h1>
								<span v-if="collection.seed">Coleta de {{ collection.seed.title }}</span>				
								<small v-if="collection.date_time"><br>{{collection.date_time | moment("DD/MM/YYYY H:mm:ss")}}</small>
							</h1>
							<p>
								<router-link v-if="collection.collectors_group" :to="'/grupo-de-coletores/'+ collection.collectors_group.id">
									&bull; {{collection.collectors_group.title}}
								</router-link>
								<router-link v-if="collection.collector" :to="'/coletor/'+ collection.collector.id">	
									&bull; {{collection.collector.title}}
								</router-link>
							</p>
							<router-link :to="'/editar-coleta/'+collection.id" class="btn btn-default btn-xs">
								<i class="fa fa-edit" aria-hidden="true"></i>
								Editar coleta
							</router-link>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-6" v-if="collection.weight_gross">
							<div class="weekly-summary text-center">
								<span class="info-label">Peso bruto</span>
								<span class="number">{{ collection.weight_gross | currency('', 0, { thousandsSeparator: '' }) }} Kg</span>
							</div>
						</div>
						<div class="col-sm-6" v-if="collection.weight_benef">
							<div class="weekly-summary text-center">
								<span class="info-label">Peso beneficiado</span>
								<span class="number">{{ collection.weight_benef | currency('', 0, { thousandsSeparator: '' }) }} Kg</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12" >
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Detalhes</strong>
								</div>
								<div class="list-group-item">
									<div class="row" v-if="collection.commentary"> 
										<div class="col-sm-12">
											<p class="details" colspan="2" v-html="collection.commentary"></p>
										</div>
									</div>
									<div class="row"> 
										<div class="col-sm-6">
											<dl v-if="collection.flowering">
												<dt>Período de florescimento</dt>
												<dd>{{ collection.flowering | moment("DD/MM/YYYY") }}</dd>
											</dl>
											<dl v-if="collection.audio">
												<dt>Áudio</dt>
												<dd><a :href="collection.audio" target="_blank"><i class="fa fa-download"></i> {{ fileName(collection.audio) }}</a></dd>
											</dl>
										</div>
										<div class="col-sm-6">
											<dl v-if="collection.geolocation">
												<dt>Latitude</dt>
												<dd>{{ collection.geolocation.lat }}</dd>
											</dl>
											<dl v-if="collection.geolocation">
												<dt>Longitude</dt>
												<dd>{{ collection.geolocation.lng }}</dd>
											</dl>
										</div>
									</div>
									<div class="row" v-if="collection.photos && collection.photos.length > 1">
										<div class="col-sm-4" v-for="(photo, index) in collection.photos" :key="index">
											<b-img :src="photo" fluid thumbnail :key="index" />
										</div>
									</div>
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
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'

export default {

	name: 'Collection', 

	data () {
		return { 
			error: false
		}
	},
	computed: {
		loading () {
			return !this.collection
		},
		collection () {
			if (this.$store.state.collections) {
				return this.$store.state.collections.find(c => c.id == this.$route.params.id)	
			}
			return null
		}
	},
	created () {
		this.getList('collections')
	},
	methods: {
		edit () {
			this.$router.replace('/editar-coleta/'+this.collection.id)
		},
		fileName (fileUrl) {
			if (fileUrl) {
				let url = fileUrl.split('/')
				return decodeURIComponent(url[url.length -1])
			}
		}
	},
	components: { 
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
