<template>
<div class="row">
  <div class="col-md-3">
    <div class="card card-refine card-plain card-rose">
      <div class="card-body">
        <input type="search" v-model="filters.search" placeholder="Buscar" class="form-control">
        <br>
        <div class="form-check" v-for="tag in tags">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox" :value="tag" v-model="filters.tags">
            {{tag}}
            <span class="form-check-sign">
              <span class="check"></span>
            </span>
          </label>
        </div>
        <div class="producers" v-if="producers && producers.length">
          <br>
          <hr>
          <h5>Produtores</h5>
          <div class="form-check" v-for="producer in producers">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" :value="producer._id" v-model="filters.producer">
              {{producer.name}}
              <span class="form-check-sign">
                <span class="check"></span>
              </span>
            </label>
          </div>
          <a v-if="filters.producer" @click="filters.producer = null"><small>Limpar filtro</small></a>
        </div>
      </div>
      <div class="radius">
        <br>
        <hr>
        <h5>Distância da busca</h5>
        <b-form-input v-model="filters.radius" type="range" min="10" max="10000"></b-form-input>
      </div>
      <pre>{{filters}}</pre>
    </div>
  </div>
  <div class="col-md-9">
    <br>
    <no-item :list="filtered_offers" />
    <h5>
      <b>{{filtered_offers.length}}</b> {{filtered_offers.length == 1 ? 'oferta encontrada' : 'ofertas encontradas'}}
      em um raio de <b>{{filters.radius}}</b> km
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
        <tr class="col-md-4" v-for="offer in filtered_offers">
          <td>
            <router-link :to="'/oferta/'+offer._id">
              <product-image :product="offer.product || offer" />
            </router-link>
          </td>
          <td class="td-name">
            <router-link :to="'/oferta/'+offer._id">
              <strong>{{offer.name || offer.product.name}}</strong>
            </router-link>
            <small v-if="offer.producer"><br />{{offer.producer.name}}</small>
          </td>
          <td>
            <div class="price-container">
              <span class="price">{{offer.final_price | moeda}}</span>
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
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'
import ProductImage from '@/components/ProductImage'
import slugify from 'slugify'

export default {

  name: 'Shop',

  data() {
    return {
      filters: {
        tags: [],
        radius: 50,
        producer: null
      },
      offers: null,
      filtered_offers: null,
      tags: [],
      qtd: {}
    }
  },

  created() {
    this.list()
  },

  methods: {
    async list() {
      axios.get('shop/offers', {
        params: {
          populate: 'product producer organization'
        }
      }).then(response => {
        this.offers = response.data
        var producers = {}
        this.offers.forEach(offer => {
          producers[offer.producer._id] = offer.producer
        })
        this.producers = Object.values(producers)
        this.applyFilters()
      }).catch(this.showError)

      axios.get('shop/tags').then(response => {
        this.tags = response.data
      }).catch(this.showError)

    },
    applyFilters() {
      this.filtered_offers = this.offers
      if (this.filters.search) {
        this.filtered_offers = this.filtered_offers.filter(offer => {
          var name = slugify(offer.name || offer.product.name).toLowerCase()
          var search = slugify(this.filters.search).toLowerCase()
          return name.search(search) >= 0
        })
      }

      if (this.filters.tags && this.filters.tags.length) {
        this.filters.tags.forEach(tag => {
          this.filtered_offers = this.filtered_offers.filter(offer => {
            if (offer.product) {
              return offer.product.tags.find(offer_tag => {
                return offer_tag.text == tag
              })
            } else {
              return offer.basket.find(item => {
                return item.product.tags.find(offer_tag => {
                  return offer_tag.text == tag
                })
              })
            }
          })
        })
      }

      if (this.filters.producer) {
        this.filtered_offers = this.filtered_offers.filter(offer => {
          return offer.producer._id == this.filters.producer
        })
      }
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
      this.notify(offer.product.name + " adicionado ao carrinho")
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
    ProductImage
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
