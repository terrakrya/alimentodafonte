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
      <div class="row">
        <div class="col-md-4" v-for="offer in filtered_offers">
          <div class="card card-product card-plain no-shadow" data-colored-shadow="false">
            <div class="card-header card-header-image">
              <router-link :to="'/oferta/'+offer._id">
                <product-image :product="offer.product" :product_variation="offer.product_variation" />
              </router-link>
            </div>
            <div class="card-body">
              <router-link :to="'/oferta/'+offer._id">
                <h4 class="card-title">{{offer.product_variation.name}}</h4>
              </router-link>
              <p class="description">
                {{offer.product_variation.description}}
              </p>
            </div>
            <div class="card-footer justify-content-between">
              <div class="price-container">
                <span class="price">{{offer.final_price | moeda}}</span>
              </div>
            </div>
          </div>
          <!-- end card -->
        </div>
      </div>
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
      tags: []
    }
  },

  created() {
    this.list()
  },

  methods: {
    async list() {
      axios.get('shop/offers', {
        params: {
          populate: 'product_variation supplier organization'
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
          var name = slugify(offer.product_variation.name).toLowerCase()
          var search = slugify(this.filters.search).toLowerCase()
          return name.search(search) >= 0
        })
      }

      if (this.filters.tags && this.filters.tags.length) {
        this.filters.tags.forEach(tag => {
          this.filtered_offers = this.filtered_offers.filter(offer => {
            return offer.product_variation.tags.find(offer_tag => {
              console.log('offer_tag.text');
              console.log(offer_tag.text);
              console.log('tag');
              console.log(tag);
              return offer_tag.text == tag
            })
          })
        })
      }

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
