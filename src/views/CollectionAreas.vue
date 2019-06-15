<template>
	<div class="collection-areas">
		<breadcrumb active="Áreas de coleta" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Áreas de coleta" addUrl="/cadastrar-area-de-coleta" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!collection_areas && !error" msg="Carregando lista de áreas" />
					<no-item :list="collection_areas" />
					<div v-if="collection_areas && collection_areas.length">
						<b-table stacked="md" :fields="table_fields" :items="collection_areas" :sort-by="'name'" :filter="filters.search">
							<template slot="name" slot-scope="data">
								<router-link :to="'/area-de-coleta/'+ data.item._id">
									{{data.item.name}}
									<small v-if="data.item.estimated_area">
										<br>
										{{data.item.estimated_area}} hectares
									</small>
								</router-link>
							</template>
							<template slot="collectors_group" slot-scope="data">
								<router-link v-if="data.item.collectors_group" :to="'/grupo-de-coletores/'+ data.item.collectors_group._id">
									{{data.item.collectors_group.name}}
								</router-link>
								<router-link v-if="data.item.collector" :to="'/coletor/'+ data.item.collector._id">
									{{data.item.collector.name}}
								</router-link>
							</template>
							<template slot="address" slot-scope="data">
	              <span>{{data.value | city}}</span>
	            </template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-area-de-coleta/'+ data.item._id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
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

	name: 'CollectionAreas',

	data () {
		return {
			collection_areas: [],
			filters: { search: null },
			table_fields: [
				{ key: 'name', label: 'Nome da área', sortable: true },
				{ key: 'collectors_group', label: 'Grupo / Coletor', sortable: true },
				{ key: 'address', label: 'Localidade', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			]
		}
	},
	created () {
		this.list()
	},
	methods: {
		list() {
      axios.get('collection_areas', { params: { populate: 'collectors_group collector'} }).then(response => {
        this.collection_areas = response.data
      }).catch(this.showError)
    },
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('collection_areas/' + id).then(() => {
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
