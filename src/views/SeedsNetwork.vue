<template>
	<div class="seeds-network">
		<breadcrumb v-bind:links="[['Redes de sementes', '/redes-de-sementes']]" active="Dados da rede" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading v-bind:loading="loading" />
				<div v-if="seeds_network && !loading">
					<div class="row item-title">
						<div class="col-md-10">
							<h1>
								{{ seeds_network.title[0].value }}								
							</h1>
							<p v-if="present(seeds_network.field_coverage_area)">
								<span>{{ seeds_network.field_coverage_area[0].value }}</span>
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
									<dl v-if="present(seeds_network.field_contact)">
										<dt>Contatos</dt>
										<dd>{{ seeds_network.field_contact[0].value }}</dd>
									</dl>
								</div>
							</div>
						</div>
						<div class="col-sm-6">
							<div class="list-group entity-select-preview" v-if="seeds_houses && seeds_houses.length">
								<div class="list-group-item active">
									<strong>Casas de sementes</strong>
								</div>
								<div class="list-group-item" v-for="(seeds_house, index) in seeds_houses" :key="index" >
									<router-link v-bind:to="'/casa-de-sementes/'+seeds_house.store_id[0].value">
										<span v-if="present(seeds_house.name)">{{seeds_house.name[0].value}}</span>
									</router-link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<pre>{{seeds_network}}</pre>
	</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'

export default {

	name: 'SeedsNetwork', 

	data () {
		return { 
			seeds_network: null,
			seeds_houses: null,
			error: false,
			loading: false,
		}
	},

	created () {
		
		this.loading = true
		
		axios.get('node/' + this.$route.params.id + '?_format=json').then(seeds_network => {
			this.seeds_network = seeds_network.data 
			this.loading = false

			axios.get('rest/seeds-houses?_format=json').then(response => {
				this.seeds_houses = response.data.filter(seeds_house => {
					return this.seeds_network.field_house_seed.find(item => {
						return seeds_house.store_id[0].value == item.target_id
					})
				})
			}).catch(error => { this.error = error.message })

		}).catch(error => { this.error = error.message, this.loading = false })

	},

	methods: {
		edit () {
			this.$router.replace('/editar-rede-de-sementes/'+this.seeds_network.nid[0].value)
		}
	},

	components: { 
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
