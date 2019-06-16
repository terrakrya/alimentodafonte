<template>
	<div class="collectors-request-form">
		<breadcrumb :links="[['Pedidos para coletores', '/pedidos-para-coletores']]" :active="isEditing() ? 'Pedido '+$route.params.id : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="pedido para coletores" />
				<loading :loading="isLoading" />
				<b-form @submit.prevent="save" v-if="!isLoading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Grupo de coletores" >
								<form-entity-select v-if="collectors_groups.length" :items="collectors_groups" :form="form" field="group" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Coletor" >
								<form-entity-select v-if="collectors" :items="collectors" :form="form" field="collector" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12">
							<form-seeds-select :form="form" field="field_paragraph_seeds" fieldtype="collectors_seeds_requests" :parent="this.$route.params.id" fieldseed="field_paragraph_seed" fieldqtd="field_paragraph_weight" v-if="seeds.length" :callback="seedsChanged" />
							<div v-for="(seeds_error, index) in seeds_errors" :key="index" class="alert alert-danger">
								{{seeds_error}}
							</div>
						</div>
					</div>
					<form-submit :errors="error" :sending="isSending" />
				</b-form>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormHeadline from '@/components/FormHeadline'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSeedsSelect from '@/components/FormSeedsSelect'
import FormSubmit from '@/components/FormSubmit'

export default {

	name: 'CollectorsRequestForm',

	data () {

		return {
			seeds_list: [],
			seeds_errors: [],
			seeds_checklist: {},
			form: {
				code: '',
				seeds_house: null,
				collectors_group: null,
				collector: null,
				field_paragraph_seeds: [],
			}
		}
	},
	async created () {

		this.getList('collectors')
		this.getList('collectors_groups')
		this.getList('seeds_houses')
		this.getList('potential_lists')
		this.getList('seeds')

		if (this.isEditing()) {
			this.edit(this.$route.params.id)
		}
	},
	computed: {
		collectors () {
      return this.$store.state.collectors
    },
    collectors_groups () {
      return this.$store.state.collectors_groups
    },
    seeds_houses () {
      return this.$store.state.seeds_houses
    },
    seeds () {
      return this.$store.state.seeds
    },
    potential_lists () {
      return this.$store.state.potential_lists
    }
	},
	methods: {
		edit (id) {
			this.isLoading = true
			axios.get('node/' + id + '?_format=json').then(response => {
				var data = response.data
				this.apiDataToForm(this.form, data)
				this.isLoading = false
			}).catch(this.showError);
		},
		save () {
			this.$validator.validate().then(isValid => {
				if (isValid) {
					this.isSending = true
					this.error = false
					axios({
						method: (this.isEditing() ? 'PATCH' : 'POST'),
						url: 'node' + (this.isEditing() ? '/' + this.$route.params.id : '')+'?_format=json',
						data: this.form
					}).then(resp => {
						var collectors_request = resp.data
						if (collectors_request && collectors_request.nid) {
							this.loadList('collectors_requests')
							this.$router.replace('/pedido-para-coletores/'+collectors_request.nid[0].value)
						}
						this.isSending = false
					}).catch(this.showError)
				}
			})
		},
		seedsChanged (items) {
			this.seeds_list = items
			this.validateQty()
		},
		validateQty () {
			this.seeds_errors = []
			if ((this.form.group.length || this.form.collector.length) && this.form.field_paragraph_seeds.length && this.potential_lists) {

				this.seeds_checklist = {}

				this.seeds_list.forEach(seed => {
					this.seeds_checklist[seed.seed_id] = Number(this.seeds_checklist[seed.seed_id] || 0) + Number(seed.qtd)
				})

				Object.keys(this.seeds_checklist).map(seed_id => {
					let pls = this.potential_lists.filter(pl => {

						let collector = this.present(this.form.collector, 'target_id') ? this.form.collector[0].target_id : null

						let group = this.present(this.form.group, 'target_id') ? this.form.group[0].target_id : null

						return ((
								(collector && pl.collector && pl.collector.id == collector) ||
								(group && pl.group && pl.group.id == group)
							) && pl.seeds && pl.seeds.find(s => (s.id == seed_id)))
					})

					if (pls && pls.length) {
						let seeds = pls.map(pl => pl.seeds)
						if (seeds && seeds.length) {
							seeds = seeds.reduce((acc, val) => acc.concat(val), []).filter(s => (s.id == seed_id))
							var qtd = seeds.map((item) => Number(item.weight)).reduce((a, b) => a + b)
							if (Number(qtd) < this.seeds_checklist[seed_id]) {
								this.seeds_errors.push('A quantidade solicitada ('+this.seeds_checklist[seed_id]+' kg de '+this.seeds.find(s => s.id == seed_id).title+') é maior que o potencial de coleta ('+ qtd + ' kg) desse coletor/grupo ')
							}
						}
					} else {
						this.seeds_errors.push('Não existe potencial de coleta de '+this.seeds.find(s => s.id == seed_id).title+' para este coletor/grupo')
						return false
					}

				})
			}
		}
	},
	watch: {
		'form.group': function () {
			this.validateQty()
		},
		'form.collector': function () {
			this.validateQty()
		}
	},
	components: {
		Breadcrumb,
		Loading,
		FormHeadline,
		FormEntitySelect,
		FormSeedsSelect,
		FormSubmit
	}

};
</script>
