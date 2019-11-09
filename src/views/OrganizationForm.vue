<template>
<div class="collectors-group-form">
  <div class="col-md-8 col-12 mr-auto ml-auto" v-if="!isEditing()">
    <div class="wizard-container">
      <div class="card card-wizard active" data-color="rose" id="wizardProfile">
        <form action="" method="">
          <div class="card-header text-center">
            <h3 class="card-title">
              Cadastrar organização
            </h3>
            <h5 class="card-description">Preencha os dados abaixo para continuar</h5>
          </div>
          <div class="wizard-navigation">
            <ul class="nav nav-pills">
              <li class="nav-item active">
                <a class="nav-link active" href="#about" data-toggle="tab" role="tab">
                  Acesso
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#account" data-toggle="tab" role="tab">
                  Apresentação
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#address" data-toggle="tab" role="tab">
                  Contato
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#address" data-toggle="tab" role="tab">
                  Tributário / Financeiro
                </a>
              </li>
            </ul>
            <div class="moving-tab" style="width: 219.778px; transform: translate3d(-8px, 0px, 0px); transition: transform 0s ease 0s;">
              About
            </div>
          </div>
          <div class="card-body">
            <div class="tab-content">
              <div class="tab-pane active" id="about">
                <h5 class="info-text"> Let's start with the basic information (with validation)</h5>
                <div class="row justify-content-center">
                  <div class="col-sm-4">
                    <div class="picture-container">
                      <h6 class="description">Choose Picture</h6>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="input-group form-control-lg">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="material-icons">face</i>
                        </span>
                      </div>
                      <div class="form-group">
                        <label for="exampleInput1" class="bmd-label-floating">First Name (required)</label>
                        <input type="text" class="form-control" id="exampleInput1" name="firstname" required>
                      </div>
                    </div>
                    <div class="input-group form-control-lg">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="material-icons">record_voice_over</i>
                        </span>
                      </div>
                      <div class="form-group">
                        <label for="exampleInput11" class="bmd-label-floating">Second Name</label>
                        <input type="text" class="form-control" id="exampleInput11" name="lastname" required>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-10 mt-3">
                    <div class="input-group form-control-lg">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="material-icons">email</i>
                        </span>
                      </div>
                      <div class="form-group">
                        <label for="exampleInput1" class="bmd-label-floating">Email (required)</label>
                        <input type="email" class="form-control" id="exampleemalil" name="email" required>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane" id="account">
                <h5 class="info-text"> What are you doing? (checkboxes) </h5>
                <div class="row justify-content-center">
                  <div class="col-lg-10">
                    <div class="row">
                      <div class="col-sm-4">
                        <div class="choice" data-toggle="wizard-checkbox">
                          <input type="checkbox" name="jobb" value="Design">
                          <div class="icon">
                            <i class="fa fa-pencil"></i>
                          </div>
                          <h6>Design</h6>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <div class="choice" data-toggle="wizard-checkbox">
                          <input type="checkbox" name="jobb" value="Code">
                          <div class="icon">
                            <i class="fa fa-terminal"></i>
                          </div>
                          <h6>Code</h6>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <div class="choice" data-toggle="wizard-checkbox">
                          <input type="checkbox" name="jobb" value="Develop">
                          <div class="icon">
                            <i class="fa fa-laptop"></i>
                          </div>
                          <h6>Develop</h6>
                        </div>
                        <select class="selectpicker" data-style="btn btn-primary btn-round" title="Single Select" data-size="7">
                          <option disabled selected>Choose city</option>
                          <option value="2">Foobar</option>
                          <option value="3">Is great</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane" id="address">
                <div class="row justify-content-center">
                  <div class="col-sm-12">
                    <h5 class="info-text"> Are you living in a nice area? </h5>
                  </div>
                  <div class="col-sm-7">
                    <div class="form-group">
                      <label>Street Name</label>
                      <input type="text" class="form-control">
                    </div>
                  </div>
                  <div class="col-sm-3">
                    <div class="form-group">
                      <label>Street No.</label>
                      <input type="text" class="form-control">
                    </div>
                  </div>
                  <div class="col-sm-5">
                    <div class="form-group">
                      <label>City</label>
                      <input type="text" class="form-control">
                    </div>
                  </div>
                  <div class="col-sm-5">
                    <div class="form-group select-wizard">
                      <label>Country</label>
                      <select class="selectpicker" data-size="7" data-style="select-with-transition" title="Single Select">
                        <option value="Afghanistan"> Afghanistan </option>
                        <option value="Albania"> Albania </option>
                        <option value="Algeria"> Algeria </option>
                        <option value="American Samoa"> American Samoa </option>
                        <option value="Andorra"> Andorra </option>
                        <option value="Angola"> Angola </option>
                        <option value="Anguilla"> Anguilla </option>
                        <option value="Antarctica"> Antarctica </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="mr-auto">
              <input type="button" class="btn btn-previous btn-fill btn-default btn-wd disabled" name="previous" value="Previous">
            </div>
            <div class="ml-auto">
              <input type="button" class="btn btn-next btn-fill btn-rose btn-wd" name="next" value="Next">
              <input type="button" class="btn btn-finish btn-fill btn-rose btn-wd" name="finish" value="Finish" style="display: none;">
            </div>
            <div class="clearfix"></div>
          </div>
        </form>
      </div>
    </div>
    <!-- wizard container -->
  </div>
  <!-- <breadcrumb :links="[['Grupos de coletores', '/grupos-de-coletores']]" :active="isEditing() ? form.name : 'Cadastrar'" /> -->
  <div class="panel panel-headline data-list" v-else>
    <div class="panel-body">
      <form-headline name="grupo de coletores" />
      <loading :loading="isLoading" />
      <b-form @submit.prevent="save" v-if="!isLoading">
        <div class="row">
          <div class="col-sm-6">
            <b-form-group label="Nome do grupo *">
              <b-form-input v-model="form.name" v-validate="'required'" name="name" />
              <field-error :msg="veeErrors" field="name" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="CNPJ">
              <the-mask v-model="form.cnpj" :mask="['##.###.###/####-##']" />
            </b-form-group>
          </div>
        </div>
        <div class="row gray">
          <div class="col-sm-6">
            <b-form-group label="Contatos *" description="Liste todas as formas de contato com o grupo">
              <b-form-textarea v-model="form.contact" v-validate="'required'" name="contact" :rows="3" />
              <field-error :msg="veeErrors" field="contact" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="Descrição do grupo" description="Descreva aqui um pouco do trabalho do grupo de coletores">
              <b-form-textarea v-model="form.description" :rows="3" name="body" />
            </b-form-group>
          </div>
        </div>
        <form-address :form="form" />
        <form-bank-account :form="form" />
        <div class="row">
          <div class="col-sm-6">
            <b-form-group label="Sementes">
              <form-entities-select type="seeds" :form="form" field="seeds" />
            </b-form-group>
          </div>
          <div class="col-sm-6">
            <b-form-group label="Coletores">
              <form-entities-select v-if="collectors && collectors.length" :items="collectors" type="collectors" :form="form" field="collectors" />
              <no-item :list="collectors" />
            </b-form-group>
          </div>
        </div>
        <form-submit :errors="error" :sending="isSending" />
      </b-form>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'
