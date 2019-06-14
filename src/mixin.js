import { CPF, CNPJ } from 'cpf_cnpj'
import axios from 'axios'
import tipos_de_usuario from '@/data/tipos-de-usuario.json'

export default {
  data () {
		return {
			tipos_de_usuario: tipos_de_usuario
		}
	},
  computed: {
    currentUser() {
      return this.$store.state.currentUser
    },
    isAdmin() {
      var currentUser = this.$store.state.currentUser
      if (currentUser && currentUser.roles) {
        return currentUser.roles.includes('admin')
      }
      return false
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
    present (field, item) {
      if (item) {
        return !!field[item]
      } else {
        return !!field
      }
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
    }
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
        address.address,
        address.city,
        address.uf,
        address.postal_code
      ].filter(Boolean).join(' - ')
      : '';
    },
    roles: function (roles) {
			return roles.map(r => tipos_de_usuario.find(e => e.value == r)).filter(n => n).map(v => v.text).join(', ')
		}
  }

}
