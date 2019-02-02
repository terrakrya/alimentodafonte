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
            }

          })
        }
      })
    }   
  }
}
