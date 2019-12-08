<template>
<div class="form-users">
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>Usuário</th>
          <th>Email</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in organization.users" :key="index">
          <td>
            {{user.name}}
          </td>
          <td>
            {{user.email}}
          </td>
          <td class="text-right">
            <div class="btn-group btn-group-sm">
              <a v-if="organization.users.length > 1" @click="remove(data.item._id)" class="btn btn-danger">
                <i class="material-icons">close</i>
              </a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <a v-if="!form" class="btn btn-default btn-sm pull-right" @click="addUser">Adicionar usuário</a>
  <div v-if="form" >
    <div class="row">
      <div class="col-md-4 col-sm-6">
        <b-form-group>
          <b-form-input v-model="form.name" type="text" placeholder="Nome" />
        </b-form-group>
      </div>
      <div class="col-md-4 col-sm-6">
        <b-form-group>
          <b-form-input v-model="form.email" type="text" placeholder="Email" />
        </b-form-group>
      </div>
      <div class="col-md-4 col-sm-6">
        <b-form-group>
          <b-form-input v-model="form.password" type="password" placeholder="Senha" />
        </b-form-group>
      </div>
    </div>
    <span v-if="form.name && form.email && form.password" class="btn btn-primary btn-sm pull-right" @click="saveUser">Salvar usuário</span>
  </div>
  <div class="clearfix"></div>
  <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
</div>
</template>

<script>
import axios from 'axios'

export default {

  name: 'form-users',
  props: ['organization'],
  data() {
    return {
      form: null,
      users: [],
      empty_form: {
        name: "",
        email: "",
        password: "",
        organization: "",
        cnpj: "",
        roles: ["manager"]
      }
    }
  },
  created() {},
  methods: {
    addUser() {
      this.form = this.empty_form
      this.error = null
    },
    saveUser() {
      this.form.organization = this.organization._id
      this.form.cnpj = this.organization.cnpj
      axios({
        method: 'POST',
        url: 'users',
        data: this.form
      }).then(resp => {
        var user = resp.data
        if (user && user._id) {
          this.organization.users.push(user)
          this.notify('Usuário cadastrado com sucesso!')
          this.form = null
        }
      }).catch(this.showError)
    },
    remove(user) {
      // eslint-disable-next-line
      console.log(user);
    }
  },
  components: {
  }
};
</script>
