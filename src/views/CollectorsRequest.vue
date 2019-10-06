<template>
<div class="collectors-request">
  <breadcrumb :links="[['Pedidos', '/pedidos-para-coletores']]" active="Dados do pedido" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
      <loading :loading="isLoading" />
      <div v-if="collectors_request && !isLoading">
        <div class="row item-title">
          <div class="col-md-12">
            <router-link :to="'/editar-pedido-para-coletores/'+collectors_request._id" class="btn btn-default btn-xs pull-right">
              <i class="fa fa-edit" aria-hidden="true"></i>
              Editar pedido
            </router-link>
            <h1>
              Pedido {{ collectors_request.code }}
            </h1>
            <p>
              Criado em: {{ collectors_request.createdAt | moment("DD/MM/YYYY") }}
            </p>
            <p>
              <router-link v-if="collectors_request.collectors_group" :to="'/grupo-de-coletores/'+collectors_request.collectors_group._id"> &bull; {{ collectors_request.collectors_group.name }}</router-link>
              <router-link v-if="collectors_request.collector" :to="'/coletor/'+collectors_request.collector._id"> &bull; {{ collectors_request.collector.name }}</router-link>
            </p>
          </div>
        </div>
        <hr class="clearfix">
        <div class="row" v-if="collectors_request.seed_items && collectors_request.seed_items.length">
          <div class="col-sm-6 col-md-3">
            <div class="weekly-summary text-center">
              <span class="info-label">Quantidade</span>
              <span class="number">{{ collectors_request.seed_items.map(seed_item => sumQtd(seed_item.qtd)).reduce((a, b) => a + b) | kg}}</span>
            </div>
          </div>
          <div class="col-sm-6 col-md-3">
            <div class="weekly-summary text-center">
              <span class="info-label">Remuneração total</span>
              <span class="number">{{ collectors_request.seed_items.map(seed_item =>  seed_item.compensation_collect * sumQtd(seed_item.qtd)).reduce((a, b) => a + b) | moeda }}</span>
            </div>
          </div>
        </div>
        <hr class="clearfix">
        <div class="row">
          <div class="col-sm-12" v-if="collectors_request">
            <table class="table b-table b-table-stacked-md">
              <thead>
                <tr>
                  <th>Espécie</th>
                  <th>Remuneração / Kg</th>
                  <th>Quantidade</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(seed_item, index) in collectors_request.seed_items" :key="index">
                  <td>
                    <router-link :to="'/semente/'+seed_item.seed._id">{{seed_item.seed.name}}</router-link>
                  </td>
                  <td>
                    <span>{{(seed_item.compensation_collect) | moeda}}</span>
                  </td>
                  <td>
                    <span v-if="typeof seed_item.qtd == 'object'">
                      <p v-for="(qtd, i) in seed_item.qtd" :key="i"><small v-if="qtd.collector">{{collectors.find(collector => collector._id == qtd.collector).name}}:</small> {{parseFloat(qtd.qtd) | kg}}</p>
                      <p><span>Total: {{sumQtd(seed_item.qtd) | kg}}</span></p>
                    </span>
                    <span v-else>{{sumQtd(seed_item.qtd) | kg}}</span>
                  </td>
                  <td>
                    <span v-if="typeof seed_item.qtd == 'object'">
                      <p v-for="(qtd, i) in seed_item.qtd" :key="i"><small v-if="qtd.collector">{{collectors.find(collector => collector._id == qtd.collector).name}}:</small> {{(seed_item.compensation_collect * parseFloat(qtd.qtd)) | moeda}}</p>
                      <p><span>Total: {{(sumQtd(seed_item.qtd) * seed_item.compensation_collect) | moeda}}</span></p>
                    </span>
                    <span v-else>{{(seed_item.compensation_collect * sumQtd(seed_item.qtd)) | moeda}}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'

export default {

  name: 'CollectorsRequest',

  data() {
    return {
      collectors_request: null,
      collectors: null
    }
  },
  created() {
    this.isLoading = true
    axios.get('users', {
      params: {
        role: 'collector'
      }
    }).then(response => {
      this.collectors = response.data
      axios.get('collectors_requests/' + this.$route.params.id, {
        params: {
          populate: 'collectors_group collectors_group.collectors collector seed_items.seed seed_items.qtd.collector'
        }
      }).then(response => {
        this.collectors_request = response.data
        this.isLoading = false
      }).catch(this.showError);
    }).catch(this.showError)

  },
  components: {
    'loading': Loading,
    'breadcrumb': Breadcrumb
  }
};
</script>
