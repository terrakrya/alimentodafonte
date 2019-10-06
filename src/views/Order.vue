<template>
	<div class="order">
		<breadcrumb :links="[['Encomendas', '/encomendas']]" active="Dados da encomenda" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="isLoading" />
				<div v-if="order && !isLoading">
					<div class="row item-title">
						<div class="col-md-12">
							<router-link :to="'/editar-encomenda/'+order._id" class="btn btn-default btn-xs pull-right">
								<i class="fa fa-edit" aria-hidden="true"></i>
								Editar encomenda
							</router-link>
							<h1>
								Encomenda {{ order.code }}
								<small v-if="order.contract && !order.close">(Contrato {{order.contract.toLowerCase()}})</small>
								<small v-if="order.close">(Entrega concluída)</small>
							</h1>
							<p>
								<span v-if="order.date_receiving">Data de recebimento: {{ order.date_receiving | moment("DD/MM/YYYY") }}</span>
								<span v-if="order.deadline">Prazo final: {{ order.deadline | moment("DD/MM/YYYY") }}</span>
							</p>
							<p>
								<router-link v-if="order.client" :to="'/cliente/'+order.client._id"> &bull; {{ order.client.name }}</router-link>
							</p>
							<p>
								<span v-if="order.restored_area">{{order.restored_area}} hectares</span>
								<span v-if="order.vegetation">{{order.vegetation}}</span>
							</p>
							<p>
								<span v-if="order.comments">{{order.comments}}</span>
							</p>
							<div>
								<b-badge v-if="order.flood" pill><i class="fa fa-check"></i> Alaga</b-badge>
								<b-badge v-if="order.bog" pill><i class="fa fa-check"></i> Brejo</b-badge>
							</div>

						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-3" v-if="order.seed_items && order.seed_items.length">
							<div class="weekly-summary text-center">
								<span class="info-label">Quantidade</span>
								<span class="number">{{ order.seed_items.map(seed_item => seed_item.qtd).reduce((a, b) => a + b) | kg}}</span>
							</div>
						</div>
						<div class="col-sm-3" v-if="order.seed_items && order.seed_items.length">
							<div class="weekly-summary text-center">
								<span class="info-label">Total {{order.purchase_type.toLowerCase()}}</span>
								<span class="number">{{ order.seed_items.map(seed_item => seed_item.qtd * (order.purchase_type == 'Atacado' ? seed_item.wholesale_price : seed_item.price)).reduce((a, b) => a + b) | moeda }}</span>
							</div>
						</div>
						<div class="col-sm-3" v-if="order.amount_paid >= 0">
							<div class="weekly-summary text-center">
								<span class="info-label">Pago</span>
								<span class="number">{{ order.amount_paid | moeda }}</span>
							</div>
						</div>
						<div class="col-sm-3" v-if="order.amount_remain >= 0">
							<div class="weekly-summary text-center">
								<span class="info-label">Restante</span>
								<span class="number">{{ order.amount_remain | moeda }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12" v-if="order">
							<table class="table b-table b-table-stacked-md">
								<thead>
									<tr>
										<th>Espécie</th>
										<th>Valor <span v-if="order.purchase_type">{{order.purchase_type.toLowerCase()}}</span> / Kg</th>
										<th>Quantidade</th>
										<th>Total <span v-if="order.purchase_type">{{order.purchase_type.toLowerCase()}}</span></th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(seed_item, index) in order.seed_items" :key="index">
										<td>
											<router-link :to="'/semente/'+seed_item.seed._id">{{seed_item.seed.name}}</router-link>
										</td>
										<td>
											{{(order.purchase_type == 'Atacado' ? seed_item.wholesale_price : seed_item.price) | moeda}}
										</td>
										<td>
											{{seed_item.qtd| kg}}
										</td>
										<td>
											{{(order.purchase_type == 'Atacado' ? seed_item.wholesale_price : seed_item.price) * seed_item.qtd | moeda}}
										</td>
									</tr>
								</tbody>
							</table>
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

export default {

	name: 'Order',

	data() {
    return {
      order: null
    }
  },
  created() {
    this.isLoading = true
    axios.get('orders/' + this.$route.params.id, {
      params: {
        populate: 'client seed_items.seed'
      }
    }).then(response => {
      this.order = response.data
      this.isLoading = false
    }).catch(this.showError);
  },
	components: {
		Loading,
		Breadcrumb
	}

};
</script>
