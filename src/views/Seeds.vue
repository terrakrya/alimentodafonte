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
							<a href="" title="Nova semente">+ Nova semente</a>
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
												<a @click="toggleModal">{{data.item.title}} </a>
											</template>
											<template slot="actions" slot-scope="data">
												<a href="#" class="btn btn-primary btn-xs">Editar</a>
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

export default {

  name: 'Seeds', 
  data () {
		return { 
			error: false,
			showModal: false,
			filter: null,
			tableFields: [
        { key: 'title', label: 'Semente', sortable: true },
        { key: 'field_compensation_collect', label: 'Remuneração', sortable: true },
        { key: 'field_seeds_kg', label: 'Sementes / Kg', sortable: true },
        { key: 'actions', label: 'Ações', 'class': 'actions' },
      ],
			seeds: null
		}
  },
  created () {
    axios.get('rest/seeds?_format=json', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'c2VtZW50ZXMtYWRtaW46bjNqdWtqZjk4NG4=',
        }
    })
    .then(response => {
      this.seeds = response.data 
    })
    .catch(error => {
      this.error = error
    });
  },
  methods: {
		toggleModal() {
			this.showModal = !this.showModal  
		}
  }

};
</script>
