<template>
<div class="form-contact-persons">
  <b-form-group>
    Contatos:
  </b-form-group>
  <div class="row" v-for="(link, index) in form[field]" :key="index">
    <div class="col-md-2 col-sm-6">
      <b-form-group>
        <b-form-input v-model="form[field][index].position" type="text" placeholder="Cargo" />
      </b-form-group>
    </div>
    <div class="col-md-4 col-sm-6">
      <b-form-group>
        <b-form-input v-model="form[field][index].name" type="text" placeholder="Nome" />
      </b-form-group>
    </div>
    <div class="col-md-3 col-sm-6">
      <b-form-group>
        <b-form-input v-model="form[field][index].phone" type="text" placeholder="Telefone" v-mask="['(##) ####-####', '(##) #####-####']"/>
      </b-form-group>
    </div>
    <div class="col-md-3 col-sm-6">
      <b-form-group>
        <b-form-input v-model="form[field][index].email" type="text" placeholder="Email" />
      </b-form-group>
    </div>
  </div>
  <a class="btn btn-default btn-sm pull-right" @click="addLink">Adicionar contato</a>
  <div class="clearfix"></div>
</div>
</template>

<script>

export default {

  name: 'form-contact-persons',
  props: ['form', 'field'],
  data() {
    return {
      contact_persons: [{
        name: "",
        position: "",
        email: "",
        phone: "",
      }]
    }
  },
  created() {
    if (!this.form[this.field] || !this.form[this.field].length) {
      this.form[this.field] = this.contact_persons

    }
  },
  methods: {
    addLink() {
      this.form[this.field].push({
        label: "",
        value: ""
      })
    }
  }
};
</script>

<style lang="sass">
.brand h1
  margin-top: 10px
  font-size: 31px
  a
  color: #fff
  span
  font-weight: 300
  strong
  font-weight: 900
  </style>
