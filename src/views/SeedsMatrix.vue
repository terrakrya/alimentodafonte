<template>
	<div class="seeds-matrix">
		<breadcrumb :links="[['Matrizes de sementes', '/matrizes-de-sementes']]" active="Dados da matriz" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="loading" />
				<div v-if="seeds_matrix && !loading">
					<div class="row item-title">
						<div class="col-md-10">
							<h1>
								{{ seeds_matrix.title }}								
							</h1>
							<p v-if="seeds_matrix.scient_name">
								{{seeds_matrix.scient_name}}
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
											<router-link v-if="seeds_matrix.collectors_group" :to="'/grupo-de-coletores/'+ seeds_matrix.collectors_group.id">{{seeds_matrix.collectors_group.title}}</router-link>
										</dd>
									</dl>
									<dl v-if="seeds_matrix.collector">
										<dt>Coletor</dt>
										<dd>
											<router-link v-if="seeds_matrix.collector" :to="'/coletor/'+ seeds_matrix.collector.id">{{seeds_matrix.collector.title}}</router-link>
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
									<dl v-if="seeds_matrix.geolocation">
										<dt>Latitude</dt>
										<dd>{{ seeds_matrix.geolocation.lat }}</dd>
									</dl>
									<dl v-if="seeds_matrix.geolocation">
										<dt>Longitude</dt>
										<dd>{{ seeds_matrix.geolocation.lng }}</dd>
									</dl>
									<dl class="fruiting_season">
										<dt>Meses prováveis de coleta</dt>
										<dd>
											<b-badge v-for="(month_option, month) in meses" :class="{ 'btn-success': seeds_matrix.collec_month == month }" :key="month" v-show="seeds_matrix.collec_month == month">{{month_option.text}}</b-badge>
										</dd>
									</dl>
									<dl v-if="seeds_matrix.files">
										<dt>Documentos em anexo</dt>
										<dd v-for="(seed_matrix_file, index) in seeds_matrix.files" :key="index">
											<a :href="seed_matrix_file" target="_blank"><i class="fa fa-download"></i> {{ fileName(seed_matrix_file) }}</a></dd>
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
import categorias_de_matrizes from '@/data/categorias_de_matrizes.json'
import origens_de_matrizes from '@/data/origens_de_matrizes.json'
import meses from '@/data/meses.json'

export default {

	name: 'SeedsMatrix', 

	data () {
		return { 
			error: false,
			categorias_de_matrizes: categorias_de_matrizes,
			origens_de_matrizes: origens_de_matrizes,
			meses: meses,
		}
	},
	computed: {
		loading () {
			return !this.seeds_matrix
		},
		seeds_matrix () {
			if (this.$store.state.seeds_matrixes) {
				return this.$store.state.seeds_matrixes.find(c => c.id == this.$route.params.id)	
			}
			return null
		}
	},
	created () {
		this.getList('seeds_matrixes')
	},
	methods: {
    fileName (doc) {
			if (doc) {
				var doc_url = doc.split('/')
				return doc_url[doc_url.length -1]
			}
    },
		edit () {
			this.$router.replace('/editar-matriz-de-sementes/'+this.seeds_matrix.id)
		}
	},

	components: { 
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
