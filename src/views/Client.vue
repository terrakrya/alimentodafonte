<template>
	<div class="client">
		<breadcrumb :links="[['Clientes', '/clientes']]" active="Dados do cliente" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="loading" />
				<div v-if="client && !loading">
					<div class="row item-title">
						<div class="col-md-2" v-if="present(client.user_picture, 'url')">
							<img :src="client.user_picture[0].url" class="img-responsive item-img" />
						</div>
						<div class="col-md-10">
							<h1>
								{{ client.field_name[0].value }}								
							</h1>
							<p>
								<span>{{ client.field_contact[0].value }}</span> &bull; 
								<span v-if="present(client.field_nickname) && client.field_nickname[0].value != client.field_name[0].value">
									{{ client.field_nickname[0].value }}
								</span>
							</p>
							<p v-if="client.field_address && client.field_address.length > 0">
								<span>
									{{client.field_address | address}}
								</span>
							</p>
							<router-link :to="'/editar-cliente/'+client.uid[0].value" class="btn btn-default btn-xs">
								<i class="fa fa-edit" aria-hidden="true"></i>
								Editar cliente
							</router-link>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-6" >
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Dados do cliente</strong>
								</div>
								<div class="list-group-item">
									<dl v-if="present(client.field_cpf)">
										<dt>CPF</dt>
										<dd>{{ client.field_cpf[0].value | cpf }}</dd>
									</dl>
									<dl v-if="present(client.mail)">
										<dt>Email</dt>
										<dd>{{ client.mail[0].value }}</dd>
									</dl>
									<dl v-if="present(client.name)">
										<dt>Nome de usuário</dt>
										<dd>{{ client.name[0].value }}</dd>
									</dl>
								</div>
							</div>
						</div>
						<div class="col-sm-6" >
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Dados bancários</strong>
								</div>
								<div class="list-group-item">
									<dl v-if="present(client.field_bank_number)">
										<dt>Banco</dt>
										<dd>{{ bancos.find((banco) => banco.value == client.field_bank_number[0].value ).text }}</dd>
									</dl>
									<dl v-if="present(client.field_agency)">
										<dt>Agência</dt>
										<dd>{{ client.field_agency[0].value }}</dd>
									</dl>
									<dl v-if="present(client.field_bank_account)">
										<dt>Conta {{ accountType }}</dt>
										<dd>{{ client.field_bank_account[0].value }}</dd>
									</dl>
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
import bancos from '@/data/bancos.json';
import tipos_de_conta from '@/data/tipos-de-conta.json';

export default {

	name: 'Collector', 

	data () {
		return { 
			client: null,
			error: false,
			loading: false,
			bancos: bancos,
			tipos_de_conta: tipos_de_conta
		}
	},

	created () {
		
		this.loading = true
		
		axios.get('user/' + this.$route.params.id + '?_format=json').then(client => {
			this.client = client.data 
			this.loading = false
		}).catch(error => { this.error = error.message, this.loading = false })

	},

	computed: {
		accountType () {
			if (this.present(this.client.field_type_account)) {
				return tipos_de_conta.find(tipo_de_conta => {
					return tipo_de_conta.value == this.client.field_type_account[0].value
				}).text			
			}
			return ''
		}
	},

	components: { 
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
