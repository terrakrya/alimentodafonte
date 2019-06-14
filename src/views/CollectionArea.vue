<template>
	<div class="collection-area">
		<breadcrumb :links="[['Áreas de coleta', '/areas-de-coleta']]" active="Dados da área" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="isLoading" />
				<div v-if="collection_area && !isLoading">
					<div class="row item-title">
						<div class="col-md-10">
							<h1>
								{{ collection_area.title }}								
							</h1>
							<p v-if="collection_area.city">
								<span>{{ collection_area.city }}</span>
							</p>
						</div>
					</div>
					<hr class="clearfix">
					<div class="list-group entity-select-preview">
						<div class="list-group-item active">
							<strong>Detalhes</strong>
							<i @click="edit" class="pull-right fa fa-pencil"></i>
						</div>
						<div class="list-group-item">
							<div class="row">
								<div class="col-sm-6" >
									<dl v-if="collection_area.description">
										<dd>{{ collection_area.description }}</dd>
									</dl>
									<dl v-if="collection_area.collectors_group">
										<dt>Grupo de coletores</dt>
										<dd>
											<router-link v-if="collection_area.collectors_group" :to="'/grupo-de-coletores/'+ collection_area.collectors_group.id">{{collection_area.collectors_group.title}}</router-link>
										</dd>
									</dl>
									<dl v-if="collection_area.collector">
										<dt>Coletor</dt>
										<dd>
											<router-link v-if="collection_area.collector" :to="'/coletor/'+ collection_area.collector.id">{{collection_area.collector.title}}</router-link>
										</dd>
									</dl>
									<dl v-if="collection_area.estimated_area">
										<dt>Área estimada</dt>
										<dd>{{ collection_area.estimated_area }} hectares</dd>
									</dl>
								</div>
								<div class="col-sm-6" >
									<dl v-if="collection_area.geolocation">
										<dt>Latitude</dt>
										<dd>{{ collection_area.geolocation.lat }}</dd>
									</dl>
									<dl v-if="collection_area.geolocation">
										<dt>Longitude</dt>
										<dd>{{ collection_area.geolocation.lng }}</dd>
									</dl>
									<dl v-if="collection_area.file">
										<dt>Documento anexo</dt>
										<dd><a :href="collection_area.file" target="_blank"><i class="fa fa-download"></i> {{ fileName }}</a></dd>
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
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'

export default {

	name: 'CollectionArea', 

	data () {
		return { 
			
		}
	},
	created () {
		this.getList('collection_areas')
	},
	computed: {
		loading () {
			return !this.collection_area
		},
		collection_area () {
			if (this.$store.state.collection_areas) {
				return this.$store.state.collection_areas.find(c => c.id == this.$route.params.id)	
			}
			return null
		},
		fileName () {
			if (this.collection_area.file) {
				let url = this.collection_area.file.split('/')
				return url[url.length -1]				
			}
			return ''
		}
	},
	methods: {
		edit () {
			this.$router.replace('/editar-area-de-coleta/'+this.collection_area.id)
		}
	},

	components: { 
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
