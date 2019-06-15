<template>
	<div class="collectors-group">
		<breadcrumb :links="[['Grupos de coletores', '/grupos-de-coletores']]" active="Dados do grupo" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="isLoading" />
				<div v-if="collectors_group && !isLoading">
					<div class="row item-title">
						<div class="col-md-10">
							<h1>
								{{ collectors_group.name }}
							</h1>
							<p v-if="collectors_group.cnpj">
								<span>CNPJ: {{ collectors_group.cnpj | cnpj }}</span>
							</p>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-12" >
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Detalhes</strong>
									<i @click="edit" class="pull-right fa fa-pencil"></i>
								</div>
								<div class="list-group-item">
									<div class="row" v-if="collectors_group.body">
										<div class="col-sm-12">
											<p class="details" colspan="2" v-html="collectors_group.body"></p>
										</div>
									</div>
									<div class="row">
										<div class="col-sm-6">
											<dl v-if="collectors_group.contact">
												<dt>Contatos</dt>
												<dd>{{ collectors_group.contact }}</dd>
											</dl>
											<dl v-if="collectors_group.address">
												<dt>Endereço</dt>
												<dd>{{ collectors_group.address | address }}</dd>
											</dl>
										</div>
										<div class="col-sm-6">
											<bank-account :bank_account="collectors_group.bank_account" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-6" v-if="collectors_group.collectors && collectors_group.collectors.length">
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Coletores</strong>
								</div>
								<div class="list-group-item" v-for="(collector, index) in collectors_group.collectors" :key="index" >
									<router-link :to="'/coletor/'+collector._id">
										<img v-if="collector.image" :src="baseUrl + collector.image.thumb" />
										<span v-if="collector.name">{{collector.name}}</span>
									</router-link>
								</div>
							</div>
						</div>
						<!-- <div class="col-sm-6" v-if="collectors_group.seeds && collectors_group.seeds.length">
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Sementes</strong>
								</div>
								<div class="list-group-item" v-for="(seed, index) in collectors_group.seeds" :key="index" >
									<router-link :to="'/semente/'+seed.product_id">
										<img v-if="present(seed.images, 'url')" :src="seed.images[0].url" />
										<span v-if="present(seed.name)">{{seed.name}}</span>
									</router-link>
								</div>
							</div>
						</div> -->
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
import BankAccount from '@/components/BankAccount'

export default {

	name: 'CollectorsGroup',

	data () {
		return {
			collectors_group: null,
		}
	},

	created () {
		this.isLoading = true
		axios.get('collectors_groups/' + this.$route.params.id, { params: { populate: 'collectors seeds'} }).then(collectors_group => {
			this.collectors_group = collectors_group.data
			this.isLoading = false
		}).catch(this.showError);
	},

	methods: {
		edit () {
			this.$router.replace('/editar-grupo-de-coletores/'+this.collectors_group._id)
		}
	},

	components: {
		Loading,
		Breadcrumb,
		BankAccount
	}

};
</script>
