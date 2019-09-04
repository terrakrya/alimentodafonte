<template>
<div class="collector">
  <breadcrumb :links="[['Coletores', '/coletores']]" active="Dados do coletor" />
  <div class="panel panel-headline data-list">
    <div class="panel-body">
      <b-alert variant="danger" show v-if="error">{{error}}</b-alert>
      <loading :loading="isLoading" />
      <div v-if="user && !isLoading">
        <div class="row item-title">
          <div class="col-md-2" v-if="user.image && user.image.thumb">
            <img :src="baseUrl + user.image.thumb" class="img-responsive item-img" />
          </div>
          <div class="col-md-10">
            <h1>
              {{ user.name }}
            </h1>
            <p>
              <span>{{ user.contact }}</span> &bull;
              <span v-if="user.nickname && user.nickname != user.name">
                {{ user.nickname }}
              </span>
            </p>
            <p v-if="user.address">
              <span>
                {{user.address | address}}
              </span>
            </p>
            <p v-if="user.comments">
              <span>
                {{user.comments}}
              </span>
            </p>
            <router-link :to="'/editar-coletor/'+user._id" class="btn btn-default btn-xs">
              <i class="fa fa-edit" aria-hidden="true"></i>
              Editar coletor
            </router-link>
          </div>
        </div>
        <hr class="clearfix">
        <div class="row">
          <div class="col-sm-6">
            <div class="list-group entity-select-preview">
              <div class="list-group-item active">
                <strong>Dados do coletor</strong>
              </div>
              <div class="list-group-item">
                <dl v-if="user.cpf">
                  <dt>CPF</dt>
                  <dd>{{ user.cpf | cpf }}</dd>
                </dl>
                <dl v-if="user.email">
                  <dt>Email</dt>
                  <dd>{{ user.email }}</dd>
                </dl>
                <dl v-if="user.name">
                  <dt>Nome de usuário</dt>
                  <dd>{{ user.name }}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="list-group entity-select-preview">
              <div class="list-group-item active">
                <strong>Dados bancários</strong>
              </div>
              <div class="list-group-item">
                <bank-account :bank_account="user.bank_account" />
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
import BankAccount from '@/components/BankAccount'

export default {

  name: 'User',

  data() {
    return {
      user: null,


    }
  },

  created() {

    this.isLoading = true

    axios.get('users/' + this.$route.params.id).then(user => {
      this.user = user.data
      this.isLoading = false
    }).catch(this.showError);

  },

  components: {
    Loading,
    Breadcrumb,
    BankAccount
  }

};
</script>
