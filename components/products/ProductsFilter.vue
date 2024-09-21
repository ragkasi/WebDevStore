<template>
  <b-button-group style="float: right; display: flex">
    <b-button
      @click="
        () => {
          productFilter = productFilter == 1 ? -1 : 1;
        }
      "
      :pressed="productFilter == 1"
      variant="outline-danger"
      size="sm"
      >Laser Cutting</b-button
    >
    <b-button
      @click="
        () => {
          productFilter = productFilter == 0 ? -1 : 0;
        }
      "
      :pressed="productFilter == 0"
      variant="outline-danger"
      size="sm"
      >3D Printing</b-button
    >
  </b-button-group>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class ProductsFilter extends Vue {
  productFilter = -1;

  @Watch('productFilter')
  onProductFilterChanged() {
    this.$emit('update', this.productFilter);
  }
}
</script>

<style scoped>
.flexed {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
}
</style>
