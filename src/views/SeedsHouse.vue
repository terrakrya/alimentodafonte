<template>
<div class="seeds-house">
  <breadcrumb :links="[['Casas de sementes', '/casas-de-sementes']]" active="Dados da casa" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
      <loading :loading="isLoading" />
      <div v-if="seeds_house && !isLoading">
        <div class="row item-title">
          <div class="col-md-10">
            <h1>
              {{ seeds_house.name }}
            </h1>
            <p>
              <span v-if="seeds_house.phone">{{ seeds_house.phone }}</span>
							&bull;
              <span v-if="seeds_house.owner">
                Proprietário: {{ seeds_house.owner.name }}
              </span>
            </p>
            <router-link :to="'/editar-casa-de-sementes/'+seeds_house._id" class="btn btn-default btn-xs">
              <i class="fa fa-edit" aria-hidden="true"></i>
              Editar casa
            </router-link>
          </div>
        </div>
        <hr class="clearfix">
        <div class="row">
          <div class="col-sm-6" v-if="seeds_house.collectors && seeds_house.collectors.length">
            <div class="list-group entity-select-preview">
              <div class="list-group-item active">
                <strong>Coletores</strong>
              </div>
              <div class="list-group-item" v-for="(collector, index) in seeds_house.collectors" :key="index">
                <router-link :to="'/coletor/'+collector._id">
                  <img v-if="collector.image" :src="baseUrl + collector.image.thumb" />
                  <span v-if="collector.name">{{collector.name}}</span>
                </router-link>
              </div>
            </div>
          </div>
          <div class="col-sm-6" v-if="seeds_house.collectors_groups && seeds_house.collectors_groups.length">
            <div class="list-group entity-select-preview">
              <div class="list-group-item active">
                <strong>Grupos de coletores</strong>
              </div>
              <div class="list-group-item" v-for="(collectors_group, index) in seeds_house.collectors_groups" :key="index">
                <router-link :to="'/grupo-de-coletores/'+collectors_group._id">
                  <span v-if="collectors_group.name">{{collectors_group.name}}</span>
                </router-link>
              </div>
            </div>
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

  name: 'SeedsHouse',

  data() {
    return {
      seeds_house: null,
    }
  },
  created() {
    this.isLoading = true
    axios.get('seeds_houses/' + this.$route.params.id, {
      params: {
        populate: 'collectors collectors_groups owner'
      }
    }).then(response => {
      this.seeds_house = response.data
      this.isLoading = false
    }).catch(this.showError);
  },
  components: {
    'loading': Loading,
    'breadcrumb': Breadcrumb
  }
};
</script>
