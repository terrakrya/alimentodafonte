<template>
	<div class="collectors">
		<breadcrumb active="Coletores" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Coletores" addUrl="/cadastrar-coletor" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!collectors && !error" msg="Carregando lista de coletores" />
					<div v-if="collectors">
						<b-table stacked="md" :fields="table_fields" :items="collectors" :sort-by="'name'" :filter="filters.search">
							<template slot="name" slot-scope="data">
								<router-link :to="'/coletor/'+ data.item.uid">
									<strong>{{(data.item.nickname && data.item.nickname != data.item.name) ? data.item.nickname : data.item.name}}</strong>
									<small v-if="data.item.nickname != data.item.name"><br>{{data.item.name}}</small>
								</router-link>
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-coletor/'+ data.item.uid" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item.uid)" class="fa fa-trash btn btn-danger btn-xs"></a>
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
import ListHeadline from '@/components/ListHeadline'
import Breadcrumb from '@/components/Breadcrumb'

export default {
	
	name: 'Collectors', 
	
	data () {
		return { 
			error: false,
			filters: { search: null },
			table_fields: [
				{ key: 'name', label: 'Coletor', sortable: true },
				{ key: 'city', label: 'Localidade', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			],
			collectors: null
		}
	},
	
	created () {
		this.list()
	},

	methods: {
		list () {
			axios.get('rest/collectors?_format=json').then(response => {
				this.collectors = response.data.map(collector => {
					return { 
						uid: collector.uid[0].value,
						name: collector.field_name[0].value,
						nickname: collector.field_nickname[0].value,
						city: collector.field_address.length ? 
							[collector.field_address[0].locality, collector.field_address[0].administrative_area].filter(Boolean).join(' - ')
							: ''
					}
				})
			}).catch(error => { this.error = error.message })
		},
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('user/' + id + '?_format=json').then(() => {
					this.list()
				}).catch(error => { this.error = error.message })	
			}
		}
	},

	components: { 
		'loading': Loading,
		'list-headline': ListHeadline,
		'breadcrumb': Breadcrumb
	}
		
};
</script>
