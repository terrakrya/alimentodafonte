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
      </div>
    </div>
  </div>
  <div class="col-md-9">
    <no-item :list="filtered_offers" />
    <table class="table table-shopping">
      <thead>
        <tr>
          <th colspan="2">Produto</th>
          <th>Valor</th>
          <th>Qtd</th>
          <th>Comprar</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr class="col-md-4" v-for="offer in filtered_offers">
          <td>
            <router-link :to="'/oferta/'+offer._id">
              <product-image :product="offer.product" />
            </router-link>
          </td>
          <td>
            <router-link :to="'/oferta/'+offer._id">
              <strong>{{offer.product.name}}</strong>
            </router-link>
          </td>
          <td>
            <div class="price-container">
              <span class="price">{{offer.final_price | moeda}}</span>
            </div>
          </td>
          <td>
          </td>
          <td>
            <div v-if="qtd[offer._id]">
              <input type="number" class="form-control qtd" v-model="qtd[offer._id]" :min="1" :max="offer.qtd - offer.qtd_ordered">
              <small>&nbsp; &nbsp; {{offer.qtd - offer.qtd_ordered}} disponíveis</small>
              <br>
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
        tags: []
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
        this.applyFilters()
      }).catch(this.showError)

      axios.get('shop/tags').then(response => {
        this.tags = response.data
      }).catch(this.showError)

    },
    applyFilters() {
      console.log('applyFilters');
      this.filtered_offers = this.offers
      if (this.filters.search) {
        this.filtered_offers = this.filtered_offers.filter(offer => {
          var name = slugify(offer.product.name).toLowerCase()
          var search = slugify(this.filters.search).toLowerCase()
          return name.search(search) >= 0
        })
      }

      if (this.filters.tags && this.filters.tags.length) {
        this.filters.tags.forEach(tag => {
          this.filtered_offers = this.filtered_offers.filter(offer => {
            return offer.product.tags.find(offer_tag => {
              return offer_tag.text == tag
            })
          })
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
