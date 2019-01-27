<template>
	<div class="dashboard">
		<ol class="breadcrumb">
			<li><router-link to="/painel">Painel do Gestor</router-link></li>
			<li class="active">Sementes</li>
		</ol>
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<div class="row">
					<div class="col-md-8">
						<h1>
							Sementes 
							<router-link to="/cadastrar-semente">+ Cadastrar semente</router-link>
						</h1>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<div class="info-content">
							<div class="row">
								<div class="col-md-12">
									<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
									<button v-if="!seeds && !error" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Carregando lista de sementes...</button>
									<div v-if="seeds">
										<b-form-input v-model="filter" placeholder="Buscar" />
										<br>
										<b-table :fields="tableFields" :items="seeds" :sort-by="'title'" :filter="filter">
											<template slot="title" slot-scope="data">
												<router-link v-bind:to="'/semente/'+ data.item.product_id">{{data.item.title}}</router-link>
											</template>
											<template slot="compensation_collect" slot-scope="data">
												{{data.item.compensation_collect | currency('R$ ', 2, { decimalSeparator: ',' })}}
											</template>
											<template slot="actions" slot-scope="data">

												<router-link v-bind:to="'/editar-semente/'+ data.item.product_id" class="btn btn-primary btn-xs">Editar</router-link>
											</template>
										</b-table>
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
// import slugify from '@sindresorhus/slugify'

export default {
	
	name: 'Seeds', 
	
	data () {
		return { 
			error: false,
			filter: null,
			tableFields: [
				{ key: 'title', label: 'Semente', sortable: true },
				{ key: 'scientific_name', label: 'Nome científico', sortable: true },
				{ key: 'compensation_collect', label: 'Remuneração', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			],
			seeds: null
		}
	},
	
	created () {
		axios.get('rest/seeds-list?_format=json').then(response => {
			this.seeds = response.data.map(seed => {
				return { 
					product_id: seed.product_id[0].value,
					title: seed.title[0].value,
					scientific_name: seed.field_scientific_name[0].value,
					compensation_collect: seed.field_compensation_collect[0].number
				}
			})
		}).catch(error => {
			this.error = error
		})
	},
		
};
</script>
