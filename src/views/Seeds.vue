<template>
	<div class="dashboard">
		<ol class="breadcrumb">
			<li><router-link to="/painel">Painel do gestor</router-link></li>
			<li class="active">Sementes</li>
		</ol>
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<div class="row">
					<div class="col-sm-8">
						<h1>
							Sementes 
							<router-link to="/cadastrar-semente">+ Cadastrar semente</router-link>
						</h1>
					</div>
					<div class="col-sm-4">
						<b-form-input v-model="filter" placeholder="Buscar semente" class="search-input" />
					</div>
				</div>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<button v-if="!seeds && !error" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Carregando lista de sementes...</button>
					<div v-if="seeds">
						<b-table :fields="tableFields" :items="seeds" :sort-by="'title'" :filter="filter">
							<template slot="title" slot-scope="data">
								<router-link v-bind:to="'/semente/'+ data.item.product_id">{{data.item.title}}</router-link>
							</template>
							<template slot="compensation_collect" slot-scope="data">
								{{data.item.compensation_collect | currency('R$ ', 2, { decimalSeparator: ',' })}}
							</template>
							<template slot="actions" slot-scope="data">
								<router-link v-bind:to="'/editar-semente/'+ data.item.product_id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item.product_id)" class="fa fa-trash btn btn-danger btn-xs"></a>
							</template>
						</b-table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from 'axios'

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
		this.list()
	},

	methods: {
		list () {
			axios.get('rest/seeds-list?_format=json').then(response => {
				this.seeds = response.data.map(seed => {
					return { 
						product_id: seed.product_id[0].value,
						title: seed.title[0].value,
						scientific_name: seed.field_scientific_name[0].value,
						compensation_collect: seed.field_compensation_collect[0].number
					}
				})
			}).catch(error => { this.error = error.message })
		},
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('product/' + id + '?_format=json').then(() => {
					this.list()
				}).catch(error => { this.error = error.message })	
			}
		}
	}
		
};
</script>
