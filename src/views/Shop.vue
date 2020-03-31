<template>
<div class="row">
  <div class="col-md-3">
    <div class="card card-refine card-plain card-rose">
      <div class="card-body">
        <div>
          <br>
          <input type="search" v-model="filters.search" placeholder="Buscar" class="form-control">
          <br>
        </div>
        <div>
          <div class="form-check" v-for="tag in tags">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox" :value="tag" v-model="filters.tags">
              {{tag}}
              <span class="form-check-sign">
                <span class="check"></span>
              </span>
            </label>
          </div>
        </div>
        <div class="producers" v-if="producers && producers.length">
          <br>
          <hr>
          <h5>Produtores</h5>
          <div class="form-check" v-for="(producer, index) in producers" :key="index">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" :value="producer._id" v-model="filters.producer">
              {{producer.nickname || producer.name}}
              <span class="form-check-sign">
                <span class="check"></span>
              </span>
            </label>
          </div>
          <div class="form-check" v-if="filters.producer">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" :value="null" v-model="filters.producer">
              Todos os produtores
              <span class="form-check-sign">
                <span class="check"></span>
              </span>
            </label>
          </div>
        </div>
      </div>
      <div class="distance">
        <hr>
        <h5>Distância da busca</h5>
        <b-form-input class="form-control" v-model="filters.distance" type="range" min="0" max="1000" @change="applyFilters()"></b-form-input>
        <div class="text-right">
          <small>{{filters.distance}} kilometros</small>
        </div>
      </div>
      <div class="city-state">
        <br>
        <b-form-group label="Filtrar por estado">
          <b-form-select class="form-control" v-model="filters.uf" :options="estadosOptions" @input="loadCities()" />
        </b-form-group>
        <b-form-group label="Filtrar por cidade" v-if="filters.uf">
          <b-form-select class="form-control" v-model="filters.city" :options="cidades" @input="applyFilters()" />
        </b-form-group>
      </div>
      <div class="current-location">
        <br>
        <div v-if="currentLocation">
          <span>
            Sua localização:
          </span>
          <small>
            <br>
            {{currentLocation.description}}
          </small>
        </div>
        <location :cb="setCurrentLocation" :current_address="currentLocation" autoload="!currentLocation" />
      </div>
    </div>
  </div>
  <div class="col-md-9">
    <br>
    <no-item :list="offers" />
    <h5 v-if="offers">
      {{offers.length == 1 ? 'Foi encontrada' : 'Foram encontradas'}} <b>{{offers.length}}</b> {{offers.length == 1 ? 'oferta' : 'ofertas'}}
      <span v-if="filters.uf || filters.city">
        em <b>{{[filters.city, filters.uf].filter(i => i).join(", ")}}</b>
      </span>
      <span v-else>
        <span v-if="currentLocation">em um raio de <b>{{filters.distance}}</b> kilometros</span>
      </span>
    </h5>
    <table class="table table-shopping">
      <thead>
        <tr>
          <th colspan="2" class="text-center">Produto</th>
          <th>Valor</th>
          <th>Comprar</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr class="col-md-4" v-for="offer in offers">
          <td>
            <router-link :to="'/oferta/'+offer._id">
              <product-image v-if="offer.product" :product="offer.product" />
              <product-image v-else :product="offer" />
            </router-link>
          </td>
          <td class="td-name">
            <router-link :to="'/oferta/'+offer._id">
              <strong v-if="offer.product">{{offer.product.name}}</strong>
              <strong v-else>{{offer.name}}</strong>
            </router-link>
            <small v-if="offer.producer"><br />{{offer.producer.nickname || offer.producer.name}}</small>
          </td>
          <td>
            <div class="price-container">
              <span class="price">{{offer.final_price | moeda}}</span>
              <div v-if="offer.product">
                <small>por {{offer.product.unit}}</small>
              </div>
            </div>
          </td>
          <td>
            <div v-if="qtd[offer._id]">
              <input type="number" class="form-control qtd" v-model="qtd[offer._id]" :min="1" :max="offer.qtd - offer.qtd_ordered">
              <small>&nbsp; &nbsp; {{offer.qtd - offer.qtd_ordered}} disponíveis</small>
              <br>
              <!-- <b-form-group label="Cidade">
                <b-form-select class="form-control" v-model="form." :options="cidades" />
              </b-form-group> -->
              <button class="btn btn-rose btn-round btn-sm" @click="addToCart(offer)">Adicionar ao carrinho &#xA0;<i class="material-icons">shopping_cart</i></button>
            </div>
            <button v-else class="btn btn-rose btn-round btn-sm" @click="buy(offer)">Comprar &#xA0;<i class="material-icons">shopping_cart</i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import slugify from 'slugify'
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'
import ProductImage from '@/components/ProductImage'
import Location from '@/components/Location'
import estados from '@/data/estados.json';
import cidades from '@/data/cidades.json';

