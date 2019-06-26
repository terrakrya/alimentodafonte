<template>
	<div class="collection-area">
		<breadcrumb :links="[['Coletas de sementes', '/coletas']]" active="Dados da coleta" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="isLoading" />
				<div v-if="collection && !isLoading">
					<div class="row item-title">
						<div class="col-md-2" v-if="collection.images && collection.images.length">
							<img :src="baseUrl + collection.images[0].thumb" class="img-responsive item-img" />
						</div>
						<div class="col-md-10">
							<h1>
								<span v-if="collection.seed">Coleta de {{ collection.seed.name }}</span>
								<small v-if="collection.date_time"><br>{{collection.date_time | moment("DD/MM/YYYY HH:mm")}}</small>
							</h1>
							<p>
								<router-link v-if="collection.collectors_group" :to="'/grupo-de-coletores/'+ collection.collectors_group._id">
									&bull; {{collection.collectors_group.name}}
								</router-link>
								<router-link v-if="collection.collector" :to="'/coletor/'+ collection.collector._id">
									&bull; {{collection.collector.name}}
								</router-link>
							</p>
							<router-link :to="'/editar-coleta/'+collection._id" class="btn btn-default btn-xs">
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
								<span class="number">{{ collection.weight_gross }} Kg</span>
							</div>
						</div>
						<div class="col-sm-6" v-if="collection.weight_benef">
							<div class="weekly-summary text-center">
								<span class="info-label">Peso beneficiado</span>
								<span class="number">{{ collection.weight_benef }} Kg</span>
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
												<dd><a :href="baseUrl + collection.audio" target="_blank"><i class="fa fa-music"></i> {{ fileName(collection.audio) }}</a></dd>
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
									<div class="row" v-if="collection.images && collection.images.length > 1">
										<div class="col-sm-4" v-for="(image, index) in collection.images" :key="index">
											<b-img :src="baseUrl + image.thumb" fluid thumbnail :key="index" />
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
import axios from 'axios'
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'

export default {

	name: 'Collection',

	data() {
    return {
      collection: null
    }
  },
  created() {
    this.isLoading = true
    axios.get('collections/' + this.$route.params.id, {
      params: {
        populate: 'collectors_group collector seed'
      }
    }).then(response => {
      this.collection = response.data
      this.isLoading = false
    }).catch(this.showError);
  },
	methods: {
		edit () {
			this.$router.replace('/editar-coleta/'+this.collection._id)
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
