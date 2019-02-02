<template>
	<div class="seed">
		<ol class="breadcrumb">
			<li><router-link to="/painel">Painel do gestor</router-link></li>
			<li><router-link to="/sementes">Sementes</router-link></li>
			<li class="active">Dados da semente</li>
		</ol>
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<button v-if="loading" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Carregando dados da semente...</button>
				<div v-if="seed && !loading">
					<div class="row item-title">
						<div class="col-md-2" v-if="seed.field_images && seed.field_images.length">
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
						<div class="col-sm-6 col-md-3" v-if="seed_variation.price && seed_variation.price.length">
							<div class="weekly-summary text-center">
								<span class="info-label">Preço</span>
								<span class="number">{{ seed_variation.price[0].number | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-6 col-md-3" v-if="seed_variation.field_wholesale_price && seed_variation.field_wholesale_price.length">
							<div class="weekly-summary text-center">
								<span class="info-label">Preço no atacado</span>
								<span class="number">{{ seed_variation.field_wholesale_price[0].number | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-6 col-md-3" v-if="seed.field_compensation_collect && seed.field_compensation_collect.length">
							<div class="weekly-summary text-center">
								<span class="info-label">Remuneração do coletor</span>
								<span class="number">{{ seed.field_compensation_collect[0].number | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-6 col-md-3" v-if="seed_variation.field_stock && seed_variation.field_stock.length">
							<div class="weekly-summary text-center">
								<span class="info-label">Quantidade em estoque</span>
								<span class="number" v-bind:class="{red: seed_variation.field_stock[0].value <= 0}">{{ seed_variation.field_stock[0].value | currency('', 0, { thousandsSeparator: '' }) }}</span>
							</div>
						</div>
					</div>
					<table class="resume-table">
						<caption>
							Detalhes
						</caption>
						<tr v-if="seed.body && seed.body.length">
							<td class="details" colspan="2" v-html="seed.body[0].processed"></td>
						</tr>

						<tr>
							<td width="50%" valign="top">
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
							</td>
							<td width="50%" valign="top">
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
							</td>
						</tr>
						<tr v-if="seed.field_images && seed.field_images.length">
							<td width="100%" colspan="2" valign="top">
								<b-img v-for="(image, index) in seed.field_images" v-bind:src="image.url" fluid thumbnail :key="index" />
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from 'axios'

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
				}).catch(error => { this.error = error });

				axios.get('entity/field_storage_config/commerce_product.field_fruiting_season?_format=json')
				.then(response => {
					this.fruiting_season_options = response.data.settings.allowed_values
				}).catch(error => { this.error = error });

			}).catch(error => { this.error = error; this.loading = false })
		}).catch(error => { this.error = error, this.loading = false })

	},


};
</script>
