<template>
  <div class="list-group entity-select-preview" v-if="bank_account.agency && bank_account.account">
    <div class="list-group-item active">
      <strong>Dados bancários</strong>
    </div>
    <div class="list-group-item">
      <dl v-if="bank_account.bank_number">
        <dt>Banco</dt>
        <dd>{{ bancos.find((banco) => banco.value == bank_account.bank_number ).text }}</dd>
      </dl>
      <dl v-if="bank_account.agency">
        <dt>Agência</dt>
        <dd>{{ bank_account.agency }}</dd>
      </dl>
      <dl v-if="bank_account.account">
        <dt>Conta {{ accountType }}</dt>
        <dd>{{ bank_account.account }}</dd>
      </dl>
    </div>
  </div>
</template>
<script>
import bancos from '@/data/bancos.json';
import tipos_de_conta from '@/data/tipos-de-conta.json';

export default {
  name: 'bank-account',
  props: {
    bank_account: Object
  },
  data () {
    return {
      bancos: bancos,
      tipos_de_conta: tipos_de_conta
    }
  },
  computed: {
		accountType () {
			if (this.bank_account.type) {
				return tipos_de_conta.find(tipo_de_conta => {
					return tipo_de_conta.value == this.bank_account.type
				}).text
			}
			return ''
		}
	},
};
</script>
