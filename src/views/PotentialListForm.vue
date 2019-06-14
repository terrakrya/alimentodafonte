<template>
	<div class="potential-item-form">
		<breadcrumb :links="[['Listas de potencial', '/listas-de-potencial']]" :active="isEditing() ? 'Listas de potencial ' + $route.params.id : 'Cadastrar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<form-headline name="lista de potencial" />
				<loading :loading="isLoading" />
				<b-form @submit.prevent="save" v-if="!isLoading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Grupo de coletores" >
								<form-entity-select v-if="collectors_groups" :items="collectors_groups" :form="form" field="field_potential_group" />
							</b-form-group>							
						</div>					
						<div class="col-sm-6">
							<b-form-group label="Coletor" >
								<form-entity-select v-if="collectors" :items="collectors" :form="form" field="field_potential_collector" />
							</b-form-group>							
						</div>					
					</div>			
					<div class="row">
						<div class="col-sm-12">
							<form-seeds-select :form="form" field="field_potential_seeds" fieldtype="potential_seeds" :parent="this.$route.params.id" fieldseed="field_potential_seed" fieldqtd="field_potential_qty" :seeds="seeds" v-if="seeds.length" basecalc="compensation_collect" /> 
						</div>					
					</div>		
					<form-submit :errors="error" :isSending="isSending" />
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
	
	name: 'PotentialListForm', 
	
	data () {

		return { 
			
			
			
			form: {
				type:[{ target_id: "potential_collection" }],
				title: [{ value: 'item-potencial-'+Date.now() }],
				field_potential_group: [],
				field_potential_collector: [],
				field_potential_seeds: [],
				field_potential_date: [{ value: '' }],
			},
		}
	},
	
	async created () {

		this.getList('collectors')
		this.getList('collectors_groups')
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
		seeds () {
			return this.$store.state.seeds
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
						var potential_list = resp.data
						if (potential_list && potential_list.nid) {
							this.loadList('potential_lists')
							this.$router.replace('/lista-de-potencial/'+potential_list.nid[0].value)
						}
						this.isSending = false						
					}).catch(this.showError)
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
