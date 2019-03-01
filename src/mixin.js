import { CPF, CNPJ } from 'cpf_cnpj'

export default {
  computed: {
    currentUser() {
      return this.$store.state.currentUser
    }
  },
  methods: {
    isEditing() {
      return !!this.$route.params.id
    },
    apiDataToForm(form, data) {
      Object.keys(form).map((key) => {
        var field = data[key]
        if (field && field.length) {
          form[key] = field.map((f) => {
            if (f.value || f.value === false) {
              return { value: f.value }
            } else if (f.number) {
              return { number: Number(f.number), currency_code: 'BRL' }
            } else if (f.target_id) {
              let target = { target_id: f.target_id }
              if (f.target_revision_id) {
                target.target_revision_id = f.target_revision_id
              }
              return target
            } else if (f.target_revision_id) {
              return { target_revision_id: f.target_revision_id }
            } else if (f.lat) {
              return { lat: f.lat, lng: f.lng }
            } else if (key == 'field_address') {
              return { address_line1: f.address_line1, locality: f.locality, administrative_area: f.administrative_area, postal_code: f.postal_code  }
            }

          })
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
