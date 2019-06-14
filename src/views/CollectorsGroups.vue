<template>
	<div class="collectors-group">
		<breadcrumb active="Grupos de coletores" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Grupos de coletores" addUrl="/cadastrar-grupo-de-coletores" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :isLoading="!collectors_groups && !error" msg="Carregando lista de grupos" />
					<div v-if="collectors_groups">
						<b-table stacked="md" :fields="table_fields" :items="collectors_groups" :sort-by="'title'" :filter="filters.search">
							<template slot="title" slot-scope="data">
								<router-link :to="'/grupo-de-coletores/'+ data.item.nid">
									<strong>{{data.item.title}}</strong>
									<small v-if="data.item.collectors">
										<br>
										{{data.item.collectors.length}} {{data.item.collectors.length | pluralize('coletor', 'coletores')}}
									</small>
								</router-link>
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-grupo-de-coletores/'+ data.item.nid" class="fa fa-edit btn btn-primary btn-xs "></router-link>
								<a @click="remove(data.item.nid)" class="fa fa-trash btn btn-danger btn-xs"></a>
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
	
	name: 'CollectorsGroups', 
	
	data () {
		return { 
			
			filters: { search: null },
			table_fields: [
				{ key: 'title', label: 'Grupo', sortable: true },
				{ key: 'city', label: 'Localidade', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			],
			collectors_groups: null
		}
	},
	
	created () {
		this.list()
	},

	methods: {
		list () {
			axios.get('rest/collectors-groups?_format=json').then(response => {
				this.collectors_groups = response.data.map(collectors_group => {
					return { 
						nid: collectors_group.nid[0].value,
						title: collectors_group.title[0].value,
						collectors: collectors_group.field_collectors,
						city: collectors_group.field_address.length ? 
							[collectors_group.field_address[0].locality, collectors_group.field_address[0].administrative_area].filter(Boolean).join(' - ')
							: ''
					}
				})
			}).catch(this.showError)
		},
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('node/' + id + '?_format=json').then(() => {
					this.list()
				}).catch(this.showError)	
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