import FormHeadline from '@/components/FormHeadline'
import FormEntitiesSelect from '@/components/FormEntitiesSelect'
import FormAddress from '@/components/FormAddress'
import FormBankAccount from '@/components/FormBankAccount'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import bancos from '@/data/bancos.json';
import tipos_de_conta from '@/data/tipos-de-conta2.json';

export default {

  name: 'CollectorsGroupForm',
  data() {
    return {
      bancos: bancos.map(banco => ({
        value: Number(banco.value),
        text: banco.text
      })),
      tipos_de_conta: tipos_de_conta,
      collectors: [],
      form: {
        name: '',
        description: '',
        cnpj: '',
        contact: '',
        address: {
          uf: "",
          city: "",
          postal_code: "",
          address: ""
        },
        bank_account: {
          bank_number: '',
          agency: '',
          account: '',
          type: 'corrente',
        },
        seeds: [],
        collectors: [],
      },
    }
  },
  created() {
    if (this.isEditing()) {
      this.edit(this.$route.params.id)
    }
    axios.get('users', {
      params: {
        role: 'collector',
        populate: {
          path: 'collectors_group',
          select: '_id'
        }
      }
    }).then(resp => {
      this.collectors = resp.data
      this.collectors = this.collectors.filter(collector => {
        return !collector.collectors_group || collector.collectors_group._id == this.$route.params.id
      })
      this.collectors = this.collectors.map(collector => {
        return {
          id: collector._id,
          title: collector.name,
          description: collector.nickname,
          picture: collector.image ? collector.image.thumb : '',
        }
      });

    }).catch(this.showError);
  },
  methods: {
    edit(id) {
      this.isLoading = true
      axios.get('collectors_groups/' + id).then(response => {
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
            url: 'collectors_groups' + (this.isEditing() ? '/' + this.$route.params.id : ''),
            data: this.form
          }).then(resp => {
            var collectors_group = resp.data
            if (collectors_group && collectors_group._id) {
              this.$router.replace('/grupo-de-coletores/' + collectors_group._id)
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
    NoItem,
    FormHeadline,
    FormEntitiesSelect,
    FormAddress,
    FormBankAccount,
    FormSubmit,
    FieldError
  }
};
</script>
