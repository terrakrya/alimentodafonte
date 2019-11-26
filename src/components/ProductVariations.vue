<template>
<div class="product-variations">
  <b-form @submit.prevent="save" v-if="!isLoading">
    <div class="col-md-12 mr-auto ml-auto">
      <div class="tab-pane" :class="tab == 1 ? 'active' : ''" v-if="product">
        <div v-if="!showForm && (product.product_variations && product.product_variations.length)">
          <div class="text-right">
            <button type="button" class="btn btn-success btn-sm" @click="add()">Cadastrar variação </button>
          </div>
          <div class="table-responsive">
            <table class="table table-shopping">
              <thead>
                <tr>
                  <th class="text-center"></th>
                  <th>Variação</th>
                  <th class="text-right">Preço</th>
                  <th class="text-right">Publicado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product_variation, index) in product.product_variations" :key="index">
                  <td>
                    <product-image :product="product" :product_variation="product_variation" />
                  </td>
                  <td class="td-name">
                    <a @click="edit(product_variation._id)">{{product_variation.name}}</a>
                    <br />
                    <small>{{product_variation.description}}</small>
                  </td>
                  <td :class="{'text-success': product_variation.published, 'text-danger': !product_variation.published }">
                    {{product_variation.published ? 'Sim' : 'Não'}}
                  </td>
                  <td class="td-number text-right">
                    {{product_variation.final_price | moeda}}
                  </td>
                  <td class="td-number">
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-danger"> <i class="material-icons">close</i> </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else>
          <h5 class="info-text" v-if="!product.product_variations || !product.product_variations.length"> A partir daqui vamos criar uma primeira variação deste produto. <br />Após o cadastro podemos criar variações a partir desta.</h5>
          <b-form-group label="Nome da variação deste produto *" class="bmd-form-group" description="Ex: Yuka mandioca com gergelim">
            <b-form-input v-model="form.name" v-validate="'required'" name="name" />
            <field-error :msg="veeErrors" field="name" />
          </b-form-group>
          <b-form-group label="Descrição desta variação *" class="bmd-form-group">
            <b-form-textarea v-model="form.description" v-validate="'required'" name="description" />
            <field-error :msg="veeErrors" field="description" />
          </b-form-group>
          <pictures-upload :form="form" :preview="this.images_preview" :error="error" field="images" url="uploads/images" :multiple="true" />
          <br>
          <br>
          <h5> CARACTERÍSTICAS DO PRODUTO </h5>
          <div class="row justify-content-center">
            <div class="col-md-6">
              <b-form-group label="Data de fabricação" class="bmd-form-group">
                <b-form-input v-model="form.manufacturing_date" name="manufacturing_date" type="date" />
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group label="Tempo de duração" class="bmd-form-group">
                <form-value-with-unit :form="form" field="duration" />
              </b-form-group>
            </div>
          </div>
          <b-form-group label="Atributos" class="bmd-form-group">
            <form-tags :form="form" field="tags" :tags="tags" />
          </b-form-group>
          <br>
          <br>
          <h5> VALORES </h5>
          <div class="row justify-content-center">
            <div class="col-md-4">
              <b-form-group label="Preço pago ao produtor / unidade" class="bmd-form-group">
                <money v-model="form.producer_price" class="form-control" @input="calcFinalPrice"></money>
              </b-form-group>
            </div>
            <div class="col-md-4">
              <b-form-group label="Impostos" class="bmd-form-group">
                <money v-model="form.taxes" class="form-control" @input="calcFinalPrice"></money>
              </b-form-group>
            </div>
            <div class="col-md-4">
              <b-form-group label="Preço final" class="bmd-form-group">
                <h4>{{form.final_price | moeda}}</h4>
              </b-form-group>
            </div>
          </div>
          <br>
          <br>
          <h5> ENVIO E ESTOCAGEM </h5>
          <div class="row justify-content-center">
            <div class="col-md-4">
              <b-form-group label="Quantidade mínima para envio" class="bmd-form-group">
                <form-value-with-unit :form="form" field="minimum_quantity_for_shipping" type="weight" />
              </b-form-group>
            </div>
            <div class="col-md-4">
              <b-form-group label="Peso bruto por unidade" class="bmd-form-group">
                <form-value-with-unit :form="form" field="gross_weight" type="weight" />
              </b-form-group>
            </div>
            <div class="col-md-4">
              <b-form-group label="Peso liquido por unidade" class="bmd-form-group">
                <form-value-with-unit :form="form" field="net_weight" type="weight" />
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group label="NCM" class="bmd-form-group">
                <b-form-input v-model="form.ncm" />
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group label="Código de barras" class="bmd-form-group">
                <b-form-input v-model="form.bar_code" />
              </b-form-group>
            </div>
          </div>
          <br>
          <br>
          <h5> EMBALAGEM COMERCIAL </h5>
          <div class="row justify-content-center">
            <div class="col-md-4">
              <b-form-group label="Peso da embalagem" class="bmd-form-group">
                <form-value-with-unit :form="form" field="box_weight" type="weight" />
              </b-form-group>
            </div>
            <div class="col-md-4">
              <b-form-group label="Altura" class="bmd-form-group">
                <form-value-with-unit :form="form" field="box_height" type="size" />
              </b-form-group>
            </div>
            <div class="col-md-4">
              <b-form-group label="Comprimento" class="bmd-form-group">
                <form-value-with-unit :form="form" field="box_width" type="size" />
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group label="Peso bruto" class="bmd-form-group">
                <form-value-with-unit :form="form" field="box_gross_weight" type="weight" />
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group label="Empilhamento máximo" class="bmd-form-group">
                <b-form-input v-model="form.box_max_stack" type="number" />
              </b-form-group>
            </div>
          </div>
          <b-form-group label="Disponível para venda?" class="bmd-form-group" description="Se esta opção estiver marcada esta variação de produto aparecerá na lista de produtos à venda.">
            <b-form-checkbox v-model="form.published" />
          </b-form-group>
          <div class="card-footer justify-content-center">
            <form-submit :errors="error" :sending="isSending" />
          </div>
        </div>
      </div>
    </div>
  </b-form>
