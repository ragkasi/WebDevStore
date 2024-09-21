<template>
  <div>
    <h2>Orders</h2>
    <hr />
    <span>
      Select a tab to view orders that are listed under that status.
    </span>
    <ProductsFilter v-on:update="update" />
    <hr />
    <ViewOrdersContainer :productFilter="productFilter" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import roles from '../../shared/roles';
import ViewOrdersContainer from '../../components/orders/ViewOrdersContainer.vue';
import ProductsFilter from '../../components/products/ProductsFilter.vue';

@Component({
  components: {
    ViewOrdersContainer,
    ProductsFilter,
  },
})
export default class OrdersIndex extends Vue {
  productFilter: number = -1;

  get admin() {
    return roles.admin;
  }

  get store() {
    return roles.store;
  }

  get student() {
    return roles.student;
  }

  update(newProductFilter: number) {
    if ([-1, 0, 1].includes(newProductFilter)) {
      this.productFilter = newProductFilter;
    }
  }
}
</script>
