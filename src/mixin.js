import Vue from 'vue'
import axios from 'axios'
import queries from '@/store/queries'
import tipos_de_usuario from '@/data/tipos-de-usuario.json'
import auth from '@/auth'
import * as cpf from "@fnando/cpf"
import * as cnpj from "@fnando/cnpj"
import emissores_da_nota from '@/data/emissores-da-nota.json';

export default {
  data() {
    return {
      emissores_da_nota: emissores_da_nota,
      error: false,
      isLoading: false,
      isSending: false,
      tipos_de_usuario: tipos_de_usuario,
      date_unit: {
        'Dias': 'days',
        'Meses': 'months',
        'Anos': 'years'
      }
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser
    },
    currentRole() {
      if (this.isAdmin) {
        return tipos_de_usuario.find(e => e.value == 'admin')
      } else if (this.isManager) {
        return tipos_de_usuario.find(e => e.value == 'manager')
      }
      return { "text": "Usuário", "value": "user" }
    },
    isAdmin() {
      return this.isA('admin')
    },
    isManager() {
      return this.isA('manager') || this.isA('link') || this.isA('admin')
    },
    isLink() {
      return this.isA('link') || this.isA('admin')
    },
    baseUrl() {
      return axios.defaults.baseURL.replace('/api', '')
    }
  },
  methods: {
    isA(role) {
      var currentUser = this.$store.state.currentUser
      if (currentUser && currentUser.roles) {
        return currentUser.roles.includes(role)
      }
      return false
    },
    isEditing() {
      return !!this.$route.params.id
    },
    apiDataToForm(form, data) {
      Object.keys(form).map((key) => {
        if (data && data[key]) {
          if (typeof data[key] == 'string' && data[key].indexOf('T00:00:00.000Z') > -1 && key != 'date_time') {
            form[key] = data[key].replace(/T00:00:00.000Z/g, '')
          } else {
            form[key] = data[key]
          }
        }
      })
    },
    async loadList(type) {
      return await queries.loadList(type).catch(this.showError)
    },
    showError(error) {
      console.log(error);
      if (error.response) {
        console.log('herre');
        if (error.response.data) {
          if (error.response.status == 401 && error.response.data.indexOf('invalid signature') > -1) {
            this.notify('Sessão expirada!', 'error')
            auth.logout(function() {
              this.$router.replace('/')
            })
          } else if (error.response.data.message) {
            this.notify(error.response.data.message, 'error')
          } else {
            this.notify(error.response.data, 'error')
          }
        } else {
          this.notify(error.response, 'error')
        }
      } else {
        this.notify(error, 'error')
      }
      this.isLoading = false
      this.isSending = false
    },
    notify(msg, type = "success") {
      Vue.notify({
        group: 'a',
        text: msg,
        type: type
      });
    },
    formatCity(address) {
      return address ? [
          address.city,
          address.uf,
        ].filter(Boolean).join(' - ') :
        '';
    },
    defaultThumb(images) {
      if (images && images.length) {
        return this.baseUrl + (images.find(image => image.default) || images[0]).thumb
      } else {
        return this.baseUrl + 'images/image_placeholder.jpg'
      }
    },
    invoiceIssuer(issuer) {
      var invoice_issuer = null
      if (issuer) {
        invoice_issuer = this.emissores_da_nota.find(e => issuer == e.value)
      }
      if (invoice_issuer) {
        return invoice_issuer.text
      }
    },
  },
  filters: {
    cpf: function(value) {
      return cpf.format(value);
    },
    cnpj: function(value) {
      return cnpj.format(value);
    },
    data: function(value) {
      return new Date(value).toLocaleDateString('pt-BR');
    },
    address: function(address) {
      return address ? [
          address.address,
          address.city,
          address.uf,
          address.postal_code
        ].filter(Boolean).join(' - ') :
        '';
    },
    city: function(address) {
      return address ? [
          address.city,
          address.uf,
        ].filter(Boolean).join(' - ') :
        '';
    },
    filename: function(fileUrl) {
      if (fileUrl) {
        let urlArr = fileUrl.split('/')
        return urlArr[urlArr.length - 1]
      }
      return ''
    },
    roles: function(roles) {
      return roles.map(r => tipos_de_usuario.find(e => e.value == r)).filter(n => n).map(v => v.text).join(', ')
    },
    firstname: function(fullName) {
      return fullName ? fullName.split(' ')[0] : ''
    }
  }

}
