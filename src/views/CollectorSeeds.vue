<template>
	<div class="seeds">
		<breadcrumb active="Sementes" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<div class="info-content">
					<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
					<loading :loading="!seeds && !error" msg="Carregando lista de sementes" />
					<no-item :list="seeds" />
					<div v-if="seeds && seeds.length">
						<b-table stacked="md" :fields="table_fields" :items="seeds" :sort-by="'name'" :filter="filters.search">
							<template slot="name" slot-scope="data">
								{{data.item.name}}
								<br>
								<small>{{data.item.scientific_name}}</small>
							</template>
							<template slot="fruiting_season" slot-scope="data">
								{{data.value.map(v => meses.find(m => m.value == v).text).join(', ')}}
							</template>
							<template slot="seeds_kg" slot-scope="data">
								{{data.value}}
							</template>
							<template slot="compensation_collect" slot-scope="data">
								{{data.item.compensation_collect | currency('R$ ', 2, { decimalSeparator: ',' })}}
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
import meses from '@/data/meses.json'

export default {

	name: 'CollectorSeeds',

	data () {
		return {
			meses: meses,
			filters: { search: null },
			seeds: null,
			table_fields: [
				{ key: 'name', label: 'Semente', sortable: true },
				{ key: 'fruiting_season', label: 'Época da frutificação', sortable: true },
				{ key: 'seeds_kg', label: 'Sementes / kg', sortable: true },
				{ key: 'compensation_collect', label: 'Remuneração', sortable: true },
			]
		}
	},

	created () {
		this.list()
	},
	methods: {
		list() {
      axios.get('collector/seeds').then(response => {
        this.seeds = response.data
      }).catch(this.showError)
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
