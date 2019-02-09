<template>
	<div class="seeds-matrix">
		<breadcrumb v-bind:links="[['Matrizes de sementes', '/matrizes-de-sementes']]" active="Dados da matriz" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading v-bind:loading="loading" />
				<div v-if="seeds_matrix && !loading">
					<div class="row item-title">
						<div class="col-md-10">
							<h1>
								{{ seeds_matrix.title[0].value }}								
							</h1>
							<p v-if="present(seeds_matrix.field_seed_matrix_scient_name)">
								{{seeds_matrix.field_seed_matrix_scient_name[0].value}}
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
									<dl v-if="present(seeds_matrix.field_seed_matrix_category)">
										<dt>Categoria</dt>
										<dd>{{ categorias_de_matrizes.find(v => (seeds_matrix.field_seed_matrix_category[0].value == v.value)).text }}</dd>
									</dl>
									<dl v-if="present(seeds_matrix.field_seed_matrix_source)">
										<dt>Origem</dt>
										<dd>{{ origens_de_matrizes.find(v => (seeds_matrix.field_seed_matrix_source[0].value == v.value)).text }}</dd>
									</dl>
									<dl class="fruiting_season">
										<dt>Meses prováveis de coleta</dt>
										<dd>
											<b-badge v-for="(month_option, month) in meses" v-bind:class="{ 'btn-success': !!seeds_matrix.field_seed_matrix_collec_month.find((fs) => (fs.value == month))}" :key="month">{{month_option.text}}</b-badge>
										</dd>
									</dl>
									<dl v-if="present(seeds_matrix.field_seed_matrix_files, 'url')">
										<dt>Documentos em anexo</dt>
										<dd><a v-bind:href="seeds_matrix.field_seed_matrix_files[0].url" target="_blank"><i class="fa fa-download"></i> {{ fileName }}</a></dd>
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
									<dl v-if="present(seeds_matrix.field_geolocation, 'lat')">
										<dt>Latitude</dt>
										<dd>{{ seeds_matrix.field_geolocation[0].lat }}</dd>
									</dl>
									<dl v-if="present(seeds_matrix.field_geolocation, 'lng')">
										<dt>Longitude</dt>
										<dd>{{ seeds_matrix.field_geolocation[0].lng }}</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<pre>{{seeds_matrix}}</pre>
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
			seeds_matrix: null,
			error: false,
			loading: false,
			categorias_de_matrizes: categorias_de_matrizes,
			origens_de_matrizes: origens_de_matrizes,
			meses: meses,
		}
	},

	computed: {
		fileName () {
			let url = this.seeds_matrix.field_seed_matrix_files[0].url.split('/')
			return url[url.length -1]
		}
	},

	created () {
		
		this.loading = true
		
		axios.get('node/' + this.$route.params.id + '?_format=json').then(seeds_matrix => {
			this.seeds_matrix = seeds_matrix.data 
			this.loading = false
		}).catch(error => { this.error = error.message, this.loading = false })

	},

	methods: {
		edit () {
			this.$router.replace('/editar-matriz-de-sementes/'+this.seeds_matrix.nid[0].value)
		}
	},

	components: { 
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
