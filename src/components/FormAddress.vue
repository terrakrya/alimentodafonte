<template>
  <div class="form-address">
    <div class="row" :class="{gray: gray}">
      <div class="col-sm-6">
        <b-form-group label="Estado *">
          <b-form-select class="form-control" @input="loadCities" v-model="form.address.uf" :options="estados" v-validate="'required'" name="uf" />
          <field-error :msg="veeErrors" field="uf" />
        </b-form-group>
      </div>
      <div class="col-sm-6">
        <b-form-group label="Cidade">
          <b-form-select class="form-control" v-model="form.address.city" :options="cidades" />
        </b-form-group>
      </div>
    </div>
    <div class="row" :class="{gray: gray}">
      <div class="col-sm-8">
        <b-form-group label="Endereço *">
          <b-form-input v-model="form.address.address" v-validate="'required'" name="address" />
          <field-error :msg="veeErrors" field="address" />
        </b-form-group>
      </div>
      <div class="col-sm-4">
        <b-form-group label="CEP">
          <b-form-input v-model="form.address.postal_code" v-mask="['#####-###']" />
        </b-form-group>
      </div>
    </div>
  </div>
</template>
<script>
import estados from '@/data/estados.json';
import cidades from '@/data/cidades.json';

import FieldError from '@/components/FieldError'


export default {
  name: 'form-address',
  props: {
    form: Object,
    gray: {
      type: Boolean,
      default: false
    },
  },
  inject: ['$validator'],
  data () {
    return {
      estados: estados,
      cidades: [{ value: "", text: 'Selecione o estado' }],
    }
  },
  created () {
    this.loadCities()
  },
  methods: {
    loadCities () {
      this.cidades = [{ value: "", text: 'Selecione a cidade' } ].concat(Object(cidades)[this.form.address.uf])
      if (this.form.address.city && this.cidades ) {
        if (!this.cidades.find(c => ( c == this.form.address.city ))) {
          this.form.address.city = ""
        }
      }
    }
  },
  components: {
    'field-error' : FieldError
  }
};
</script>
