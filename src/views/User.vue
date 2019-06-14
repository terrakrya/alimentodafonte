<template>
	<div class="user">
		<breadcrumb :links="[['Usuários', '/usuarios']]" active="Dados do usuário" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :isLoading="loading" />
				<div v-if="user && !loading">
					<div class="row item-title">
						<div class="col-md-2" v-if="user.image && user.image.thumb">
							<img :src="baseUrl + user.image.thumb" class="img-responsive item-img" />
						</div>
						<div class="col-md-10">
							<h1>
								{{ user.name }}
							</h1>
							<p>
								<span>{{ user.contact }}</span> &bull;
								<span v-if="user.nickname && user.nickname != user.name">
									{{ user.nickname }}
								</span>
							</p>
							<p v-if="user.address">
								<span>
									{{user.address | address}}
								</span>
							</p>
							<router-link :to="'/editar-usuario/'+user._id" class="btn btn-default btn-xs">
								<i class="fa fa-edit" aria-hidden="true"></i>
								Editar usuário
							</router-link>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-6" >
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Dados do usuário</strong>
								</div>
								<div class="list-group-item">
									<dl v-if="user.cpf">
										<dt>CPF</dt>
										<dd>{{ user.cpf | cpf }}</dd>
									</dl>
									<dl v-if="user.email">
										<dt>Email</dt>
										<dd>{{ user.email }}</dd>
									</dl>
									<dl v-if="user.name">
										<dt>Nome de usuário</dt>
										<dd>{{ user.name }}</dd>
									</dl>
								</div>
							</div>
						</div>
						<div class="col-sm-6" >
							<bank-account :bank_account="user.bank_account" />
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
import BankAccount from '@/components/BankAccount'

export default {

	name: 'User',

	data () {
		return {
			user: null,
			
			
		}
	},

	created () {

		this.loading = true

		axios.get('users/' + this.$route.params.id).then(user => {
			this.user = user.data
			this.loading = false
		}).catch(this.showError);

	},

	components: {
		Loading,
		Breadcrumb,
		BankAccount
	}

};
</script>
