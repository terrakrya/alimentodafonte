<template>
  <div class="form-address">
    <div class="row">
      <div class="col-sm-6">
        <b-form-group label="Estado *">
          <b-form-select v-model="form.field_address[0].administrative_area" :options="estados" v-validate="'required'" name="administrative_area" />
          <field-error v-bind:msg="veeErrors" field="administrative_area" />
        </b-form-group>              
      </div>
      <div class="col-sm-6">
        <b-form-group label="Cidade">
          <b-form-input v-model="form.field_address[0].locality"  name="locality" />
          <field-error v-bind:msg="veeErrors" field="locality" />
        </b-form-group>              
      </div>
    </div>            
    <div class="row">
      <div class="col-sm-8">
        <b-form-group label="Endereço">
          <b-form-input v-model="form.field_address[0].address_line1" />
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
import FieldError from '@/components/FieldError'


export default {
  name: 'form-address',
  props: ['form'],
  data () {
    return { 
      estados: estados
    }
  },
  components: { 
    'field-error' : FieldError
  }
};
</script>
