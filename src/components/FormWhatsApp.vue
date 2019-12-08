<template>
<div class="form-phones">
  <div class="row" v-for="(link, index) in form[field]" :key="index">
    <div class="col-md-3">
      <b-form-group v-if="index == 0">
        WhatsApp:
      </b-form-group>
    </div>
    <div class="col-md-9">
      <b-form-group>
        <b-form-input v-model="form[field][index]" type="text" placeholder="(99) 99999-9999" v-mask="['(##) ####-####', '(##) #####-####']" />
      </b-form-group>
    </div>
  </div>
  <a class="btn btn-default btn-sm pull-right" @click="addLink">Adicionar número</a>
  <div class="clearfix"></div>
</div>
</template>

<script>
export default {

  name: 'WhatsApp',
  props: ['form', 'field'],
  data() {
    return {
      phones: [""]
    }
  },
  created() {
    if (!this.form[this.field] || !this.form[this.field].length) {
      this.form[this.field] = this.phones
    }
  },
  methods: {
    addLink() {
      this.form[this.field].push("")
    }
  }
};
</script>
