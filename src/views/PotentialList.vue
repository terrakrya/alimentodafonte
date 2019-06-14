<template>
	<div class="potential_list">
		<breadcrumb :links="[['Listas de potencial', '/listas-de-potencial']]" active="Dados da lista de potencial" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :isLoading="loading" />
				<div v-if="potential_list && !loading">
					<div class="row item-title">
						<div class="col-md-12">
							<router-link :to="'/editar-lista-de-potencial/'+potential_list.id" class="btn btn-default btn-xs pull-right">
								<i class="fa fa-edit" aria-hidden="true"></i>
								Editar lista
							</router-link>
							<h1>
								Lista de potencial {{ potential_list.id }}
							</h1>
							<p>
								<router-link v-if="potential_list.group" :to="'/grupo-de-coletores/'+potential_list.group.id"> &bull; {{ potential_list.group.title }}</router-link>			
								<router-link v-if="potential_list.collector" :to="'/coletor/'+potential_list.collector.id"> &bull; {{ potential_list.collector.title }}</router-link>			
							</p>
							<p>
								<span v-if="potential_list.area">{{potential_list.area}} hectares</span>
								<span v-if="potential_list.vegetation">{{potential_list.vegetation}}</span>
							</p>
							<div>
								<b-badge v-if="potential_list.flood" pill><i class="fa fa-check"></i> Alaga</b-badge>
								<b-badge v-if="potential_list.bog" pill><i class="fa fa-check"></i> Brejo</b-badge>
							</div>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-3" v-if="potential_list.weight">
							<div class="weekly-summary text-center">
								<span class="info-label">Quantidade</span>
								<span class="number">{{ potential_list.weight }} Kg</span>
							</div>
						</div>
						<div class="col-sm-3" v-if="potential_list.compensation_collect">
							<div class="weekly-summary text-center">
								<span class="info-label">Remuneração</span>
								<span class="number">{{ potential_list.compensation_collect | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-3" v-if="potential_list.wholesale_price">
							<div class="weekly-summary text-center">
								<span class="info-label">Potencial atacado</span>
								<span class="number">{{ potential_list.wholesale_price | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-3" v-if="potential_list.price">
							<div class="weekly-summary text-center">
								<span class="info-label">Potencial varejo</span>
								<span class="number">{{ potential_list.price | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12" v-if="potential_list">
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
									<tr v-for="(seed, index) in potential_list.seeds" :key="index">
										<td>
											<router-link :to="'/semente/'+seed.id">{{seed.title}}</router-link>
										</td>
										<td>
											{{seed.weight | currency('', 0, { thousandsSeparator: '' })}} kg
										</td>
										<td>
											{{seed.compensation_collect * seed.weight | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}
										</td>
										<td>
											{{seed.wholesale_price * seed.weight | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' })}}
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
	</div>
</template>
<script>
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'

export default {

	name: 'PotentialList', 

	data () {
		return { 
			
		}
	},
	created () {
		this.getList('potential_lists')
	},
	computed: {
		loading () {
			return !this.potential_list
		},
		potential_list () {
			if (this.$store.state.potential_lists) {
				return this.$store.state.potential_lists.find(cr => cr.id == this.$route.params.id)	
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