</div>
</template>

<script>
import axios from 'axios'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import PicturesUpload from '@/components/PicturesUpload'
import FormTags from '@/components/FormTags';
import FormValueWithUnit from '@/components/FormValueWithUnit';
import ProductImage from '@/components/ProductImage';

export default {

  name: 'ProductForm',
  props: ['product'],
  data() {
    return {
      tab: 1,
      empty_form: {},
      form: {
        product: this.product.id,
        name: '',
        description: '',
        images: [],

        manufacturing_date: '',
        duration: {
          value: '',
          unit: 'Meses',
        },
        tags: [],

        producer_price: '',
        taxes: '',
        final_price: 0,

        minimum_quantity_for_shipping: {
          value: '',
          unit: 'Kg',
        },
        gross_weight: {
          value: '',
          unit: 'Kg',
        },
        net_weight: {
          value: '',
          unit: 'Kg',
        },
        ncm: '',
        bar_code: '',

        box_weight: {
          value: '',
          unit: 'Kg',
        },
        box_height: {
          value: '',
          unit: 'cm',
        },
        box_width: {
          value: '',
          unit: 'cm',
        },
        box_gross_weight: {
          value: '',
          unit: 'Kg',
        },
        box_max_stack: '',
        published: false
      },
      product_variation: null,
      images_preview: [],
      tags: [{
          text: 'Sem glúten'
        },
        {
          text: 'Sem lactose'
        },
        {
          text: 'Vegano'
        },
      ],
      showForm: false
    }
  },
  created() {
    // Object.assign(this.empty_form, this.form)
    axios.get('product_variations', {
      params: {
        select: 'tags'
      }
    }).then(response => {
      response.data.forEach(product_variation => {
        product_variation.tags.forEach(tag => {
          this.tags.push(tag)
        })
      });
      this.tags = this.tags.filter((v, i, a) => a.findIndex(t => (t.text === v.text)) === i)
    }).catch(this.showError);
  },
  methods: {
    list () {
      axios.get('products/' + this.product._id, {
        params: {
          populate: 'users product_variations'
        }
      }).then(response => {
        this.product = response.data
      }).catch(this.showError);
    },
    edit(id) {
      this.isLoading = true
      axios.get('product_variations/' + id).then(response => {
        this.apiDataToForm(this.form, response.data)
        this.product_variation = response.data
        this.showForm = true
        this.isLoading = false
      }).catch(this.showError);
    },
    save() {
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.isSending = true
          this.error = false
          axios({
            method: (this.isEditing() ? 'PUT' : 'POST'),
            url: (this.isEditing() ? 'product_variations/' + this.product_variation._id : 'product_variations'),
            data: this.form
          }).then(resp => {
            var product_variation = resp.data
            if (product_variation && product_variation._id) {
              this.notify("Os dados foram salvos!")
              window.scrollTo(0, 0);
              this.hideForm()
            }
            this.isSending = false
          }).catch(this.showError)
        }
      })
    },
    add() {
      Object.assign(this.form, this.empty_form)
      this.showForm = true
      this.product_variation = null
    },
    hideForm() {
      this.showForm = false
      this.product_variation = null
      this.list()
    },
    calcFinalPrice() {
      this.form.final_price = this.form.producer_price + this.form.taxes
    },
    isEditing() {
      return this.product_variation && this.product_variation._id
    },
  },
  components: {
    FormSubmit,
    FieldError,
    PicturesUpload,
    FormTags,
    FormValueWithUnit,
    ProductImage
  }
};
</script>
