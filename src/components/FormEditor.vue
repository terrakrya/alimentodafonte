<template>
<div class="form-editor">
  <br>
  <ckeditor :editor="editor" v-model="form[field]" :config="editorConfig"></ckeditor>
</div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {

  name: 'form-editor',
  props: ['form', 'field'],
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      }
    }
  }
};
</script>
