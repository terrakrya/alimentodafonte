<template>
  <div class="img-container">
    <img :src="product_image" :alt="product_alt" :class="css_class">
  </div>
</template>

<script>

export default {

  name: 'product-image',
  props: ['product', 'product_variation', 'css_class'],
  computed: {
    product_image() {
      if (this.product_variation && this.product_variation.images && this.product_variation.images.length) {
        return this.defaultThumb(this.product_variation.images)
      } else if (this.product && this.product.images && this.product.images.length) {
        return this.defaultThumb(this.product.images)
      }
      return ""
    },
    product_alt() {
      if (this.product_variation && this.product_variation.name) {
        return this.product_variation.name
      } else if (this.product && this.product.name) {
        return this.product.name
      }
      return ""
    }
  }
};
</script>
