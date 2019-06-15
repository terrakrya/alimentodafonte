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
								{{ collection_area.name }}
							</h1>
							<p v-if="collection_area.address">
								<span>{{ collection_area.address | address }}</span>
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
									<dl v-if="collection_area.estimated_area">
										<dt>Área estimada</dt>
										<dd>{{ collection_area.estimated_area }} hectares</dd>
									</dl>
									<dl v-if="collection_area.collectors_group">
										<dt>Grupo de coletores</dt>
										<dd>
											<router-link v-if="collection_area.collectors_group" :to="'/grupo-de-coletores/'+ collection_area.collectors_group._id">{{collection_area.collectors_group.name}}</router-link>
										</dd>
									</dl>
									<dl v-if="collection_area.collector">
										<dt>Coletor</dt>
										<dd>
											<router-link v-if="collection_area.collector" :to="'/coletor/'+ collection_area.collector._id">{{collection_area.collector.name}}</router-link>
										</dd>
									</dl>
								</div>
								<div class="col-sm-6" >
									<dl v-if="collection_area.geolocation && collection_area.geolocation.lat">
										<dt>Latitude</dt>
										<dd>{{ collection_area.geolocation.lat }}</dd>
									</dl>
									<dl v-if="collection_area.geolocation && collection_area.geolocation.lng">
										<dt>Longitude</dt>
										<dd>{{ collection_area.geolocation.lng }}</dd>
									</dl>
									<dl v-if="collection_area.documents && collection_area.documents.length">
										<dt>Documento anexo</dt>
										<dd v-for="(document, index) in collection_area.documents"><a :href="document" target="_blank"><i class="fa fa-download"></i> {{document | filename}}</a></dd>
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
			collection_area: null
		}
	},
	created () {
		this.isLoading = true
    axios.get('collection_areas/' + this.$route.params.id, {
      params: {
        populate: 'collectors_group collector'
      }
    }).then(response => {
      this.collection_area = response.data
      this.isLoading = false
    }).catch(this.showError);
	},
	methods: {
		edit () {
			this.$router.replace('/editar-area-de-coleta/'+this.collection_area._id)
		}
	},

	components: {
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
