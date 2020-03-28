 <template>
<div class="">
  <div class="card" :class="showForm ? '' : 'card-hidden'">
    <div class="row">
      <div class="col-sm-6">
        <div class="card-header card-header-rose text-center" @click="setView('login')" :class="{active: active_view == 'login'}">
          <h4 class="card-title">Entrar</h4>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="card-header card-header-rose text-center" @click="setView('register')" :class="{active: active_view == 'register'}">
          <h4 class="card-title">Cadastrar</h4>
        </div>
      </div>
    </div>
    <div v-if="active_view == 'login'">
      <form @submit.prevent="login" class="form-auth-small">
        <div class="card-body ">
          <br>
          <br>
          <p class="card-description text-center">Entre com suas credenciais para acessar o painel do produtor</p>
          <br>
          <span class="bmd-form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="material-icons">email</i>
                </span>
              </div>
              <input v-model="email" type="text" class="form-control" placeholder="Nome de usuário ou e-mail...">
            </div>
          </span>
          <span class="bmd-form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="material-icons">lock_outline</i>
                </span>
              </div>
              <input v-model="password" type="password" class="form-control" placeholder="Senha...">
            </div>
          </span>
        </div>
        <div class="card-footer justify-content-center">
          <button type="submit" class="btn btn-rose btn-link btn-lg">Continuar</button>
          <button v-if="isLoading" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Fazendo login...</button>
          <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        </div>
      </form>
    </div>
    <div v-if="active_view == 'register'">
      <div class="card-body" v-if="!form.address || !geolocation">
        <br>
        <br>
        <p class="card-description text-center">Cadastre-se e comece agora mesmo a publicar suas ofertas.</p>
        <br>
        <div>
          <div class="text-center" v-if="address">
            <div class="text-center" v-if="Array.isArray(address)">
              <h3>Algum desses é seu endereço?</h3>
              <table class="table md-auto">
                <tr v-for="(a, index) in address"  :key="index" class="table">
                  <td class="text-left">
                    <strong>{{displayAddress(a)}}</strong>
                  </td>
                  <td class="text-right">
                    <button @click="setAddressForm(a)" class="btn btn-success btn-sm">Selecionar</button>
                  </td>
                </tr>
              </table>
              <button @click="showAutoComplete()" class="btn btn-warning btn-lg">Nenhum desses é meu endereço</button>
            </div>
            <div class="text-center" v-else>
              <h3>Este é seu endereço?</h3>
              <h5>{{displayAddress(address)}}</h5>
              <button @click="setAddressForm(address)" class="btn btn-success btn-lg">Sim</button>
              <button @click="showAutoComplete()" class="btn btn-warning btn-lg">Não</button>
            </div>
          </div>
          <div v-else>
            <b-form-group label="Digite seu endereço para buscar a localização.">
              <b-form-input v-model="address_input" class="input-lg" />
              <small>Ex: rua das nascentes, alto paraíso, goiás</small>
              <a class="btn btn-sm pull-right" @click="getLocation()" >Usar GPS</a>
              <p class="text-center">
                <button v-if="address_input" @click="autocompleteAddress" class="btn btn-rose btn-lg">Buscar endereço</button>
              </p>
            </b-form-group>
          </div>
        </div>
      </div>
      <form @submit.prevent="register" class="form-auth-small" v-else>
        <div class="card-body">
          <div class="row">
            <div class="col-sm-12">
              <b-form-group label="Endereço *">
                {{form.address}}
                <a class="btn btn-sm pull-right" @click="showAutoComplete()" >Mudar endereço</a>
                <br>
                <br>
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="CPF/CNPJ *">
                <b-form-input v-model="form.cnpj" v-validate="'required'" name="cnpj" v-mask="['###.###.###-##', '##.###.###/####-##']" />
                <field-error :msg="veeErrors" field="cnpj" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Nome *">
                <b-form-input v-model="form.name" v-validate="'required'" name="name" />
                <field-error :msg="veeErrors" field="name" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Telefone / WhatsApp">
                <b-form-input v-model="form.phone" v-validate="'required'" name="phone" placeholder="(99) 99999-9999" v-mask="['(##) ####-####', '(##) #####-####']" />
                <field-error :msg="veeErrors" field="phone" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Email">
                <b-form-input v-model="form.email" v-validate="'email'" name="email" />
                <field-error :msg="veeErrors" field="email" />
                <div class="text-right" v-if="isEditing()">
                  <a class="pointer" @click="changePassword">Alterar senha</a>
                </div>
              </b-form-group>
            </div>
          </div>
          <div class="row gray">
            <div class="col-sm-6">
              <b-form-group label="Senha *">
                <b-form-input v-model="form.password" type="password" v-validate="'required'" name="pass" />
                <field-error :msg="veeErrors" field="pass" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Confirmar senha *">
                <b-form-input v-model="form.password_confirmation" type="password" v-validate="'required'" name="pass_confirmation" />
                <field-error :msg="veeErrors" field="pass_confirmation" />
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="card-footer justify-content-center">
          <button type="submit" class="btn btn-rose btn-lg">Continuar</button>
          <button v-if="isLoading" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Fazendo login...</button>
          <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
        </div>
      </form>
    </div>
  </div>
  <!-- <pre>{{form}}</pre> -->
