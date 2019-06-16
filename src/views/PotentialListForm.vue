<template>
<div class="potential-item-form">
  <breadcrumb :links="[['Listas de potencial', '/listas-de-potencial']]" :active="isEditing() ? 'Lista ' + form.code : 'Cadastrar'" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <form-headline name="lista de potencial" />
      <loading :loading="isLoading" />
      <b-form @submit.prevent="save" v-if="!isLoading">
        <div class="row">
          <div class="col-sm-6">
            <b-form-group label="Grupo de coletores">
              <form-entity-select type="collectors_groups" :form="form" field="collectors_group" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="Coletor">
              <form-entity-select type="collectors" :form="form" field="collector" />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <form-seeds-select :form="form" field="seed_items" basecalc="compensation_collect" />
          </div>
        </div>
        <form-submit v-if="form.seed_items && form.seed_items.length" :errors="error" :sending="isSending" />
      </b-form>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormHeadline from '@/components/FormHeadline'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSeedsSelect from '@/components/FormSeedsSelect'
import FormSubmit from '@/components/FormSubmit'

export default {

  name: 'PotentialListForm',
  data() {
    return {
      form: {
        code: null,
        collectors_group: null,
        collector: null,
        seed_items: []
      },
    }
  },
  async created() {
    if (this.isEditing()) {
      this.edit(this.$route.params.id)
    }
  },
  methods: {
    edit(id) {
      this.isLoading = true
      axios.get('potential_lists/' + id).then(response => {
        var data = response.data
        this.apiDataToForm(this.form, data)
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
            url: 'potential_lists' + (this.isEditing() ? '/' + this.$route.params.id : ''),
            data: this.form
          }).then(resp => {
            var potential_list = resp.data
            if (potential_list && potential_list._id) {
              this.$router.replace('/lista-de-potencial/' + potential_list._id)
            }
            this.isSending = false
          }).catch(this.showError)
        }
      })
    }
  },
  components: {
    Breadcrumb,
    Loading,
    FormHeadline,
    FormEntitySelect,
    FormSeedsSelect,
    FormSubmit
  }
};
</script>
