<template>
	<div class="potential_list">
		<breadcrumb :links="[['Listas de potencial', '/listas-de-potencial']]" active="Dados da lista de potencial" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="isLoading" />
				<div v-if="potential_list && !isLoading">
					<div class="row item-title">
						<div class="col-md-12">
							<router-link :to="'/editar-lista-de-potencial/'+potential_list._id" class="btn btn-default btn-xs pull-right">
								<i class="fa fa-edit" aria-hidden="true"></i>
								Editar lista
							</router-link>
							<h1>
								Lista {{ potential_list.code }}
							</h1>
							<p>
								<router-link v-if="potential_list.collectors_group" :to="'/grupo-de-coletores/'+potential_list.collectors_group._id"> &bull; {{ potential_list.collectors_group.name }}</router-link>
								<router-link v-if="potential_list.collector" :to="'/coletor/'+potential_list.collector._id"> &bull; {{ potential_list.collector.name }}</router-link>
							</p>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row" v-if="potential_list.seed_items && potential_list.seed_items.length">
						<div class="col-sm-3">
							<div class="weekly-summary text-center">
								<span class="info-label">Quantidade</span>
								<span class="number">{{ potential_list.seed_items.map(item => item.qtd).reduce((a, b) => a + b) | currency('', 2, { decimalSeparator: ',', thousandsSeparator: '.' }) }} Kg</span>
							</div>
						</div>
						<div class="col-sm-3">
							<div class="weekly-summary text-center">
								<span class="info-label">Remuneração</span>
								<span class="number">{{ potential_list.seed_items.map(item => item.compensation_collect * item.qtd).reduce((a, b) => a + b) | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' }) }}</span>
							</div>
						</div>
						<div class="col-sm-3">
							<div class="weekly-summary text-center">
								<span class="info-label">Potencial atacado</span>
								<span class="number">{{ potential_list.seed_items.map(item => item.wholesale_price * item.qtd).reduce((a, b) => a + b) | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' }) }}</span>
							</div>
						</div>
						<div class="col-sm-3">
							<div class="weekly-summary text-center">
								<span class="info-label">Potencial varejo</span>
								<span class="number">{{ potential_list.seed_items.map(item => item.price * item.qtd).reduce((a, b) => a + b) | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' }) }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12" v-if="potential_list.seed_items">
							<table class="table b-table b-table-stacked-md">
								<thead>
									<tr>
										<th>Espécie</th>
										<th>Quantidade</th>
										<th>Remuneração</th>
										<th>Atacado</th>
										<th>Varejo</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(seed_item, index) in potential_list.seed_items" :key="index">
										<td>
											<router-link :to="'/semente/'+seed_item._id">{{seed_item.seed.name}}</router-link>
										</td>
										<td>
											{{seed_item.qtd}} kg
										</td>
										<td>
											{{seed_item.compensation_collect * seed_item.qtd | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}}
										</td>
										<td>
											{{seed_item.wholesale_price * seed_item.qtd | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}}
										</td>
										<td>
											{{seed_item.price * seed_item.qtd | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}}
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

	name: 'PotentialList',

	data () {
		return {
			potential_list: null
		}
	},
	created () {
		this.isLoading = true
		axios.get('potential_lists/' + this.$route.params.id, {
			params: {
				populate: 'collectors_group collector seed_items.seed'
			}
		}).then(response => {
			this.potential_list = response.data
			this.isLoading = false
		}).catch(this.showError);
	},
	components: {
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