</div>
</template>

<script>
import auth from '../auth'
import axios from 'axios'
import FieldError from '@/components/FieldError'
import Loading from '@/components/Loading'

export default {
  created() {
    if (this.$store.state.currentUser) {
      this.$router.replace('/painel')
    } else {
      this.getLocation();
      setTimeout(() => {
        this.showForm = true
      }, 500);
    }
  },
  data() {
    return {
      email: '',
      password: '',
      showForm: false,
      active_view: 'register',
      // address: '',
      address_input: '',
      address: '',
      geolocation: '',
      loading: false,
      form: {
        email: null,
        password: '',
        password_confirmation: '',
        name: '',
        cnpj: '',
        address: '',
        geolocation: null,
        phone: ''
      }
    }
  },
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.geolocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          axios.get("https://us1.locationiq.com/v1/reverse.php?key=81b80182fef784&lat=" + this.geolocation.latitude + "&lon=" + this.geolocation.longitude + "&accept-language=pt-BR&format=json").then(resp => {
            this.address = resp.data;
          }, ).catch(this.showError)
        }, this.locationError);
      } else {
        this.notify("Não foi possível pegar sua localização.", "warn");
      }
    },
    autocompleteAddress() {
      axios.get("https://us1.locationiq.com/v1/search.php?key=81b80182fef784&q=" + encodeURI(this.address_input) + "&addressdetails=1&limit=10&countrycodes=BR&accept-language=pt-BR&format=json").then(resp => {
        this.address = resp.data
        if (this.address.length == 1) {
          this.address = this.address[0]
        }
      }).catch(this.showError)
    },
    setAddressForm(address) {
      this.form.address = address.address
      this.form.address.display_name = displayAddress(address)
      this.form.geolocation = {
        latitude: address.lat,
        longitude: address.lon
      }
    },
    showAutoComplete() {
      this.address = null
      this.form.address = null
    },
    displayAddress(address) {
      return address.display_name
      .split(', ')
      .filter(name => (name.indexOf('Região ') < 0 && name.indexOf('Microrregião ') < 0 && name.indexOf('Mesorregião ') < 0 && name != "Brasil"))
      .join(', ')
    },

    login() {
      this.error = false
      this.isLoading = true
      auth.login(this.email, this.password, response => {
        if (response.authenticated) {
          const {
            _id: id,
            name,
            token
          } = response.currentUser;
          window.Dorothy.connectUser({
            id,
            name
          }, token);
          this.$router.replace(this.$route.query.redirect || '/painel')
        } else {
          this.error = response.error
        }
        this.isLoading = false
      })
    },
    register() {
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.isSending = true
          this.error = false

          axios({
            method: 'POST',
            url: '/register_producer',
            data: this.form
          }).then(resp => {
            var user = resp.data
            if (user && user._id) {
              auth.login(this.form.email, this.form.password, response => {
                if (response.authenticated) {
                  this.notify("Cadastro realizado com sucesso")
                  this.$router.replace(this.$route.query.redirect || '/painel')
                } else {
                  this.error = response.error
                }
                this.isLoading = false
              })
            }
            this.isSending = false
          }).catch(this.showError)
        }
      })
    },
    setView(view) {
      this.active_view = view
    },
    locationError() {
      this.notify("Não foi possível encontrar seu endereço automaticamente.", "warn")
    }
  },
  components: {
    FieldError,
    Loading
  }
};
</script>

<style lang="sass" scoped>
.error
  color: red
.card-header
  width: 100%
  cursor: pointer
  &:not(.active)
    background: gray !important
    box-shadow: none !important
.card
  box-shadow: none !important
</style>