export default {

  name: 'Shop',

  data() {
    return {
      estados: estados,
      cidades: [{
        value: "",
        text: 'Selecione o estado'
      }],
      filters: {
        tags: [],
        distance: 50,
        producer: null,
        uf: "",
        city: "",
        coordinates: null
      },
      offers: null,
      tags: [],
      producers: null,
      qtd: {}
    }
  },

  computed: {
    currentLocation() {
      return this.$store.state.location
    },
    estadosOptions() {
      return estados.map(estado => {
        if (estado.text == "Selecione o estado") {
          return { value: "", text: "Selecione o estado" }
        } else {
          return { value: estado.text, text: estado.text }
        }
      })
    }
  },

  created() {
    this.list()

    axios.get('shop/tags', {
      params: {
        filters: this.filters
      }
    }).then(response => {
      this.tags = response.data
    }).catch(this.showError)

    axios.get('shop/producers', {
      params: {
        filters: this.filters
      }
    }).then(response => {
      this.producers = response.data
    }).catch(this.showError)

  },

  methods: {
    async list() {
      if (this.currentLocation) {
        this.filters.coordinates = this.currentLocation.location.coordinates
      }
      axios.get('shop/offers', {
        params: {
          populate: 'product producer organization',
          filters: this.filters
        }
      }).then(response => {
        this.offers = response.data

        var producers = {}
        this.offers.forEach(offer => {
          producers[offer.producer._id] = offer.producer
        })
        this.producers = Object.values(producers)

      }).catch(this.showError)

    },
    applyFilters() {
      this.list()
    },
    buy(offer) {
      this.qtd = {}
      this.qtd[offer._id] = 1
    },
    addToCart(offer) {
      this.$store.dispatch('addToCart', {
        offer: offer,
        qtd: this.qtd[offer._id]
      })
      this.qtd = {}
      this.notify((offer.name || offer.product.name) + " adicionado ao carrinho")
    },
    loadCities() {
      this.cidades = [{
        value: "",
        text: 'Selecione a cidade'
      }].concat(Object(cidades)[estados.find(estado => estado.text == this.filters.uf).value])
      this.applyFilters()
      if (this.filters.city && this.cidades) {
        if (!this.cidades.find(c => (c == this.filters.city))) {
          this.filters.city = ""
        }
      }
    },
    setCurrentLocation(location) {
      this.$store.dispatch('setLocation', location)
      console.log(this.$store.state.location);
      this.applyFilters()
    }

  },
  watch: {
    'filters.search': function() {
      this.applyFilters()
    },
    'filters.tags': function() {
      this.applyFilters()
    },
    'filters.producer': function() {
      this.applyFilters()
    }
  },
  components: {
    Loading,
    NoItem,
    ProductImage,
    Location
  }
};
</script>
  <style lang="sass">
    .table-shopping
      .qtd
        max-width: 40px
        font-size: 20px
        display: inline-block
      .img-container
        max-width: 100%
        margin: 0
  </style>
