<template>
<div class="" v-if="offer">
  <div class="row">
    <div class="col-md-5 col-sm-5">
      <b-carousel id="carousel-fade" style="text-shadow: 0px 0px 2px #000" fade indicators img-width="1024" img-height="480" v-model="slide">
        <b-carousel-slide v-for="(image, index) in offer.product.images" :img-src="baseUrl+image.url"></b-carousel-slide>
      </b-carousel>
      <div class="offer_thumbs row" v-if="offer.product.images && offer.product.images.length > 1">
        <div class="col-sm-3" v-for="(image, index) in offer.product.images" :key="index">
          <a @click="setSlide(index)"><img class="thumbnail" :src="baseUrl+image.url" :class="{active: (slide == index)}"></a>
        </div>
      </div>
    </div>
    <div class="col-md-7 col-sm-7">
      <h2 class="title"> {{offer.product.name}} </h2>
      <tags :tags="offer.product.tags" />
      <h3 class="main-price">{{offer.final_price | moeda}}</h3>
      <div>
        <p class="pre-line">{{offer.product.description}}</p>
        <div class="card card-collapse">
          <div class="card-header">
            <h5 class="mb-0">
              Entrega
            </h5>
          </div>
          <div>
            <div class="card-body">
              <table class="product-info">
                <tbody>
                  <tr v-if="offer.source_of_shipment">
                    <td>Origem do envio:</td>
                    <th class="text-right">{{offer.source_of_shipment.description}}</th>
                  </tr>
                  <tr v-if="offer.shipping_types && offer.shipping_types.length > 0">
                    <td>Tipos de entrega:</td>
                    <th class="text-right">
                      <a v-for="(shipping_type, index) in offer.shipping_types" :key="index"> <span class="badge badge-default" > {{tipos_de_entrega.find(type => type.value == shipping_type ).text}} </span> &nbsp;</a>
                    </th>
                  </tr>
                  <tr v-if="offer.manufacturing_date">
                    <td>
                      Data de fabricação:
                    </td>
                    <th class="text-right">
                      <div v-if="offer.manufacturing_date">
                        {{offer.manufacturing_date | moment("DD/MM/YYYY")}}
                      </div>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="card card-collapse" v-if="offer.producer">
          <div class="card-header">
            <h5 class="mb-0">
              Produtor
            </h5>
          </div>
          <div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3">
                  <img class="img-thumbnail" :src="defaultThumb(offer.producer.images)" :alt="offer.producer.nickname || offer.producer.name">
                </div>
                <div class="col-md-9">
                  <h5><strong>{{offer.producer.nickname || offer.producer.name}}</strong></h5>
                  <p v-if="offer.producer.nickname"><small>{{offer.producer.name}}</small></p>
                  <p>{{offer.producer.history}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card card-collapse" v-if="offer.organization">
          <div class="card-header">
            <h5 class="mb-0">
              Rede responsável
            </h5>
          </div>
          <div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3">
                  <img class="img-thumbnail" :src="defaultThumb(offer.organization.images)" :alt="offer.organization.name">
                </div>
                <div class="col-md-9">
                  <h5><strong>{{offer.organization.name}}</strong></h5>
                  <p>{{offer.organization.history}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="add_to_cart text-right">
        <input type="number" class="form-control" v-model="qtd" :max="offer.qtd - offer.qtd_ordered">
        <button class="btn btn-rose btn-round" @click="addToCart">Adicionar ao carrinho &#xA0;<i class="material-icons">shopping_cart</i></button>
        <small><br>{{offer.qtd - offer.qtd_ordered}} disponíveis</small>
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
import Tags from '@/components/Tags'
import tipos_de_entrega from '@/data/tipos-de-entrega.json'

export default {

  name: 'Offer',

  data() {
    return {
      tipos_de_entrega: tipos_de_entrega,
      offer: null,
      slide: 0,
      qtd: 1
    }
  },

  created() {
    axios.get('shop/offer/' + this.$route.params.id, {
      params: {
        populate: 'product producer organization orders'
      }
    }).then(response => {
      this.offer = response.data
    }).catch(this.showError)
  },

  methods: {
    setSlide(slide) {
      this.slide = slide
    },
    addToCart() {
      this.$store.dispatch('addToCart', {offer: this.offer, qtd: this.qtd})
      this.notify(this.offer.product.name +" adicionado ao carrinho")
    }
  },
  components: {
    Loading,
    NoItem,
    ProductImage,
    Tags
  }
};
</script>
