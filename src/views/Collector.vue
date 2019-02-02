<template>
	<div class="collector">
		<ol class="breadcrumb">
			<li><router-link to="/painel">Painel do gestor</router-link></li>
			<li><router-link to="/coletores">Sementes</router-link></li>
			<li class="active">Dados do coletor</li>
		</ol>
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<button v-if="loading" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Carregando dados do coletor...</button>
				<div v-if="collector && !loading">
					<div class="row item-title">
						<div class="col-md-2" v-if="collector.user_picture && collector.user_picture.length">
							<img v-bind:src="collector.user_picture[0].url" class="img-responsive item-img" />
						</div>
						<div class="col-md-10">
							<h1>
								{{ collector.field_name[0].value }}
							</h1>
							<p><span>{{ collector.mail[0].value }}</span> &bull; <span>{{ collector.field_contact[0].value }}</span></p>

							<router-link v-bind:to="'/editar-coletor/'+collector.uid[0].value" class="btn btn-default btn-xs">
								<i class="fa fa-edit" aria-hidden="true"></i>
								Editar coletor
							</router-link>
						</div>
					</div>
					<hr class="clearfix">
					<!-- <div class="row">
						<div class="col-sm-6 col-md-3" v-if="collector_variation.price && collector_variation.price.length">
							<div class="weekly-summary text-center">
								<span class="info-label">Preço</span>
								<span class="number">{{ collector_variation.price[0].number | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-6 col-md-3" v-if="collector_variation.field_wholesale_price && collector_variation.field_wholesale_price.length">
							<div class="weekly-summary text-center">
								<span class="info-label">Preço no atacado</span>
								<span class="number">{{ collector_variation.field_wholesale_price[0].number | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-6 col-md-3" v-if="collector.field_compensation_collect && collector.field_compensation_collect.length">
							<div class="weekly-summary text-center">
								<span class="info-label">Remuneração do coletor</span>
								<span class="number">{{ collector.field_compensation_collect[0].number | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '' }) }}</span>
							</div>
						</div>
						<div class="col-sm-6 col-md-3" v-if="collector_variation.field_stock && collector_variation.field_stock.length">
							<div class="weekly-summary text-center">
								<span class="info-label">Quantidade em estoque</span>
								<span class="number" v-bind:class="{red: collector_variation.field_stock[0].value <= 0}">{{ collector_variation.field_stock[0].value | currency('', 0, { thousandsSeparator: '' }) }}</span>
							</div>
						</div>
					</div>
					<table class="resume-table">
						<caption>
							Detalhes
						</caption>
						<tr v-if="collector.body && collector.body.length">
							<td class="details" colspan="2" v-html="collector.body[0].processed"></td>
						</tr>

						<tr>
							<td width="50%" valign="top">
								<dl>
									<dt>Qtd. de coletores / Kg</dt>
									<dd>{{ collector.field_collectors_kg[0].value | currency('', 0, { thousandsSeparator: '' }) }} coletores / Kg</dd>
								</dl>
								<dl>
									<dt>Taxa de viabilidade</dt>
									<dd>{{ collector.field_viability_rate[0].value | currency('', 0, { thousandsSeparator: '' }) }} % de viabilidade</dd>
								</dl>
								<dl>
									<dt>Limite de peso por lote</dt>
									<dd>{{ collector.field_lot_limit[0].value | currency('', 0, { thousandsSeparator: '' }) }} kg por lote</dd>
								</dl>
							</td>
							<td width="50%" valign="top">
								<dl class="ecosystem" v-if="ecosystem_options">
									<dt>Ecossistemas</dt>
									<dd>
										<b-badge v-for="(ecosystem, index) in collector.field_ecosystem" v-bind:class="ecosystem.value" :key="index">{{ecosystem_options[ecosystem.value]}}</b-badge>
									</dd>
								</dl>
								<dl class="fruiting_season" v-if="fruiting_season_options">
									<dt>Época da frutificação</dt>
									<dd>
										<b-badge v-for="(fruiting_season_option, month) in fruiting_season_options" v-bind:class="{ 'btn-success': !!collector.field_fruiting_season.find((fs) => (fs.value == month))}" :key="month">{{fruiting_season_option}}</b-badge>
									</dd>
								</dl>
							</td>
						</tr>
						<tr v-if="collector.user_picture && collector.user_picture.length">
							<td width="100%" colspan="2" valign="top">
								<b-img v-for="(image, index) in collector.user_picture" v-bind:src="image.url" fluid thumbnail :key="index" />
							</td>
						</tr>
					</table> -->
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
			collector: null,
			collector_variation: null,
			ecosystem_options: null,
			fruiting_season_options: null,
			error: false,
			loading: false
		}
	},

	created () {
		
		this.loading = true
		
		axios.get('user/' + this.$route.params.id + '?_format=json').then(collector => {
			this.collector = collector.data 
			this.loading = false
		}).catch(error => { this.error = error, this.loading = false })

	},


};
</script>
