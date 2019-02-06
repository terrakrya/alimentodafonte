<template>
	<div class="collectors-group">
		<breadcrumb v-bind:links="[['Grupos de coletores', '/grupos-de-coletores']]" active="Dados do grupo" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading v-bind:loading="loading" />
				<div v-if="collectors_group && !loading">
					<div class="row item-title">
						<div class="col-md-10">
							<h1>
								{{ collectors_group.title[0].value }}								
							</h1>
							<p><span>{{ collectors_group.field_contact[0].value }}</span></p>
							<router-link v-bind:to="'/editar-grupo-de-coletores/'+collectors_group.nid[0].value" class="btn btn-default btn-xs">
								<i class="fa fa-edit" aria-hidden="true"></i>
								Editar grupo
							</router-link>
						</div>
					</div>
					<hr class="clearfix">
					<table class="resume-table">
						<caption>
							Detalhes
						</caption>
						<tr v-if="present(collectors_group.body)">
							<td class="details" colspan="2" v-html="collectors_group.body[0].processed"></td>
						</tr>
						<tr>
							<td width="50%" valign="top">
								<dl v-if="present(collectors_group.mail)">
									<dt>Email</dt>
									<dd>{{ collectors_group.mail[0].value }}</dd>
								</dl>
								<dl v-if="present(collectors_group.name)">
									<dt>Nome de usuário</dt>
									<dd>{{ collectors_group.name[0].value }}</dd>
								</dl>
								<dl v-if="present(collectors_group.field_cnpj)">
									<dt>CPF</dt>
									<dd>{{ collectors_group.field_cnpj[0].value | cnpj }}</dd>
								</dl>
							</td>
							<td width="50%" valign="top">
								<dl v-if="present(collectors_group.field_bank_number)">
									<dt>Banco</dt>
									<dd>{{ bancos.find((banco) => banco.value == collectors_group.field_bank_number[0].value ).text }}</dd>
								</dl>
								<dl v-if="present(collectors_group.field_agency)">
									<dt>Agência</dt>
									<dd>{{ collectors_group.field_agency[0].value }}</dd>
								</dl>
								<dl v-if="present(collectors_group.field_bank_account)">
									<dt>Conta {{ collectors_group.field_type_account[0].value }}</dt>
									<dd>{{ collectors_group.field_bank_account[0].value }}</dd>
								</dl>
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
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'
import bancos from '@/data/bancos.json';
import tipos_de_conta from '@/data/tipos-de-conta.json';

export default {

	name: 'CollectorsGroup', 

	data () {
		return { 
			collectors_group: null,
			error: false,
			loading: false,
			bancos: bancos,
			tipos_de_conta: tipos_de_conta
		}
	},

	created () {
		
		this.loading = true
		
		axios.get('node/' + this.$route.params.id + '?_format=json').then(collectors_group => {
			this.collectors_group = collectors_group.data 
			this.loading = false
		}).catch(error => { this.error = error.message, this.loading = false })

	},

	components: { 
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
