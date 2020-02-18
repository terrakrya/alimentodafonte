<template>
	<div class="users">
		<router-link class="btn btn-success btn-round btn-add" to="/cadastrar-usuario"><i class="material-icons">add</i>Cadastrar usuário</router-link>
		<div class="card">
			<div class="card-header card-header-icon card-header-rose">
				<div class="card-icon">
					<i class="material-icons">person</i>
				</div>
				<h4 class="card-title ">Usuários</h4>
			</div>
			<div class="card-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="!users && !error" msg="Carregando lista de usuarios" />
				<no-item :list="users" />
				<div v-if="users && users.length">
					<b-table stacked="md" :fields="table_fields" :items="users" :sort-by="'name'" :filter="filters.search">
						<template slot="name" slot-scope="data">
							<router-link :to="'/usuario/'+ data.item._id">
								<strong>{{data.item.name}}</strong>
								<small><br>{{data.item.email}}</small>
							</router-link>
						</template>
						<template slot="roles" slot-scope="data">
							{{data.value | roles}}
						</template>
						<template slot="actions" slot-scope="data">
							<div class="btn-group btn-group-sm">
								<router-link class="btn btn-info" :to="'/editar-usuario/'+ data.item._id">
									<i class="material-icons">edit</i>
								</router-link>
								<button class="btn btn-danger" @click="remove(data.item._id)"> <i class="material-icons">close</i> </button>
							</div>
						</template>
					</b-table>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'

export default {

	name: 'Users',

	data () {
		return {

			filters: { search: null },
			table_fields: [
				{ key: 'name', label: 'Nome', sortable: true },
				{ key: 'roles', label: 'Perfis', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'td-actions text-right' },
			],
			users: null
		}
	},
	created () {
		this.list()
	},
	methods: {
		list () {
			axios.get('users').then(response => {
				this.users = response.data
			}).catch(this.showError)
		},
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('users/' + id).then(() => {
					this.list()
				}).catch(this.showError)
			}
		}
	},
	components: {
		Loading,
		NoItem,
	}

};
</script>
