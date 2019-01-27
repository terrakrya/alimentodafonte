<template>
	<div class="dashboard">
		<ol class="breadcrumb">
			<li><router-link to="/painel">Painel do Gestor</router-link></li>
			<li><router-link to="/sementes">Sementes</router-link></li>
			<li class="active">{{seed.title[0].value}}</li>
		</ol>
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<pre>{{seed}}</pre>
				<b-alert variant="danger" show v-if="error">{{error}}</b-alert>
			</div>
		</div>
	</div>
</template>
<script>
import axios from 'axios'

export default {
	
	name: 'Seed', 
	
	data () {
		return { 
			seed: null
		}
	},
	
	created () {
		axios.get('product/' + this.$route.params.id + '?_format=json').then(response => {
			this.seed = response.data 
		}).catch(error => {
			this.error = error
		})
	},
	
	
};
</script>
