<template>
	<div class="seed">
		<breadcrumb :links="[['Sementes', '/sementes']]" active="Dados da semente" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="isLoading" />
				<div v-if="seed && !isLoading">
					<div class="row item-title">
						<div class="col-md-2" v-if="present(seed.images, 'url')">
							<img :src="baseUrl + seed.images[0].url" class="img-responsive item-img" />
						</div>
						<div class="col-md-10">
							<h1>
								{{ seed.title }}
							</h1>
							<p><span>{{ seed.scientific_name }}</span> &bull; <span>{{ seed.local_name }}</span></p>

							<router-link :to="'/editar-semente/'+seed._id" class="btn btn-default btn-xs">
								<i class="fa fa-edit" aria-hidden="true"></i>
								Editar semente
							</router-link>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-6 col-md-3" v-if="present(seed.price, 'number')">
							<div class="weekly-summary text-center">
								<span class="info-label">Preço</span>
								<span class="number">{{ seed.price | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-6 col-md-3" v-if="present(seed.wholesale_price, 'number')">
							<div class="weekly-summary text-center">
								<span class="info-label">Preço no atacado</span>
								<span class="number">{{ seed.wholesale_price | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-6 col-md-3" v-if="present(seed.compensation_collect, 'number')">
							<div class="weekly-summary text-center">
								<span class="info-label">Remuneração do coletor</span>
								<span class="number">{{ seed.compensation_collect | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-6 col-md-3" v-if="present(seed.stock)">
							<div class="weekly-summary text-center">
								<span class="info-label">Quantidade em estoque</span>
								<span class="number" :class="{red: seed.stock <= 0}">{{ seed.stock | currency('', 0, { thousandsSeparator: '' }) }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12" >
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Detalhes</strong>
								</div>
								<div class="list-group-item">
									<div class="row" v-if="present(seed.body)">
										<div class="col-sm-12">
											<p class="details" colspan="2" v-html="seed.body"></p>
										</div>
									</div>
									<div class="row">
										<div class="col-sm-6">
											<dl>
												<dt>Qtd. de sementes / Kg</dt>
												<dd>{{ seed.seeds_kg | currency('', 0, { thousandsSeparator: '' }) }} sementes / Kg</dd>
											</dl>
											<dl>
												<dt>Taxa de viabilidade</dt>
												<dd>{{ seed.viability_rate | currency('', 0, { thousandsSeparator: '' }) }} % de viabilidade</dd>
											</dl>
											<dl>
												<dt>Limite de peso por lote</dt>
												<dd>{{ seed.lot_limit | currency('', 0, { thousandsSeparator: '' }) }} kg por lote</dd>
											</dl>
										</div>
										<div class="col-sm-6">
											<dl class="ecosystem">
												<dt>Ecossistemas</dt>
												<dd>
													<b-badge v-for="(ecosystem, index) in seed.ecosystem" :class="ecosystem" :key="index">{{ecossistemas.find((es) => (es.value == ecosystem)).text}}</b-badge>
												</dd>
											</dl>
											<dl class="fruiting_season">
												<dt>Época da frutificação</dt>
												<dd>
													<b-badge v-for="(fruiting_season_option, index) in meses" :class="{ 'btn-success': !!seed.fruiting_season.find((fs) => (fs == fruiting_season_option.value))}" :key="month">{{fruiting_season_option.text}}</b-badge>
												</dd>
											</dl>
										</div>
									</div>
									<div class="row" v-if="seed.images && seed.images.length > 1">
										<div class="col-sm-4" v-for="(image, index) in seed.images" :key="index">
											<b-img :src="baseUrl+image.thumb" fluid thumbnail :key="index" />
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
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'
import meses from '@/data/meses.json'
import ecossistemas from '@/data/ecossistemas.json'

export default {

	name: 'Seed',

	data () {
		return {
			meses: meses,
			ecossistemas: ecossistemas,
			seed: null,
			
			
		}
	},

	created () {

		this.isLoading = true

		axios.get('seeds/' + this.$route.params.id).then(resp => {
			this.seed = resp.data
			this.isLoading = false
		}).catch(this.showError);

	},

	components: {
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}


};
</script>
