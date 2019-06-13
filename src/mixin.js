import { CPF, CNPJ } from 'cpf_cnpj'
import axios from 'axios'

export default {
  computed: {
    currentUser() {
      return this.$store.state.currentUser
    },
    baseUrl() {
      return axios.defaults.baseURL.replace('/api', '')
    }
  },
  methods: {
    isEditing() {
      return !!this.$route.params.id
    },
    apiDataToForm(form, data) {
      Object.keys(form).map((key) => {
        if (data && data[key]) {
          form[key] = data[key]
        }
      })
    },
    present (field, item = 'value') {
      return (field && field.length > 0 && field[0][item])
    },
    getList (type) {
      var list = this.$store.state[type]
      if (!list || !list.length) {
        this.loadList(type)
      }
      return list
    },
    loadList (type) {
      this.$store.dispatch('loadList', type)
    },
  },
  filters: {
    cpf: function (value) {
      return CPF.format(value);
    },
    cnpj: function (value) {
      return CNPJ.format(value);
    },
    data: function (value) {
      return value.toLocaleDateString('pt-BR');
    },
    address: function (address) {
      return address ? [
        address[0].address_line1,
        address[0].locality,
        address[0].administrative_area,
        address[0].postal_code
      ].filter(Boolean).join(' - ')
      : '';
    }
  }

}
