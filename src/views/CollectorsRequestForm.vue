<template>
	<div class="collectors-request-form">
		<breadcrumb :links="[['Pedidos para coletores', '/pedidos-para-coletores']]" :active="isEditing() ? 'Pedido '+form.code : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="pedido para coletores" />
				<loading :loading="isLoading" />
				<b-form @submit.prevent="save" v-if="!isLoading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Grupo de coletores" >
								<form-entity-select type="collectors_groups" :form="form" field="collectors_group" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Coletor" >
								<form-entity-select type="collectors" :form="form" field="collector" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12">
							<form-seeds-select :form="form" field="seed_items" :callback="seedsChanged" />
							<div v-for="(seeds_error, index) in seeds_errors" :key="index" class="alert alert-danger">
								{{seeds_error}}
							</div>
						</div>
					</div>
					<form-submit :errors="error" :sending="isSending" v-if="!seeds_errors.length && form.seed_items.length" />
				</b-form>
			</div>
		</div>
		<pre>{{form}}</pre>
		<pre>{{seeds}}a</pre>
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
			seeds_errors: [],
			seeds_checklist: {},
			seeds: [],
			potential_lists: {},
			form: {
				code: null,
				collectors_group: null,
				collector: null,
				seed_items: [],
			}
		}
	},
	async created () {

		axios.get('potential_lists').then(response => {
			this.potential_lists = response.data
		}).catch(this.showError)

		axios.get('seeds').then(response => {
			this.seeds = response.data
		}).catch(this.showError)

		if (this.isEditing()) {
			this.edit(this.$route.params.id)
		}
	},
	methods: {
		edit (id) {
			this.isLoading = true
			axios.get('collectors_requests/' + id).then(response => {
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
						method: (this.isEditing() ? 'PUT' : 'POST'),
						url: 'collectors_requests' + (this.isEditing() ? '/' + this.$route.params.id : ''),
						data: this.form
					}).then(resp => {
						var collectors_request = resp.data
						if (collectors_request && collectors_request._id) {
							this.$router.replace('/pedido-para-coletores/'+collectors_request._id)
						}
						this.isSending = false
					}).catch(this.showError)
				}
			})
		},
		seedsChanged (items) {
			this.validateQty()
		},
		validateQty () {
			this.seeds_errors = []
			if ((this.form.collectors_group || this.form.collector) && this.form.seed_items.length && this.potential_lists) {

				this.seeds_checklist = {}

				this.form.seed_items.forEach(item => {
					this.seeds_checklist[item.seed] = Number(this.seeds_checklist[item.seed] || 0) + Number(item.qtd)
				})

				Object.keys(this.seeds_checklist).map(seed_id => {
					let pls = this.potential_lists.filter(pl => {

						let collector = this.form.collector

						let group = this.form.collectors_group
						return ((
								(collector && pl.collector && pl.collector == collector) ||
								(group && pl.collectors_group && pl.collectors_group == group)
							) && pl.seed_items && pl.seed_items.find(s => (s.seed == seed_id)))
					})

					if (pls && pls.length) {
						let seeds = pls.map(pl => pl.seed_items)
						if (seeds && seeds.length) {
							seeds = seeds.reduce((acc, val) => acc.concat(val), []).filter(s => (s.seed == seed_id))
							var qtd = seeds.map((item) => Number(item.qtd)).reduce((a, b) => a + b)
							if (Number(qtd) < this.seeds_checklist[seed_id]) {
								this.seeds_errors.push('A quantidade solicitada ('+this.seeds_checklist[seed_id]+' kg de '+this.seeds.find(s => s._id == seed_id).name+') é maior que o potencial de coleta ('+ qtd + ' kg) desse coletor/grupo ')
							}
						}
					} else {
						this.seeds_errors.push('Não existe potencial de coleta de '+this.seeds.find(s => s._id == seed_id).name+' para este coletor/grupo')
						return false
					}

				})
			}
		}
	},
	watch: {
		'form.collectors_group': function () {
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
