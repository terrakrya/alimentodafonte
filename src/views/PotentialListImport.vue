<template>
	<div class="potential-list-form">
		<breadcrumb :links="[['Listas de potencial', '/listas-de-potencial']]" :active="isEditing() ? form.name : 'Importar'" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<div class="row">
			    <div class="col-md-8">
			      <h1>
			        Importar listas de potencial
			      </h1>
			      <br>
			    </div>
			  </div>
				<loading :loading="isLoading" />
				<b-form @submit.prevent="save" v-if="!isLoading">
					<div class="row">
						<div class="col-md-12">
							<b-form-group label="Selecione um arquivo para enviar" description="O arquivo deve estar em formato exel: XLS, XLSX ou CSV " v-show="!isLoading">
						    <b-form-file ref="files" id="files" v-on:change="upload"></b-form-file>
						    <span class="text-danger" v-show="error">{{ error }}</span>
						  </b-form-group>
						</div>
					</div>
					<div v-if="import_log">
						<p v-for="log_item in import_log" :class="log_item.status == 'success' ? 'alert alert-success' : 'alert alert-danger'">{{log_item.message}}</p>
					</div>
					<div v-if="import_preview && !import_log">
						<h2>Os seguintes dados serão inseridos no sistema:</h2>
						<table class="table b-table b-table-stacked-md">
							<thead>
								<tr>
									<th>Grupo</th>
									<th>Qtd - Semente</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in import_preview">
									<td>{{item.collectors_group}}</td>
									<td v-if="item.seed_items"><p v-for="seed_item in item.seed_items">{{seed_item}}</p></td>
								</tr>
							</tbody>
						</table>
					</div>
					<form-submit :errors="error" :sending="isSending" v-if="import_preview"/>
				</b-form>
			</div>
		</div>
		<pre>{{import_preview	}}</pre>
		<pre>{{import_data}}</pre>
	</div>
</template>
<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormHeadline from '@/components/FormHeadline'
import FormSubmit from '@/components/FormSubmit'
import PicturesUpload from '@/components/PicturesUpload'
import FieldError from '@/components/FieldError'
import meses from '@/data/meses.json'
import ecossistemas from '@/data/ecossistemas.json'

export default {

	name: 'SeedImport',

	data () {

		return {
			meses: meses,
			ecossistemas: ecossistemas,
			form: {
				code: null,
        collectors_group: null,
        collector: null,
        seed_items: []
			},
			import_preview: null,
			import_data: null,
			import_log: null,
		}
	},

	created () {
		if (this.isEditing()) {
			this.edit(this.$route.params.id)
		}
	},

	methods: {
		upload(e) {
      this.isLoading = true
      this.error = null
      let files = e.target.files;

      for (var i = 0; i < files.length; i++) {
        var file = files[i]
        var formData = new FormData();
        formData.append('import', file, file.name);
        axios.post("uploads/import", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
					var items = []
					var sheets = response.data.Sheets["Potencial e Pedido 2019"]
					this.import_data = sheets
					var i = 3
					while (i< 1000) {
					  if (sheets['A'+i] && sheets['A'+i].v) {
							try {
								if (sheets['A'+i] && sheets['B'+i] && sheets['E'+i]) {

									items.push({
										seed: sheets['A'+i].v,
										collectors_group: sheets['B'+i].v,
						        qtd: sheets['E'+i].v
									})
								}

							} catch (e) {
								console.log(e);
							}
							i++;
						} else {
							break;
						}

					}
					var groups = items.map(item => item.collectors_group )
					groups = Array.from(new Set(groups))
					this.import_preview = []
					groups.forEach(group => {
						console.log(group);
						axios.get('collectors_groups/search', { params: { name: group } }).then(resp => {
							var collectors_group = resp.data
							if (collectors_group && collectors_group._id) {
								this.import_preview.push({
									collectors_group: group,
									seed_items: items.filter(item => item.collectors_group == group).map(item => {
										// erro aqui
										axios.get('seeds/search', { params: { name: item.seed } }).then(resp => {
											var seed = resp.data
											if (seed && seed._id) {
												return {
													seed: item.seed,
													qtd: item.qtd
												}
											} else {
												return {
													seed: 'Semente: ' + item.seed + ' não encontrada'
												}
											}
										})
									})
								})
							} else {
								this.import_preview.push({
									collectors_group: 'Grupo: ' + group + ' não encontrado',
									seed_items: []
								})
							}
						})

					})
          this.isLoading = false
        }).catch((error) => {
          this.isLoading = false
          this.showError(error)
					console.log(error);
        });
      }
    },
		save() {
			this.import_log = []
			this.import_preview.forEach((item, index) => {
				this.isSending = true
				this.error = false
				axios.get('potential_lists/search', { params: { name: item.name } }).then(resp => {
					var potential_list = resp.data
					var isEditing = false

					if (potential_list && potential_list._id) {
						potential_list = Object.assign(potential_list, item)
						item = potential_list
						isEditing = true
					}
					axios({
						method: (isEditing ? 'PUT' : 'POST'),
						url: (isEditing ? 'potential_lists/'+ potential_list._id : 'potential_lists'),
						data: item
					}).then(resp => {
						var potential_list = resp.data
						if (potential_list && potential_list._id) {
							if (isEditing) {
								this.import_log.push({status: 'success', message: (index + ' - ' + potential_list.name + ': atualizada com sucesso'), index: index})
							} else {
								this.import_log.push({status: 'success', message: (index + ' - ' + potential_list.name + ': cadastrada com sucesso'), index: index})
							}
						} else {
							this.import_log.push({status: 'success', message: (index + ' - Erro: '+potential_list), index: index})
							this.error = potential_list
						}
						this.isSending = false
					}).catch(this.showError)
				}).catch(this.showError)

			})
		}
	},

	components: {
		'breadcrumb': Breadcrumb,
		'loading': Loading,
		'form-headline': FormHeadline,
		'form-submit': FormSubmit,
		'field-error' : FieldError,
		'pictures-upload' : PicturesUpload
	}

};
</script>
