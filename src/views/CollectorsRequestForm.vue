<template>
	<div class="collectors-request-form">
		<breadcrumb :links="[['Pedidos para coletores', '/pedidos-para-coletores']]" :active="isEditing() ? 'Pedido '+$route.params.id : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="pedido para coletores" />
				<loading :loading="loading" />
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Grupo de coletores" >
								<form-entity-select v-if="collectors_groups.length" :items="collectors_groups" :form="form" field="field_requests_group" />
							</b-form-group>							
						</div>					
						<div class="col-sm-6">
							<b-form-group label="Coletor" >
								<form-entity-select v-if="collectors" :items="collectors" :form="form" field="field_requests_collector" />
							</b-form-group>							
						</div>					
					</div>		
					<div class="row">
						<div class="col-sm-12">
							<form-seeds-select :form="form" field="field_paragraph_seeds" fieldtype="collectors_seeds_requests" :parent="this.$route.params.id" fieldseed="field_paragraph_seed" fieldextra="field_paragraph_weight" :seeds="seeds" v-if="seeds.length" :callback="seedsChanged" />
						</div>
					</div>								
					<form-submit :error="error" :sending="sending" />
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
			error: false,
			loading: false,
			sending: false,
			seeds_list: [],
			form: {
				type: [{ target_id: "requests_for_collectors" }],
				title: [{ value: 'pedido-' + Date.now() }],
				field_requests_seeds_house: [],
				field_requests_group: [],
				field_requests_collector: [],
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
			this.loading = true
			axios.get('node/' + id + '?_format=json').then(response => {
				var data = response.data
				this.apiDataToForm(this.form, data)
				this.loading = false
			}).catch(error => { this.error = error.message; this.loading = false });
		},
		save () {
			this.$validator.validate().then(isValid => {
				if (isValid) {
					this.sending = true
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
						this.sending = false						
					}).catch(error => { this.error = error.response.data.message; this.sending = false })
				}
			})
		}, 
		seedsChanged (items) {
			this.seeds_list = items
		},
		validateQty () {
			this.qty_error = ''
			if ((this.form.field_requests_group.length || this.form.field_requests_collector.length) && this.form.field_paragraph_seeds.length && this.potential_lists) {
				let potential_list = this.potential_lists.find(pl => {
					
					let collector = this.present(this.form.field_requests_collector, 'target_id') ? this.form.field_requests_collector[0].target_id : null

					let group = this.present(this.form.field_requests_group, 'target_id') ? this.form.field_requests_group[0].target_id : null
					return (
						(
							(collector && pl.collector && pl.collector.id == collector) ||
							(group && pl.group && pl.group.id == group)
						) &&
						pl.seeds && pl.seeds.find(s => (s.id == this.form.field_paragraph_seeds[0].target_id))
					)
				})

				if (potential_list) {
					let seed = potential_list.seeds.find(s => (s.id == this.form.field_paragraph_seeds[0].target_id))
					if (Number(seed.weight) < Number(this.form.field_qty[0].value)) {
						this.qty_error = 'Quantidade maior que a solicitada no Pedido '+potential_list.id+': '+ seed.weight + ' kg de '+seed.title
						return false
					} else {
						return true
					}
				} else {
					this.qty_error = 'Não existe registro de pedido dessa semente para este coletor/grupo'
					return false
				}
			}
		}
	},	
	// watch: {
	// 	'form.field_paragraph_seeds': function () {
	// 		this.validateQty()
	// 	}
	// },
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
