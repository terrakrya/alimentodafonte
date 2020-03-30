<template>
<div class="form-address">
  <div class="row">
    <div class="col-sm-6">
      <b-form-group label="Estado">
        <b-form-input class="form-control" v-model="form.address.uf" name="uf" />
      </b-form-group>
    </div>
    <div class="col-sm-6">
      <b-form-group label="Cidade">
        <b-form-input class="form-control" v-model="form.address.city" />
      </b-form-group>
    </div>
  </div>
  <div class="col-sm-12">
    <b-form-group label="Endereço/Rua/Av">
      <b-form-input v-model="form.address.street" name="street" />
      <field-error :msg="veeErrors" field="street" />
    </b-form-group>
  </div>
  <div class="col-sm-9">
    <b-form-group label="Bairro">
      <b-form-input v-model="form.address.neighborhood" name="neighborhood" />
      <field-error :msg="veeErrors" field="neighborhood" />
    </b-form-group>
  </div>
  <div class="col-sm-3">
    <b-form-group label="CEP">
      <b-form-input v-model="form.address.postal_code" v-mask="['#####-###']" />
    </b-form-group>
  </div>
  <div class="col-sm-12">
    <b-form-group label="Complemento">
      <b-form-input v-model="form.address.complement" name="complement" />
      <field-error :msg="veeErrors" field="complement" />
    </b-form-group>
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
  },
  inject: ['$validator'],
  data() {
    return {
      estados: estados,
      cidades: [{
        value: "",
        text: 'Selecione o estado'
      }],
    }
  },
  created() {
    this.loadCities()
  },
  methods: {
    loadCities() {
      this.cidades = [{
        value: "",
        text: 'Selecione a cidade'
      }].concat(Object(cidades)[this.form.address.uf])
      if (this.form.address.city && this.cidades) {
        if (!this.cidades.find(c => (c == this.form.address.city))) {
          this.form.address.city = ""
        }
      }
    }
  },
  components: {
    'field-error': FieldError
  }
};
</script>
