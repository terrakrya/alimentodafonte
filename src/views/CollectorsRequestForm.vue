<template>
	<div class="collectors-request-form">
		<breadcrumb :links="[['Pedidos para coletores', '/pedidos-para-coletores']]" :active="isEditing() ? 'Pedido '+$route.params.id : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="pedido para coletores" />
				<loading :loading="loading" />
				<b-form @submit.prevent="save" v-if="!loading">
					<div class="row">
						<div class="col-sm-4">
							<b-form-group label="Casa de sementes *" >
								<form-entity-select v-if="seeds_houses" :items="seeds_houses" :form="form" field="field_requests_seeds_house" />
							</b-form-group>							
						</div>					
						<div class="col-sm-4">
							<b-form-group label="Grupo de coletores" >
								<form-entity-select v-if="collectors_groups.length" :items="collectors_groups" :form="form" field="field_requests_group" />
							</b-form-group>							
						</div>					
						<div class="col-sm-4">
							<b-form-group label="Coletor" >
								<form-entity-select v-if="collectors" :items="collectors" :form="form" field="field_requests_collector" />
							</b-form-group>							
						</div>					
					</div>		
					<div class="row">
						<div class="col-sm-12">
							<form-seeds-select :form="form" field="field_paragraph_seeds" fieldtype="collectors_seeds_requests" :parent="this.$route.params.id" fieldseed="field_paragraph_seed" fieldextra="field_paragraph_weight" :seeds="seeds" v-if="seeds.length" />
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
