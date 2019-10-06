<template>
  <div class="dashboard">
    <ol class="breadcrumb">
      <li class="active">Painel do coletor</li>
    </ol>
    <div class="panel panel-headline data-list">
      <div class="panel-body">
        <div class="row">
          <div class="col-md-12">
            <div class="info-content">
              <div class="col-sm-4" v-if="collections">
                <div class="weekly-summary text-center">
                  <router-link to="/coletas">
                    <span class="info-label">Coletas</span>
                    <span class="number">{{ total_collection_weight_gross | kg}}</span>
                    <br>
                    <span>{{ total_collection_weight_benef | kg}} beneficiado</span>
                    <br>
                    <small>{{ total_collection_species }} espécies</small>
                  </router-link>
                </div>
              </div>
              <div class="col-sm-4" v-if="collectors_requests">
                <div class="weekly-summary text-center">
                  <router-link to="/pedidos-do-coletor">
                    <span class="info-label">Pedidos</span>
                    <span class="number">{{ total_collectors_request_qtd | kg}}</span>
                    <br>
                    <span>{{ total_collectors_request | moeda }}</span>
                    <br>
                    <small>{{ total_collectors_request_species }} espécies</small>
                  </router-link>
                </div>
              </div>
              <div class="col-sm-4" v-if="stock_ins">
                <div class="weekly-summary text-center">
                  <router-link to="/entregas-do-coletor">
                    <span class="info-label">Entregas</span>
                    <span class="number">{{ total_stock_in_qtd | kg}}</span>
                    <br>
                    <span>{{ total_stock_in | moeda }}</span>
                    <br>
                    <small>{{ total_stock_in_species }} espécies</small>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr class="clearfix">
        <br>
        <div class="text-center ">
          <router-link class="btn btn-default" to="/sementes-do-coletor"><span>Sementes</span></router-link>
          <router-link class="btn btn-default" to="/pedidos-do-coletor"><span>Pedidos</span></router-link>
          <router-link class="btn btn-default" to="/entregas-do-coletor"><span>Entregas</span></router-link>
          <router-link class="btn btn-default" to="/coletas"><span>Coletas</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Dashboard',

  data() {
    return {
      collectors_requests: null,
      stock_ins: null,
      collections: null,
    }
  },
  computed: {
    total_collectors_request() {
      if (this.collectors_requests) {
        var values = this.collectors_requests.map(collectors_request => {
          return collectors_request.qtd * collectors_request.compensation_collect
        })
        return values && values.length ? values.reduce((a, b) => a + b) : 0
      }
      return 0
    },
    total_collectors_request_qtd() {
      if (this.collectors_requests) {
        var values = this.collectors_requests.map(collectors_request => {
          return collectors_request.qtd
        })
        return values && values.length ? values.reduce((a, b) => a + b) : 0
      }
      return 0
    },
    total_collectors_request_species() {
      if (this.collectors_requests) {
        var seeds = []
        this.collectors_requests.forEach(collectors_request => {
          if (!seeds.includes(collectors_request.seed._id)) {
            seeds.push(collectors_request.seed._id)
          }
        })
        return seeds.length
      }
      return 0
    },
    total_stock_in() {
      if (this.stock_ins) {
        var values = this.stock_ins.map(stock_in => {
          return stock_in.qtd * stock_in.price
        })
        return values && values.length ? values.reduce((a, b) => a + b) : 0
      }
      return 0
    },
    total_stock_in_qtd() {
      if (this.stock_ins) {
        var values = this.stock_ins.map(stock_in => {
          return stock_in.qtd
        })
        return values && values.length ? values.reduce((a, b) => a + b) : 0
      }
      return 0
    },
    total_stock_in_species() {
      if (this.stock_ins) {
        var seeds = []
        this.stock_ins.forEach(stock_in => {
          if (!seeds.includes(stock_in.seed)) {
            seeds.push(stock_in.seed)
          }
        })
        return seeds.length
      }
      return 0
    },
    total_collection_weight_gross() {
      if (this.collections) {
        var values = this.collections.map(collection => {
          return collection.weight_gross
        })
        return values && values.length ? values.reduce((a, b) => a + b) : 0
      }
      return 0
    },
    total_collection_weight_benef() {
      if (this.collections) {
        var values = this.collections.map(collection => {
          return collection.weight_benef
        })
        return values && values.length ? values.reduce((a, b) => a + b) : 0
      }
      return 0
    },
    total_collection_species() {
      if (this.collections) {
        var seeds = []
        this.collections.forEach(collection => {
          if (!seeds.includes(collection.seed)) {
            seeds.push(collection.seed)
          }
        })
        return seeds.length
      }
      return 0
    },
  },
  created () {
    axios.get('collector/requests').then(response => {
      this.collectors_requests = response.data
    }).catch(this.showError)
    axios.get('collector/stock_ins').then(response => {
      this.stock_ins = response.data
    }).catch(this.showError)
    axios.get('collections').then(response => {
      this.collections = response.data
    }).catch(this.showError)
  }
}
</script>
