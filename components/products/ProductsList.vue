<template>
  <div>
    <b-container>
      <PRProducts :products="printed" :inCart="inCart" v-if="printed.length">
      </PRProducts>
      <LCProducts :products="lasercut" :inCart="inCart" v-if="lasercut.length">
      </LCProducts>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PRProducts from '../3d_printing/PRProducts.vue';
import LCProducts from '../laser_cutting/LCProducts.vue';

@Component({
  components: {
    PRProducts,
    LCProducts,
  },
})
export default class ProductsList extends Vue {
  @Prop(Array) readonly products!: Product[];

  @Prop(Boolean) readonly inCart!: boolean;

  get printed() {
    return this.products.filter((elem: Product) => elem.type == 0);
  }

  get lasercut() {
    return this.products.filter((elem: Product) => elem.type == 1);
  }

  onRemove(product: Product) {
    this.$store.dispatch('removeProduct', product);
  }
}
</script>
