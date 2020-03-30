<template>
<div class="location">
  <b-button v-if="current_address" @click="show_modal = !show_modal" class="btn btn-default btn-sm">Mudar endereço</b-button>
  <b-button v-else @click="show_modal = !show_modal" class="btn btn-default">Configurar endereço</b-button>
  <b-modal v-model="show_modal" title="Localização" hide-footer hide-header>
    <div v-if="!form">
      <div v-if="!address">
        <b-form-group label="Digite seu endereço para buscar a localização.">
          <b-form-input v-model="address_input" class="input-lg" v-on:keyup.enter="searchByAddress" />
          <small>Ex: rua das nascentes, alto paraíso, goiás</small>
          <a class="btn btn-sm pull-right" @click="getLocation()">Usar GPS</a>
          <div class="clearfix"></div>
          <p class="text-center">
            <button v-if="address_input" @click="searchByAddress" class="btn btn-rose btn-lg">Buscar endereço</button>
          </p>
          <p class="text-center" v-if="loading_gps">
            <small><i class="fa fa-spinner fa-spin"></i> Buscando dados do GPS...</small>
          </p>
        </b-form-group>
      </div>
      <div class="text-center" v-else>
        <div class="text-center" v-if="Array.isArray(address)">
          <h3>Algum desses é seu endereço?</h3>
          <table class="table md-auto">
            <tr v-for="(a, index) in address" :key="index" class="table">
              <td class="text-left">
                <strong>{{a.description}}</strong>
              </td>
              <td class="text-right">
                {{a}}
                <button @click="setAddressForm(a)" class="btn btn-success btn-sm">Selecionar</button>
              </td>
            </tr>
          </table>
          <button @click="showAutoComplete()" class="btn btn-warning btn-lg">Nenhum desses é meu endereço</button>
        </div>
        <div class="text-center" v-else>
          <h3>Este é seu endereço?</h3>
          <h5>{{address.description}}</h5>
          <div v-if="address && address.location">
            <l-map :zoom="16" :center="address.location.coordinates" style="height: 250px">
              <l-tile-layer :url="url" :attribution="attribution" />
              <l-marker :lat-lng="address.location.coordinates" @dragend="updateMarker" draggable>
                <l-tooltip>Clique e arraste para refinar sua localização.</l-tooltip>
              </l-marker>
            </l-map>
            <p>
              <small>Coordenadas: {{address.location.coordinates.join(',')}}</small>
            </p>
          </div>
          <button @click="setAddressForm(address)" class="btn btn-success btn-lg">Sim</button>
          <button @click="showAutoComplete()" class="btn btn-warning btn-lg">Não</button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="form-address">
        <h5 class="text-center">Complete os dados e confirme o endereço</h5>
        <div class="row">
          <div class="col-sm-6">
            <b-form-group label="Estado">
              <b-form-input class="form-control" v-model="form.uf" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="Cidade">
              <b-form-input class="form-control" v-model="form.city" />
            </b-form-group>
          </div>
          <div class="col-sm-12">
            <b-form-group label="Endereço/Rua/Av">
              <b-form-input v-model="form.street" name="street" />
            </b-form-group>
          </div>
          <div class="col-sm-9">
            <b-form-group label="Bairro">
              <b-form-input v-model="form.neighborhood" name="neighborhood" />
            </b-form-group>
          </div>
          <div class="col-sm-3">
            <b-form-group label="CEP">
              <b-form-input v-model="form.postal_code" v-mask="['#####-###']" />
            </b-form-group>
          </div>
          <div class="col-sm-12">
            <b-form-group label="Complemento">
              <b-form-input v-model="form.complement" name="complement" />
            </b-form-group>
          </div>
        </div>
      </div>
      <button @click="confirmAddress()" class="btn btn-success btn-lg">Confirmar endereço</button>
      <button @click="showAutoComplete()" class="btn btn-warning btn-lg">Mudar localização</button>
    </div>
  </b-modal>
</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import FormAddress from '@/components/FormAddress'

import {
  latLng
} from "leaflet";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip
} from "vue2-leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: 'location',
  props: {
    current_address: null,
    cb: null,
  },
  data() {
    return {
      loading_gps: false,
      show_modal: false,
      address: null,
      location: null,
      address_input: '',
      form: null,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  created() {
    if (!this.current_address) {
      this.show_modal = true
      this.getLocation()
    } else {
      this.address = this.current_address
      this.form = this.current_address
    }
  },
  computed: {
		geolocation () {
			if (this.address && this.address.location) {
        return latLng(this.address.location.coordinates[0], this.address.location.coordinates[1])
      }
		}
	},
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        this.loading_gps = true
        navigator.geolocation.getCurrentPosition(position => {
          this.searchByLocation(position.coords.latitude, position.coords.longitude)
        }, this.locationError);
      } else {
        this.locationError()
      }
    },
    searchByLocation(latitude, longitude) {
      axios.get("https://us1.locationiq.com/v1/reverse.php?key=81b80182fef784&lat=" + latitude + "&lon=" + longitude + "&accept-language=pt-BR&normalizecity=1&format=json").then(resp => {
        this.address = this.parseAddress(resp.data.address, latitude, longitude)
        this.loading_gps = false
      }).catch(this.locationError)
    },
    searchByAddress() {
      axios.get("https://us1.locationiq.com/v1/search.php?key=81b80182fef784&q=" + encodeURI(this.address_input) + "&addressdetails=1&limit=10&countrycodes=BR&accept-language=pt-BR&normalizecity=1&format=json").then(resp => {
        var data = resp.data
        if (data.length == 1) {
          var address = data[0]
          this.address = this.parseAddress(address.address, address.lat, address.lon)
        } else {
          this.address = data.map(address => {
            return this.parseAddress(address.address, address.lat, address.lon)
          })
        }

      }).catch(this.showError)
    },
    updateMarker(location) {
      location = location.target._latlng
      this.searchByLocation(location.lat, location.lng)
    },
    parseAddress(address, latitude, longitude) {
      var a = {}
      a.street = address.road
      a.neighborhood = address.neighbourhood || address.hamlet || address.suburb
      a.city = address.city || address.city_district || address.village || address.town
      a.uf = address.state || address.state_district
      a.postal_code = address.postcode

      a.description = [a.street, a.neighborhood, a.city, a.uf, a.postal_code].filter(i => i).join(', ')

      a.location = {
        type: "Point",
        coordinates: [latitude, longitude]
      }

      // a.source = address
      return a
    },
    setAddressForm(address) {
      this.address = address
      this.form = this.address
    },
    confirmAddress() {
      if (this.cb) {
        this.form.description = [
          this.form.street,
          this.form.complement,
          this.form.neighborhood,
          this.form.city,
          this.form.uf,
          this.form.postal_code
        ].filter(i => i).join(', ')

        this.cb(this.form)

        this.show_modal = false
      }
    },
    showAutoComplete() {
      this.address = null
      this.form = null
    },
    locationError(e) {
      console.log(e);
      this.notify("Não foi possível encontrar seu endereço automaticamente.", "warn")
      this.loading_gps = false
    }
  },
  components: {
    Loading,
    FormAddress,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip
  }
};
</script>
