import { CPF, CNPJ } from 'cpf_cnpj'

export default {
  computed: {
    currentUser() {
      return this.$store.state.currentUser
    },
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
            if (f.value) {
              return { value: f.value }
            } else if (f.number) {
              return { number: Number(f.number), currency_code: 'BRL' }
            } else if (f.target_id) {
              return { target_id: f.target_id }
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
    }
  },
  filters: {
    cpf: function (value) {
      return CPF.format(value);
    },
    cnpj: function (value) {
      return CNPJ.format(value);
    }
  }
}
