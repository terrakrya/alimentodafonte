<template>
  <div class="row">
    <div class="col-sm-12 text-center">
      <b-alert variant="danger" show v-if="errors">{{errors}}</b-alert>
      <b-alert variant="danger" show v-if="veeErrors && veeErrors.items && veeErrors.items.length">Verifique os erros acima para continuar</b-alert>
      <div class="btn-group">
        <button v-if="sending" type="button" class="btn btn-default btn-block"><i class="fa fa-spinner fa-spin"></i> Enviando dados...</button>
        <button v-if="!sending" role="button" class="btn btn-primary btn-lg fa fa-save"> Salvar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'form-submit',
  props: ['errors', 'sending']
};
</script>
