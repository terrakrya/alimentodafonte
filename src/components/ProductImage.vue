<template>
  <div class="img-container">
    <img :src="product_image" :alt="product_alt" :class="css_class">
  </div>
</template>

<script>

export default {

  name: 'product-image',
  props: ['product', 'css_class'],
  computed: {
    product_image() {
      if (this.product && this.product.images && this.product.images.length) {
        return this.defaultThumb(this.product.images)
      }
      return this.defaultThumb([])
    },
    product_alt() {
      if (this.product && this.product.name) {
        return this.product.name
      }
      return ""
    }
  }
};
</script>
