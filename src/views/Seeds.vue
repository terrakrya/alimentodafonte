<template>
	<div class="seeds">
		<breadcrumb active="Sementes" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<list-headline name="Sementes" addUrl="/cadastrar-semente" :filters="filters"/>
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!seeds && !error" msg="Carregando lista de sementes" />
					<no-item :list="seeds" />
					<div v-if="seeds && seeds.length">
						<b-table stacked="md" :fields="table_fields" :items="seeds" :sort-by="'name'" :filter="filters.search">
							<template slot="name" slot-scope="data">
								<router-link :to="'/semente/'+ data.item._id">{{data.item.name}}</router-link>
							</template>
							<template slot="compensation_collect" slot-scope="data">
								{{data.item.compensation_collect | moeda}}
							</template>
							<template slot="actions" slot-scope="data">
								<router-link :to="'/editar-semente/'+ data.item._id" class="fa fa-edit btn btn-primary btn-xs "></router-link>
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

	name: 'Seeds',

	data () {
		return {
			filters: { search: null },
			seeds: null,
			table_fields: [
				{ key: 'name', label: 'Semente', sortable: true },
				{ key: 'scientific_name', label: 'Nome científico', sortable: true },
				{ key: 'compensation_collect', label: 'Remuneração', sortable: true },
				{ key: 'actions', label: 'Ações', 'class': 'actions' },
			]
		}
	},

	created () {
		this.list()
	},
	methods: {
		async list () {
			this.error = null
			this.seeds = await this.loadList('seeds')
		},
		remove (id) {
			if (confirm("Tem certeza que deseja excluír?")) {
				axios.delete('seeds/' + id).then(() => {
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
