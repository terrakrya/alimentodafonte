<template>
  <div class="row">
    <div class="col-md-8">
      <h1>
        {{ isEditing() ? 'Editar' : 'Cadastrar' }} {{ name }}
      </h1>
      <br>
    </div>
  </div>
</template>

<script>
export default {
  name: 'form-headline',
  props: ['name']
};
</script>
