<template>
  <div class="form-bank-account">
    <div class="row" :class="{gray: gray}">
      <div class="col-md-3 col-sm-6">
        <b-form-group label="Banco">
          <b-form-select class="form-control" v-model="form.bank_account.bank_number" :options="bancos" />
        </b-form-group>
      </div>
      <div class="col-md-3 col-sm-6">
        <b-form-group label="Agência">
          <b-form-input v-model="form.bank_account.agency" />
        </b-form-group>
      </div>
      <div class="col-md-3 col-sm-6">
        <b-form-group label="Conta">
          <b-form-input v-model="form.bank_account.account" />
        </b-form-group>
      </div>
      <div class="col-md-3 col-sm-6">
        <b-form-group label="Tipo de conta">
          <b-form-radio-group v-model="form.bank_account.type" :options="tipos_de_conta" stacked >
          </b-form-radio-group>
        </b-form-group>
      </div>
    </div>
  </div>
</template>
<script>
import bancos from '@/data/bancos.json';
import tipos_de_conta from '@/data/tipos-de-conta.json';

export default {
  name: 'form-bank-account',
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
      bancos: bancos,
      tipos_de_conta: tipos_de_conta
    }
  }
};
</script>
