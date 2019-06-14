<template>
	<div class="clients">
		<breadcrumb active="Clientes"/>
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Clientes" addUrl="/cadastrar-cliente" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!users && !error" msg="Carregando lista de clientes" />
					<no-item :list="users" />
					<div v-if="users && users.length">
						<b-table stacked="md" :fields="table_fields" :items="users" :sort-by="'name'" :filter="filters.search">
							<template slot="name" slot-scope="data">
								<router-link :to="'/cliente/'+ data.item._id">
									<strong>{{(data.item.nickname && data.item.nickname != data.item.name) ? data.item.nickname : data.item.name}}</strong>
									<small v-if="data.item.nickname != data.item.name"><br>{{data.item.name}}</small>
								</router-link>
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-cliente/'+ data.item._id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
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

	name: 'Collectors',

	data () {
		return {
			error: false,
			filters: { search: null },
			table_fields: [
				{ key: 'name', label: 'Nome', sortable: true },
				{ key: 'address.city', label: 'Localidade', sortable: true },
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
			axios.get('users', { params: { role: 'client'} }).then(response => {
				this.users = response.data
			}).catch(error => { this.error = error.message })
		},
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('users/' + id).then(() => {
					this.list()
				}).catch(error => { this.error = error.message })
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
