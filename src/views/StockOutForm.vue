<template>
	<div class="stock-in-form">
		<breadcrumb :links="[['Estoque', '/estoque']]" active="Saída de estoque" />
		<div class="panel panel-headline data-list">
			<div class="panel-body">
				<h1>
					Cadastrar saída
				</h1>
				<br>
				<loading :loading="isLoading" />
				<b-form @submit.prevent="save" v-if="!isLoading">
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Casa de sementes *" >
								<form-entity-select :input="seedsHouseSelected" type="seeds_houses" :form="form" field="seeds_house" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Semente *" >
								<form-entity-select :input="seedSelected" type="seeds" :form="form" field="seed" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Comprador" >
								<form-entity-select type="clients" :form="form" field="buyer" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Quantidade (Kg) *">
								<b-form-input v-model="form.qtd" type="number" v-validate="'required'" name="qtd" />
								<field-error :msg="veeErrors" field="qtd" />
							</b-form-group>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-6">
							<b-form-group label="Lote *" v-if="lot_filtered_options.length && !add_new_lot">
								<form-entity-select :items="lot_filtered_options" :form="form" field="lot" />
								<a @click="newLot" class="pull-right pointer">Adicionar novo lote</a>
							</b-form-group>
							<b-form-group label="Novo lote *" v-if="!lot_filtered_options.length || add_new_lot" description="Um novo lote será criado com esse código">
								<b-form-input v-model="new_lot" v-validate="'required'" name="new_lot" />
								<field-error :msg="veeErrors" field="new_lot" />
							</b-form-group>
						</div>
						<div class="col-sm-6">
							<b-form-group label="Modos de saída *" >
								<b-form-radio-group v-model="form.out_mode" :options="modos_de_saida" stacked v-validate="'required'" name="out_mode" />
								<field-error :msg="veeErrors" field="out_mode" />
							</b-form-group>
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
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import modos_de_saida from '@/data/modos-de-saida.json'

export default {

	name: 'StockOutForm',

	data () {

		return {
			lot_filtered_options: [],
			lot_options: [],
			new_lot: null,
			add_new_lot: false,
			price: null,
			modos_de_saida: modos_de_saida,
			form: {
				price: 0,
				out_mode: null,
				qtd: 0,
				seeds_house: null,
				seed: null,
				buyer: null,
				lot: null
			}
		}
	},
	created () {
    axios.get('lots').then(response => {
      this.lots = response.data
    }).catch(this.showError)
	},
	methods: {
		save () {
			this.$validator.validate().then(isValid => {
				if (isValid) {
					this.isSending = true
					this.error = false

					if (this.form.qtd) {
						if (this.form.qtd > 0) {
							this.form.qtd = this.form.qtd * -1
						}
						if (this.price) {
							this.form.price = this.price * this.form.qtd
						}
					}

					if (!this.form.lot && this.new_lot) {
						axios.post('lots', {
            	code: this.new_lot,
            	seeds_house: this.form.seeds_house,
            	seed: this.form.seed,
            }).then(resp => {
            	this.form.lot = resp.data._id
            	this.saveItem()
            }).catch(this.showError);
					} else {
						this.saveItem()
					}
				}
			})
		},
		saveItem () {
			axios({
				method: 'POST',
				url: 'stock_out',
				data: this.form
			}).then(resp => {
				var stock_out = resp.data
				if (stock_out && stock_out._id) {
					this.isSending = false
					this.$router.replace('/estoque')
				}
				this.isSending = false
			}).catch(this.showError)
		},
		seedSelected (seed) {
			if (seed) {
				this.price = Number(seed.compensation_collect)
				this.filterOptions()
			}
		},
		seedsHouseSelected () {
			this.filterOptions()
		},
		newLot() {
      this.add_new_lot = true
      this.form.lot = null
    },
    filterOptions() {
      if (this.form.seed && this.form.seeds_house) {
        this.lot_filtered_options = this.lots.filter(lot => {
          return lot.seed == this.form.seed && lot.seeds_house == this.form.seeds_house
        }).map(lot => ({
					id: lot._id,
					title: lot.code
				}))
        this.form.lot = null
      }
    },
	},
	components: {
		Breadcrumb,
		Loading,
		FormEntitySelect,
		FormSubmit,
		FieldError,
	}

};
</script>
