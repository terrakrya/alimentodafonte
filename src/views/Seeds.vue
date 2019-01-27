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
							<router-link to="/cadastrar-semente">+ Nova semente</router-link>
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
											<template slot="title[0].value" slot-scope="data">
												<router-link v-bind:to="'/semente/'+ data.item.product_id[0].value">{{data.item.title[0].value}}</router-link>
											</template>
											<template slot="field_compensation_collect[0].number" slot-scope="data">
												{{data.item.field_compensation_collect[0].number | currency('R$ ', 2, { decimalSeparator: ',' })}}
											</template>
											<template slot="actions" slot-scope="data">

												<router-link v-bind:to="'/editar-semente/'+ data.item.product_id[0].value" class="btn btn-primary btn-xs">Editar</router-link>
												<a @click="edit(data.item)" class="btn btn-primary btn-xs">Editar</a>
											</template>
										</b-table>
									</div>
									<div class="modal fade in" id="modal-especies" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" v-bind:style="{ display: (showModal ? 'block': 'none') }">
										<div class="modal-dialog" role="document">
											<div class="modal-content">
												<div class="modal-header">
													<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
													<h4 class="modal-title" id="myModalLabel">Acari Bola Azul</h4>
												</div>
												<div class="modal-body text-center">
													<img src="assets/img/traira.jpeg" class="img-responsive" />
												</div>
												<div class="modal-footer">
													<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
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
			showModal: false,
			filter: null,
			tableFields: [
			{ key: 'title[0].value', label: 'Semente', sortable: true },
			{ key: 'field_compensation_collect[0].number', label: 'Remuneração', sortable: true },
			{ key: 'field_seeds_kg[0].value', label: 'Sementes / Kg', sortable: true },
			{ key: 'actions', label: 'Ações', 'class': 'actions' },
			],
			seeds: null
		}
	},
	
	created () {
		axios.get('rest/seeds-list?_format=json').then(response => {
			this.seeds = response.data 
		}).catch(error => {
			this.error = error
		})
	},
	
	methods: {
		toggleModal() {
			this.showModal = !this.showModal  
		}
	}
	
};
</script>
