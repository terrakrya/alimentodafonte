<template>
	<div class="seeds-matrix">
		<breadcrumb :links="[['Matrizes de sementes', '/matrizes-de-sementes']]" active="Dados da matriz" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="isLoading" />
				<div v-if="seeds_matrix && !isLoading">
					<div class="row item-title">
						<div class="col-md-10">
							<h1>
								{{ seeds_matrix.name }}
							</h1>
							<p v-if="seeds_matrix.scientific_name">
								{{seeds_matrix.scientific_name}}
							</p>
							<p v-if="seeds_matrix.code">
								<small>{{seeds_matrix.code}}</small>
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
									<dl v-if="seeds_matrix.collectors_group">
										<dt>Grupo de coletores</dt>
										<dd>
											<router-link v-if="seeds_matrix.collectors_group" :to="'/grupo-de-coletores/'+ seeds_matrix.collectors_group._id">{{seeds_matrix.collectors_group.name}}</router-link>
										</dd>
									</dl>
									<dl v-if="seeds_matrix.collector">
										<dt>Coletor</dt>
										<dd>
											<router-link v-if="seeds_matrix.collector" :to="'/coletor/'+ seeds_matrix.collector._id">{{seeds_matrix.collector.name}}</router-link>
										</dd>
									</dl>
									<dl v-if="seeds_matrix.category">
										<dt>Categoria</dt>
										<dd>{{ categorias_de_matrizes.find(v => (seeds_matrix.category == v.value)).text }}</dd>
									</dl>
									<dl v-if="seeds_matrix.source">
										<dt>Origem</dt>
										<dd>{{ origens_de_matrizes.find(v => (seeds_matrix.source == v.value)).text }}</dd>
									</dl>
								</div>
								<div class="col-sm-6" >
									<dl v-if="seeds_matrix.geolocation && seeds_matrix.geolocation.lat">
										<dt>Latitude</dt>
										<dd>{{ seeds_matrix.geolocation.lat }}</dd>
									</dl>
									<dl v-if="seeds_matrix.geolocation && seeds_matrix.geolocation.lng">
										<dt>Longitude</dt>
										<dd>{{ seeds_matrix.geolocation.lng }}</dd>
									</dl>
									<dl v-if="seeds_matrix.collec_months && seeds_matrix.collec_months.length" class="fruiting_season">
										<dt>Meses prováveis de coleta</dt>
										<dd>
											<b-badge v-for="(month_option, month) in meses" :class="{ 'btn-success': seeds_matrix.collec_months.includes(month) }" :key="month" v-show="seeds_matrix.collec_months.includes(month)">{{month_option.text}}</b-badge>
										</dd>
									</dl>
									<dl v-if="seeds_matrix.documents && seeds_matrix.documents.length">
										<dt>Documentos em anexo</dt>
										<dd v-for="(document, index) in seeds_matrix.documents" :key="index">
											<a :href="baseUrl + document" target="_blank"><i class="fa fa-download"></i> {{ document | filename }}</a></dd>
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
import categorias_de_matrizes from '@/data/categorias_de_matrizes.json'
import origens_de_matrizes from '@/data/origens_de_matrizes.json'
import meses from '@/data/meses.json'

export default {

	name: 'SeedsMatrix',
	data () {
		return {
			categorias_de_matrizes: categorias_de_matrizes,
			origens_de_matrizes: origens_de_matrizes,
			meses: meses,
			seeds_matrix: null
		}
	},
	created () {
		this.isLoading = true
    axios.get('seeds_matrixes/' + this.$route.params.id, {
      params: {
        populate: 'collectors_group collector'
      }
    }).then(response => {
      this.seeds_matrix = response.data
      this.isLoading = false
    }).catch(this.showError);
	},
	methods: {
    edit () {
			this.$router.replace('/editar-matriz-de-sementes/'+this.seeds_matrix._id)
		}
	},

	components: {
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
