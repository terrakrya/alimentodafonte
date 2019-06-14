<template>
	<div class="users">
		<breadcrumb active="Usuários"/>
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Usuários" addUrl="/cadastrar-usuario" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!users && !error" msg="Carregando lista de usuarios" />
					<no-item :list="users" />
					<div v-if="users">
						<b-table stacked="md" :fields="table_fields" :items="users" :sort-by="'name'" :filter="filters.search">
							<template slot="name" slot-scope="data">
								<router-link :to="'/usuario/'+ data.item._id">
									<strong>{{(data.item.nickname && data.item.nickname != data.item.name) ? data.item.nickname : data.item.name}}</strong>
									<small v-if="data.item.nickname != data.item.name"><br>{{data.item.name}}</small>
								</router-link>
							</template>
							<template slot="roles" slot-scope="data">
								{{data.value | roles}}
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-usuario/'+ data.item._id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item._id)" class="fa fa-trash btn btn-danger btn-xs"></a>
							</template>
						</b-table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'
import ListHeadline from '@/components/ListHeadline'
import Breadcrumb from '@/components/Breadcrumb'

export default {

	name: 'Users',

	data () {
		return {
			
			filters: { search: null },
			table_fields: [
				{ key: 'name', label: 'Nome', sortable: true },
				{ key: 'address.city', label: 'Localidade', sortable: true },
				{ key: 'roles', label: 'Perfis', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
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
		ListHeadline,
		Breadcrumb
	}

};
</script>
