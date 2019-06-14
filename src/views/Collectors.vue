<template>
	<div class="collectors">
		<breadcrumb active="Coletores"/>
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Coletores" addUrl="/cadastrar-coletor" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :isLoading="!users && !error" msg="Carregando lista de coletores" />
					<no-item :list="users" />
					<div v-if="users && users.length">
						<b-table stacked="md" :fields="table_fields" :items="users" :sort-by="'name'" :filter="filters.search">
							<template slot="name" slot-scope="data">
								<router-link :to="'/coletor/'+ data.item._id">
									<strong>{{(data.item.nickname && data.item.nickname != data.item.name) ? data.item.nickname : data.item.name}}</strong>
									<small v-if="data.item.nickname != data.item.name"><br>{{data.item.name}}</small>
								</router-link>
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-coletor/'+ data.item._id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
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
			axios.get('users', { params: { role: 'collector'} }).then(response => {
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
