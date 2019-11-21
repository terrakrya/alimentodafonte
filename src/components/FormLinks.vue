<template>
<div class="form-links">
  <div class="row" v-for="(link, index) in form[field]" :key="index">
    <div class="col-md-3">
      <b-form-group v-if="fixed_links.find(l => (l.label == link.label))">
        {{link.label}}:
      </b-form-group>
      <b-form-group v-else>
        <b-form-input v-model="form[field][index].label" type="text" placeholder="Descrição do link" />
      </b-form-group>
    </div>
    <div class="col-md-9">
      <b-form-group>
        <b-form-input v-model="form[field][index].value" type="text" placeholder="https://" />
      </b-form-group>
    </div>
  </div>
  <a class="btn btn-default btn-sm pull-right" @click="addLink">Adicionar link</a>
</div>
</template>

<script>

export default {

  name: 'form-links',
  props: ['form', 'field'],
  data() {
    return {
      links: [],
      fixed_links: [{
          label: "Site",
          value: "",
        },
        {
          label: "Facebook",
          value: "",
        },
        {
          label: "Instagram",
          value: "",
        },
        {
          label: "Twitter",
          value: "",
        },
      ]
    }
  },
  created() {
    this.links = this.fixed_links
    if (!this.form[this.field] || !this.form[this.field].length) {
      this.form[this.field] = this.links

    }
  },
  methods: {
    addLink() {
      this.form[this.field].push({
        label: "",
        value: ""
      })
    }
  }
};
</script>
