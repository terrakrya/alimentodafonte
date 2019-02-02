<template>
	<div class="dashboard">
		<ol class="breadcrumb">
			<li><router-link to="/painel">Painel do gestor</router-link></li>
			<li class="active">Coletores</li>
		</ol>
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<div class="row">
					<div class="col-sm-8">
						<h1>
							Coletores 
							<router-link to="/cadastrar-coletor">+ Cadastrar</router-link>
						</h1>
					</div>
					<div class="col-sm-4">
						<b-form-input v-model="filter" placeholder="Buscar" class="search-input" />
					</div>
				</div>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<button v-if="!collectors && !error" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Carregando lista de coletores...</button>
					<div v-if="collectors">
						<b-table :fields="tableFields" :items="collectors" :sort-by="'name'" :filter="filter">
							<template slot="name" slot-scope="data">
								<router-link v-bind:to="'/coletor/'+ data.item.uid">{{(data.item.nickname && data.item.nickname != data.item.name) ? data.item.nickname : data.item.name}}</router-link>
								<p v-if="data.item.nickname != data.item.name"><small>{{data.item.name}}</small></p>
							</template>
							<template slot="actions" slot-scope="data">
								<router-link v-bind:to="'/editar-coletor/'+ data.item.uid" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item.uid)" class="fa fa-trash btn btn-danger btn-xs"></a>
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
	
	name: 'Collectors', 
	
	data () {
		return { 
			error: false,
			filter: null,
			tableFields: [
				{ key: 'name', label: 'Nome do coletor', sortable: true },
				{ key: 'city', label: 'Cidade', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			],
			collectors: null
		}
	},
	
	created () {
		this.list()
	},

	methods: {
		list () {
			axios.get('rest/collectors?_format=json').then(response => {
				this.collectors = response.data.map(collector => {
					return { 
						uid: collector.uid[0].value,
						name: collector.field_name[0].value,
						nickname: collector.field_nickname[0].value,
						city: collector.field_address.length ? 
							[collector.field_address[0].locality, collector.field_address[0].administrative_area].filter(Boolean).join(' - ')
							: ''
					}
				})
			}).catch(error => { this.error = error.message })
		},
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('user/' + id + '?_format=json').then(() => {
					this.list()
				}).catch(error => { this.error = error.message })	
			}
		}
	}
		
};
</script>
