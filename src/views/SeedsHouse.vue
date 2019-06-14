<template>
	<div class="seeds-house">
		<breadcrumb :links="[['Casas de sementes', '/casas-de-sementes']]" active="Dados da casa" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
				<loading :loading="isLoading" />
				<div v-if="seeds_house && !isLoading">
					<div class="row item-title">
						<div class="col-md-10">
							<h1>
								{{ seeds_house.name[0].value }}								
							</h1>
							<p>
								<span v-if="present(seeds_house.field_phone)">{{ seeds_house.field_phone[0].value }}</span>
								&bull;
								<span v-if="user">
									Proprietário: {{ user.field_name[0].value }}
								</span>
							</p>
							<router-link :to="'/editar-casa-de-sementes/'+seeds_house.store_id[0].value" class="btn btn-default btn-xs">
								<i class="fa fa-edit" aria-hidden="true"></i>
								Editar casa
							</router-link>
						</div>
					</div>
					<hr class="clearfix">
					<div class="row">
						<div class="col-sm-6" v-if="collectors && collectors.length">
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Coletores</strong>
								</div>
								<div class="list-group-item" v-for="(collector, index) in collectors" :key="index" >
									<router-link :to="'/coletor/'+collector.uid[0].value">
										<img v-if="present(collector.user_picture, 'url')" :src="collector.user_picture[0].url" />
										<span v-if="present(collector.field_name)">{{collector.field_name[0].value}}</span>
									</router-link>
								</div>
							</div>
						</div>
						<div class="col-sm-6" v-if="collectors_groups && collectors_groups.length">
							<div class="list-group entity-select-preview">
								<div class="list-group-item active">
									<strong>Grupos de coletores</strong>
								</div>
								<div class="list-group-item" v-for="(collectors_group, index) in collectors_groups" :key="index" >
									<router-link :to="'/grupo-de-coletores/'+collectors_group.nid[0].value">
										<span v-if="present(collectors_group.title)">{{collectors_group.title[0].value}}</span>
									</router-link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'

export default {

	name: 'SeedsHouse', 

	data () {
		return { 
			seeds_house: null,
			collectors: [],
			collectors_groups: [],
			user: null,
			
			
		}
	},

	created () {
		
		this.isLoading = true
		
		axios.get('store/' + this.$route.params.id + '?_format=json').then(seeds_house => {
			this.seeds_house = seeds_house.data 
			this.isLoading = false

			axios.get('rest/collectors-groups?_format=json').then(response => {
				this.collectors_groups = response.data.filter(collectors_group => {
					return this.seeds_house.field_group.find(item => {
						return collectors_group.nid[0].value == item.target_id
					})
				})
			}).catch(this.showError)

			axios.get('rest/collectors?_format=json').then(response => {
				this.collectors = response.data.filter(collector => {
					return this.seeds_house.field_collector.find(item => {
						return collector.uid[0].value == item.target_id
					})
				})
			}).catch(this.showError)

			if (this.present(this.seeds_house.uid, 'target_id')) {			
				axios.get('user/' + this.seeds_house.uid[0].target_id + '?_format=json').then(response => {
					this.user = response.data
				}).catch(this.showError)
			}
		}).catch(this.showError);

	},

	components: { 
		'loading': Loading,
		'breadcrumb': Breadcrumb
	}

};
</script>
