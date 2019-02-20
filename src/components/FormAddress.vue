<template>
  <div class="form-address">
    <div class="row" :class="{gray: gray}">
      <div class="col-sm-6">
        <b-form-group label="Estado *">
          <b-form-select @input="loadCities" v-model="form.field_address[0].administrative_area" :options="estados" v-validate="'required'" name="administrative_area" />
          <field-error :msg="veeErrors" field="administrative_area" />
        </b-form-group>             
      </div>
      <div class="col-sm-6">
        <b-form-group label="Cidade">
          <b-form-select v-model="form.field_address[0].locality" :options="cidades" />
        </b-form-group>             
      </div>
    </div>            
    <div class="row" :class="{gray: gray}">
      <div class="col-sm-8">
        <b-form-group label="Endereço *">
          <b-form-input v-model="form.field_address[0].address_line1" v-validate="'required'" name="address_line1" />
          <field-error :msg="veeErrors" field="address_line1" />
        </b-form-group>         
      </div>
      <div class="col-sm-4">
        <b-form-group label="CEP">
          <b-form-input v-model="form.field_address[0].postal_code" v-mask="['#####-###']" />
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
      this.cidades = [{ value: "", text: 'Selecione a cidade' } ].concat(Object(cidades)[this.form.field_address[0].administrative_area])
      if (this.form.field_address[0].locality && this.cidades ) { 
        if (!this.cidades.find(c => ( c == this.form.field_address[0].locality ))) {
          this.form.field_address[0].locality = ""
        }        
      }
    }
  }, 
  components: { 
    'field-error' : FieldError
  }
};
</script>
