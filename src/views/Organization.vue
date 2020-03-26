<template>
	<div class="organization">
		<breadcrumb :links="[['Redes', '/organizacoes']]" active="Dados da rede" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="isLoading" />
				<div v-if="organization && !isLoading">
					<div class="row item-title">
						<div class="col-md-10">
							<h1>
								{{ organization.name }}
							</h1>
							<p v-if="organization.cnpj">
								<span>CNPJ: {{ organization.cnpj | cnpj }}</span>
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
									<div class="row" v-if="organization.description">
										<div class="col-sm-12">
											<p class="details" colspan="2" v-html="organization.description"></p>
										</div>
									</div>
									<div class="row">
										<div class="col-sm-6">
											<dl v-if="organization.contact">
												<dt>Contatos</dt>
												<dd>{{ organization.contact }}</dd>
											</dl>
											<dl v-if="organization.address">
												<dt>Endereço</dt>
												<dd>{{ organization.address | address }}</dd>
											</dl>
										</div>
										<div class="col-sm-6">
											<bank-account :bank_account="organization.bank_account" />
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

	name: 'Organization',

	data () {
		return {
			organization: null,
		}
	},

	created () {
		this.isLoading = true
		axios.get('organizations/' + this.$route.params.id).then(organization => {
			this.organization = organization.data
			this.isLoading = false
		}).catch(this.showError);
	},

	methods: {
		edit () {
			this.$router.replace('/editar-organizacao/'+this.organization._id)
		}
	},

	components: {
		Loading,
		Breadcrumb
	}

};
</script>
