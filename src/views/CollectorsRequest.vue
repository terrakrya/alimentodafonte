<template>
	<div class="collectors-request">
		<breadcrumb :links="[['Pedidos', '/pedidos-para-coletores']]" active="Dados do pedido" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="loading" />
				<div v-if="collectors_request && !loading">
					<div class="row item-title">
						<div class="col-md-10">
							<router-link :to="'/editar-pedido-para-coletores/'+collectors_request.id" class="btn btn-default btn-xs pull-right">
								<i class="fa fa-edit" aria-hidden="true"></i>
								Editar pedido
							</router-link>
							<h1>
								Pedido {{ collectors_request.id }}
							</h1>
							<p>
								Criado em: {{ collectors_request.created | moment("DD/MM/YYYY") }}
							</p>
							<p>
								<router-link v-if="collectors_request.seeds_house" :to="'/casa-de-sementes/'+collectors_request.seeds_house.id"> &bull; {{ collectors_request.seeds_house.title }}</router-link>								
								<router-link v-if="collectors_request.collectors_group" :to="'/grupo-de-coletores/'+collectors_request.collectors_group.id"> &bull; {{ collectors_request.collectors_group.title }}</router-link>								
								<router-link v-if="collectors_request.collector" :to="'/coletor/'+collectors_request.collector.id"> &bull; {{ collectors_request.collector.title }}</router-link>								
							</p>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-6 col-md-3" v-if="collectors_request.weight">
							<div class="weekly-summary text-center">
								<span class="info-label">Quantidade</span>
								<span class="number">{{ collectors_request.weight }} Kg</span>
							</div>
						</div>
						<div class="col-sm-6 col-md-3" v-if="collectors_request.price">
							<div class="weekly-summary text-center">
								<span class="info-label">Valor total</span>
								<span class="number">{{ collectors_request.price | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-12" v-if="collectors_request">
							<table class="table b-table b-table-stacked-md">
				        <thead>
				          <tr>
				            <th>Espécie</th>
				            <th>Valor / Kg</th>
				            <th>Quantidade</th>
				            <th>Total</th>
				            <th></th>
				          </tr>
				        </thead>
				        <tbody>
				          <tr v-for="(seed, index) in collectors_request.seeds" :key="index">
				            <td>
				              {{seed.title}}
				            </td>
				            <td>
				              {{seed.price | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}
				            </td>
				            <td>
				              {{seed.weight | currency('', 0, { thousandsSeparator: '' })}} kg
				            </td>
				            <td>
				              {{seed.price * seed.weight | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}
				            </td>
				          </tr>
				        </tbody>
				      </table>
						</div>
					</div>
				</div>
			</div>
		</div>
		<pre>{{collectors_request}}</pre>
	</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'

export default {

	name: 'CollectorsRequest', 

	data () {
		return { 
			error: false
		}
	},
	created () {
		this.getList('collectors_requests')
	},
	computed: {
		loading () {
			return !this.collectors_request
		},
		collectors_request () {
			console.log(this.$store.state.collectors_requests)
			if (this.$store.state.collectors_requests) {
				return this.$store.state.collectors_requests.find(cr => cr.id == this.$route.params.id)	
			} 
		}
	},
	components: { 
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
