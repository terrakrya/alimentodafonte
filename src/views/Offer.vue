<template>
<div class="" v-if="offer">
  <div class="row">
    <div class="col-md-5 col-sm-5">
      <b-carousel id="carousel-fade" style="text-shadow: 0px 0px 2px #000" fade indicators img-width="1024" img-height="480" v-model="slide">
        <b-carousel-slide v-for="(image, index) in offer.product_variation.images" :img-src="baseUrl+image.url"></b-carousel-slide>
      </b-carousel>
      <div class="offer_thumbs row">
        <div class="col-sm-3" v-for="(image, index) in offer.product_variation.images" :key="index">
          <a @click="setSlide(index)"><img class="thumbnail" :src="baseUrl+image.url" :class="{active: (slide == index)}"></a>
        </div>
      </div>
    </div>
    <div class="col-md-7 col-sm-7">
      <h2 class="title"> {{offer.product_variation.name}} </h2>
      <tags :tags="offer.product_variation.tags" />
      <h3 class="main-price">{{offer.final_price | moeda}}</h3>
      <div>
        <p class="pre-line">{{offer.product_variation.description}}</p>
        <div class="card card-collapse">
          <div class="card-header">
            <h5 class="mb-0">
              Envio e estocagem
            </h5>
          </div>
          <div>
            <div class="card-body">
              <table class="product-info">
                <tbody>
                  <tr v-if="offer.invoice_issuer">
                    <td>Emissor da nota fiscal:</td>
                    <th class="text-right">{{invoiceIssuer(offer.invoice_issuer)}}</th>
                  </tr>
                  <tr v-if="offer.source_of_shipment">
                    <td>Origem do envio:</td>
                    <th class="text-right">{{offer.source_of_shipment}}</th>
                  </tr>
                  <tr v-if="offer.product_variation.bar_code">
                    <td>
                      Data de fabricação:
                    </td>
                    <th class="text-right">
                      <div v-if="offer.manufacturing_date">
                        {{offer.manufacturing_date | moment("DD/MM/YYYY")}}
                      </div>
                      <div v-if="offer.product_variation && offer.product_variation.duration && offer.product_variation.duration.value && offer.manufacturing_date">
                        <small>Vence {{offer.manufacturing_date | moment("add", offer.product_variation.duration.value + ' ' + date_unit[offer.product_variation.duration.unit]) | moment('from', 'now')}}</small>
                      </div>
                    </th>
                  </tr>
                  <tr v-if="offer.product_variation.duration && offer.product_variation.duration.value">
                    <td>Validade:</td>
                    <th class="text-right">{{offer.product_variation.duration.value}} {{offer.product_variation.duration.unit}}</th>
                  </tr>
                  <tr v-if="offer.product_variation.minimum_quantity_for_shipping && offer.product_variation.minimum_quantity_for_shipping.value">
                    <td>Quantidade mínima para envio:</td>
                    <th class="text-right">{{offer.product_variation.minimum_quantity_for_shipping.value}} {{offer.product_variation.minimum_quantity_for_shipping.unit}}</th>
                  </tr>
                  <tr v-if="offer.product_variation.gross_weight && offer.product_variation.gross_weight.value">
                    <td>Peso bruto por unidade:</td>
                    <th class="text-right">{{offer.product_variation.gross_weight.value}} {{offer.product_variation.gross_weight.unit}}</th>
                  </tr>
                  <tr v-if="offer.product_variation.net_weight && offer.product_variation.net_weight.value">
                    <td>Peso liquido por unidade:</td>
                    <th class="text-right">{{offer.product_variation.net_weight.value}} {{offer.product_variation.net_weight.unit}}</th>
                  </tr>
                  <tr v-if="offer.product_variation.ncm">
                    <td>NCM:</td>
                    <th class="text-right">{{offer.product_variation.ncm}}</th>
                  </tr>
                  <tr v-if="offer.product_variation.bar_code">
                    <td>Código de barras:</td>
                    <th class="text-right">{{offer.product_variation.bar_code}}</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="card card-collapse">
          <div class="card-header">
            <h5 class="mb-0">
              Embalagem comercial
            </h5>
          </div>
          <div>
            <div class="card-body">
              <table class="product-info">
                <tbody>
                  <tr v-if="offer.product_variation.box_weight && offer.product_variation.box_weight.value">
                    <td>Peso da embalagem:</td>
                    <th class="text-right">{{offer.product_variation.box_weight.value}} {{offer.product_variation.box_weight.unit}}</th>
                  </tr>
                  <tr v-if="offer.product_variation.box_height && offer.product_variation.box_height.value">
                    <td>Altura:</td>
                    <th class="text-right">{{offer.product_variation.box_height.value}} {{offer.product_variation.box_height.unit}}</th>
                  </tr>
                  <tr v-if="offer.product_variation.box_width && offer.product_variation.box_width.value">
                    <td>Comprimento:</td>
                    <th class="text-right">{{offer.product_variation.box_width.value}} {{offer.product_variation.box_width.unit}}</th>
                  </tr>
                  <tr v-if="offer.product_variation.box_gross_weight && offer.product_variation.box_gross_weight.value">
                    <td>Peso bruto:</td>
                    <th class="text-right">{{offer.product_variation.box_gross_weight.value}} {{offer.product_variation.box_gross_weight.unit}}</th>
                  </tr>
                  <tr v-if="offer.product_variation.box_max_stack">
                    <td>Empilhamento máximo:</td>
                    <th class="text-right">{{offer.product_variation.box_max_stack}}</th>
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
                  <img class="img-thumbnail" :src="defaultThumb(offer.producer.images)" :alt="offer.producer.name">
                </div>
                <div class="col-md-9">
                  <h5><strong>{{offer.producer.name}}</strong></h5>
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

export default {

  name: 'Offer',

  data() {
    return {
      offer: null,
      slide: 0,
      qtd: 1
    }
  },

  created() {
    axios.get('shop/offer/' + this.$route.params.id, {
      params: {
        populate: 'product_variation producer organization orders'
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
      this.notify(this.offer.product_variation.name +" adicionado ao carrinho")
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
