<template>
	<div class="collector">
		<breadcrumb v-bind:links="[['Coletores', '/coletores']]" active="Dados do coletor" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading v-bind:loading="loading" />
				<div v-if="collector && !loading">
					<div class="row item-title">
						<div class="col-md-2" v-if="present(collector.user_picture, 'url')">
							<img v-bind:src="collector.user_picture[0].url" class="img-responsive item-img" />
						</div>
						<div class="col-md-10">
							<h1>
								{{ collector.field_name[0].value }}								
							</h1>
							<p>
								<span>{{ collector.field_contact[0].value }}</span> &bull; 
								<span v-if="present(collector.field_nickname) && collector.field_nickname[0].value != collector.field_name[0].value">
									{{ collector.field_nickname[0].value }}
								</span>
							</p>
							<p v-if="collector.field_address && collector.field_address.length > 0">
								<span>
									{{collector.field_address | address}}
								</span>
							</p>
							<router-link v-bind:to="'/editar-coletor/'+collector.uid[0].value" class="btn btn-default btn-xs">
								<i class="fa fa-edit" aria-hidden="true"></i>
								Editar coletor
							</router-link>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-6" >
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Dados do coletor</strong>
								</div>
								<div class="list-group-item">
									<dl v-if="present(collector.field_cpf)">
										<dt>CPF</dt>
										<dd>{{ collector.field_cpf[0].value | cpf }}</dd>
									</dl>
									<dl v-if="present(collector.mail)">
										<dt>Email</dt>
										<dd>{{ collector.mail[0].value }}</dd>
									</dl>
									<dl v-if="present(collector.name)">
										<dt>Nome de usuário</dt>
										<dd>{{ collector.name[0].value }}</dd>
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
									<dl v-if="present(collector.field_bank_number)">
										<dt>Banco</dt>
										<dd>{{ bancos.find((banco) => banco.value == collector.field_bank_number[0].value ).text }}</dd>
									</dl>
									<dl v-if="present(collector.field_agency)">
										<dt>Agência</dt>
										<dd>{{ collector.field_agency[0].value }}</dd>
									</dl>
									<dl v-if="present(collector.field_bank_account)">
										<dt>Conta {{ accountType }}</dt>
										<dd>{{ collector.field_bank_account[0].value }}</dd>
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
			collector: null,
			error: false,
			loading: false,
			bancos: bancos,
			tipos_de_conta: tipos_de_conta
		}
	},

	created () {
		
		this.loading = true
		
		axios.get('user/' + this.$route.params.id + '?_format=json').then(collector => {
			this.collector = collector.data 
			this.loading = false
		}).catch(error => { this.error = error.message, this.loading = false })

	},

	computed: {
		accountType () {
			if (this.present(this.collector.field_type_account)) {
				return tipos_de_conta.find(tipo_de_conta => {
					return tipo_de_conta.value == this.collector.field_type_account[0].value
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
