<template>
  <div class="form-geolocation">
    <div class="row">
      <div class="col-sm-6">
        <b-form-group label="Latitude" >
          <b-form-input v-model="form.geolocation.lat" />
        </b-form-group>
      </div>
      <div class="col-sm-6">
        <b-form-group label="Longitude" >
          <b-form-input v-model="form.geolocation.lng" />
        </b-form-group>
      </div>
    </div>
    <loading :loading="loading" msg="Buscando geolocalização" />
    <a class="btn btn-sm btn-default pull-right" @click="getLocation">
      <i class="material-icons">gps_fixed</i>
      Minha posição atual
    </a>
    <div class="clearfix"></div>
  </div>
</template>
<script>

import Loading from '@/components/Loading'

export default {
  name: 'form-geolocation',
  props: {
    form: Object,
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        this.loading = true
        navigator.geolocation.getCurrentPosition(position => {
          this.form.geolocation.lat = position.coords.latitude
          this.form.geolocation.lng = position.coords.longitude
          this.loading = false
        });
      } else {
        this.notify("Seu browser não suporta geolocalização.", "warn");
      }
    }
  },
  components: {
    Loading
  }
};
</script>
