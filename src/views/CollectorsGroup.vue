<template>
	<div class="collectors-group">
		<breadcrumb v-bind:links="[['Grupos de coletores', '/grupos-de-coletores']]" active="Dados do grupo" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading v-bind:loading="loading" />
				<div v-if="collectors_group && !loading">
					<div class="row item-title">
						<div class="col-md-10">
							<h1>
								{{ collectors_group.title[0].value }}								
							</h1>
							<p v-if="present(collectors_group.field_cnpj)">
								<span>CNPJ: {{ collectors_group.field_cnpj[0].value | cnpj }}</span>
							</p>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-12" >
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Detalhes</strong>
									<i @click="edit" class="pull-right fa fa-pencil"></i>
								</div>
								<div class="list-group-item">
									<div class="row" v-if="present(collectors_group.body)"> 
										<div class="col-sm-12">
											<p class="details" colspan="2" v-html="collectors_group.body[0].processed"></p>
										</div>
									</div>
									<div class="row"> 
										<div class="col-sm-6">
											<dl v-if="present(collectors_group.field_contact)">
												<dt>Contatos</dt>
												<dd>{{ collectors_group.field_contact[0].value }}</dd>
											</dl>
											<dl v-if="present(collectors_group.name)">
												<dt>Nome de usuário</dt>
												<dd>{{ collectors_group.name[0].value }}</dd>
											</dl>
											<dl v-if="present(collectors_group.field_cnpj)">
												<dt>CNPJ</dt>
												<dd>{{ collectors_group.field_cnpj[0].value | cnpj }}</dd>
											</dl>
										</div>
										<div class="col-sm-6">
											<dl v-if="present(collectors_group.field_bank_number)">
												<dt>Banco</dt>
												<dd>{{ bancos.find((banco) => banco.value == collectors_group.field_bank_number[0].value ).text }}</dd>
											</dl>
											<dl v-if="present(collectors_group.field_agency_number)">
												<dt>Agência</dt>
												<dd>{{ collectors_group.field_agency_number[0].value }}</dd>
											</dl>
											<dl v-if="present(collectors_group.field_account_number)">
												<dt>Conta {{ collectors_group.field_account_type[0].value }}</dt>
												<dd>{{ collectors_group.field_account_number[0].value }}</dd>
											</dl>
										</div>
									</div>									
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-6" v-if="collectors && collectors.length">
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Coletores</strong>
								</div>
								<div class="list-group-item" v-for="(collector, index) in collectors" :key="index" >
									<router-link v-bind:to="'/coletor/'+collector.uid[0].value">
										<img v-if="present(collector.user_picture, 'url')" :src="collector.user_picture[0].url" />
										<span v-if="present(collector.field_name)">{{collector.field_name[0].value}}</span>
									</router-link>
								</div>
							</div>
						</div>
						<div class="col-sm-6" v-if="seeds && seeds.length">
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Sementes</strong>
								</div>
								<div class="list-group-item" v-for="(seed, index) in seeds" :key="index" >
									<router-link v-bind:to="'/semente/'+seed.product_id[0].value">
										<img v-if="present(seed.field_images, 'url')" :src="seed.field_images[0].url" />
										<span v-if="present(seed.title)">{{seed.title[0].value}}</span>
									</router-link>
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
import bancos from '@/data/bancos.json';
import tipos_de_conta from '@/data/tipos-de-conta.json';

export default {

	name: 'CollectorsGroup', 

	data () {
		return { 
			collectors_group: null,
			collectors: null,
			seeds: null,
			error: false,
			loading: false,
			bancos: bancos,
			tipos_de_conta: tipos_de_conta
		}
	},

	created () {
		
		this.loading = true
		
		axios.get('node/' + this.$route.params.id + '?_format=json').then(collectors_group => {
			this.collectors_group = collectors_group.data 
			this.loading = false

			axios.get('rest/collectors?_format=json').then(response => {
				this.collectors = response.data.filter(collector => {
					return this.collectors_group.field_collectors.find(item => {
						return collector.uid[0].value == item.target_id
					})
				})
			}).catch(error => { this.error = error.message })

			axios.get('rest/seeds-list?_format=json').then(response => {
				this.seeds = response.data.filter(seed => {
					return this.collectors_group.field_seeds.find(item => {
						return seed.product_id[0].value == item.target_id
					})
				})

			}).catch(error => { this.error = error.message })

		}).catch(error => { this.error = error.message, this.loading = false })

	},

	methods: {
		edit () {
			this.$router.replace('/editar-grupo-de-coletores/'+this.collectors_group.nid[0].value)
		}
	},

	components: { 
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
