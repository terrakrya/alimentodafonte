<template>
	<div class="order">
		<breadcrumb :links="[['Encomendas', '/encomendas']]" active="Dados da encomenda" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="loading" />
				<div v-if="order && !loading">
					<div class="row item-title">
						<div class="col-md-12">
							<router-link :to="'/editar-encomenda/'+order.id" class="btn btn-default btn-xs pull-right">
								<i class="fa fa-edit" aria-hidden="true"></i>
								Editar encomenda
							</router-link>
							<h1>
								Encomenda {{ order.id }}
								<small v-if="order.status && !order.close">(Contrato {{order.status.toLowerCase()}})</small>
								<small v-if="order.close">(Entrega concluída)</small>
							</h1>
							<p>
								<span v-if="order.date_receiving">Data de recebimento: {{ order.date_receiving | moment("DD/MM/YYYY") }}</span>
								<span v-if="order.deadline">Prazo final: {{ order.deadline | moment("DD/MM/YYYY") }}</span>
							</p>
							<p>
								<router-link v-if="order.client" :to="'/cliente/'+order.client.id"> &bull; {{ order.client.title }}</router-link>			
							</p>
							<p>
								<span v-if="order.area">{{order.area}} hectares</span>
								<span v-if="order.vegetation">{{order.vegetation}}</span>
							</p>
							<div>
								<b-badge v-if="order.flood" pill><i class="fa fa-check"></i> Alaga</b-badge>
								<b-badge v-if="order.bog" pill><i class="fa fa-check"></i> Brejo</b-badge>
							</div>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-3" v-if="order.weight >= 0">
							<div class="weekly-summary text-center">
								<span class="info-label">Quantidade</span>
								<span class="number">{{ order.weight }} Kg</span>
							</div>
						</div>
						<div class="col-sm-3" v-if="order.price >= 0">
							<div class="weekly-summary text-center">
								<span class="info-label">Total {{order.purchase_type.toLowerCase()}}</span>
								<span class="number">{{ order.price | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-3" v-if="order.amount_paid >= 0">
							<div class="weekly-summary text-center">
								<span class="info-label">Pago</span>
								<span class="number">{{ order.amount_paid | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-3" v-if="order.amount_remain >= 0">
							<div class="weekly-summary text-center">
								<span class="info-label">Restante</span>
								<span class="number">{{ order.amount_remain | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12" v-if="order">
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
									<tr v-for="(seed, index) in order.seeds" :key="index">
										<td>
											<router-link :to="'/semente/'+seed.id">{{seed.title}}</router-link>
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
		<pre>{{order}}</pre>
	</div>
</template>
<script>
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
		this.getList('orders')
	},
	computed: {
		loading () {
			return !this.order
		},
		order () {
			if (this.$store.state.orders) {
				return this.$store.state.orders.find(cr => cr.id == this.$route.params.id)	
			}
			return null
		}
	},
	components: { 
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
