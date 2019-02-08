<template>
	<div class="seed">
		<breadcrumb v-bind:links="[['Sementes', '/sementes']]" active="Dados da semente" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading v-bind:loading="loading" />
				<div v-if="seed && !loading">
					<div class="row item-title">
						<div class="col-md-2" v-if="present(seed.field_images, 'url')">
							<img v-bind:src="seed.field_images[0].url" class="img-responsive item-img" />
						</div>
						<div class="col-md-10">
							<h1>
								{{ seed.title[0].value }}
							</h1>
							<p><span>{{ seed.field_scientific_name[0].value }}</span> &bull; <span>{{ seed.field_local_name[0].value }}</span></p>

							<router-link v-bind:to="'/editar-semente/'+seed.product_id[0].value" class="btn btn-default btn-xs">
								<i class="fa fa-edit" aria-hidden="true"></i>
								Editar semente
							</router-link>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-6 col-md-3" v-if="present(seed_variation.price, 'number')">
							<div class="weekly-summary text-center">
								<span class="info-label">Preço</span>
								<span class="number">{{ seed_variation.price[0].number | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-6 col-md-3" v-if="present(seed_variation.field_wholesale_price, 'number')">
							<div class="weekly-summary text-center">
								<span class="info-label">Preço no atacado</span>
								<span class="number">{{ seed_variation.field_wholesale_price[0].number | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-6 col-md-3" v-if="present(seed.field_compensation_collect, 'number')">
							<div class="weekly-summary text-center">
								<span class="info-label">Remuneração do coletor</span>
								<span class="number">{{ seed.field_compensation_collect[0].number | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-6 col-md-3" v-if="present(seed_variation.field_stock)">
							<div class="weekly-summary text-center">
								<span class="info-label">Quantidade em estoque</span>
								<span class="number" v-bind:class="{red: seed_variation.field_stock[0].value <= 0}">{{ seed_variation.field_stock[0].value | currency('', 0, { thousandsSeparator: '' }) }}</span>
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
										<div class="col-sm-6">
											<p class="details" colspan="2" v-html="seed.body[0].processed"></p>
										</div>
									</div>
									<div class="row"> 
										<div class="col-sm-6">
											<dl>
												<dt>Qtd. de sementes / Kg</dt>
												<dd>{{ seed.field_seeds_kg[0].value | currency('', 0, { thousandsSeparator: '' }) }} sementes / Kg</dd>
											</dl>
											<dl>
												<dt>Taxa de viabilidade</dt>
												<dd>{{ seed.field_viability_rate[0].value | currency('', 0, { thousandsSeparator: '' }) }} % de viabilidade</dd>
											</dl>
											<dl>
												<dt>Limite de peso por lote</dt>
												<dd>{{ seed.field_lot_limit[0].value | currency('', 0, { thousandsSeparator: '' }) }} kg por lote</dd>
											</dl>
										</div>
										<div class="col-sm-6">
											<dl class="ecosystem" v-if="ecosystem_options">
												<dt>Ecossistemas</dt>
												<dd>
													<b-badge v-for="(ecosystem, index) in seed.field_ecosystem" v-bind:class="ecosystem.value" :key="index">{{ecosystem_options[ecosystem.value]}}</b-badge>
												</dd>
											</dl>
											<dl class="fruiting_season" v-if="fruiting_season_options">
												<dt>Época da frutificação</dt>
												<dd>
													<b-badge v-for="(fruiting_season_option, month) in fruiting_season_options" v-bind:class="{ 'btn-success': !!seed.field_fruiting_season.find((fs) => (fs.value == month))}" :key="month">{{fruiting_season_option}}</b-badge>
												</dd>
											</dl>
										</div>
									</div>
									<div class="row" v-if="seed.field_images && seed.field_images.length > 1">
										<div class="col-sm-4" v-for="(image, index) in seed.field_images">
											<b-img v-bind:src="image.url" fluid thumbnail :key="index" />
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

export default {

	name: 'Seed', 

	data () {
		return { 
			seed: null,
			seed_variation: null,
			ecosystem_options: null,
			fruiting_season_options: null,
			error: false,
			loading: false
		}
	},

	created () {
		
		this.loading = true
		
		axios.get('product/' + this.$route.params.id + '?_format=json').then(seed => {
			this.seed = seed.data 
			axios.get('entity/commerce_product_variation/' + this.seed.variations[0].target_id + '?_format=json').then(seed_variation => {
				this.seed_variation = seed_variation.data 
				this.loading = false

				axios.get('entity/field_storage_config/commerce_product.field_ecosystem?_format=json')
				.then(response => {
					this.ecosystem_options = response.data.settings.allowed_values
				}).catch(error => { this.error = error.message });

				axios.get('entity/field_storage_config/commerce_product.field_fruiting_season?_format=json')
				.then(response => {
					this.fruiting_season_options = response.data.settings.allowed_values
				}).catch(error => { this.error = error.message });

			}).catch(error => { this.error = error.message; this.loading = false })
		}).catch(error => { this.error = error.message, this.loading = false })

	},

	components: { 
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}


};
</script>
