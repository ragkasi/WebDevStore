<template>
  <div>
    <b-alert :show="showFailure" variant="danger" dismissible>
      Error placing order. <b>{{ failureReason }}</b> Try again later.
    </b-alert>
    <h2><i class="fa fa-shopping-cart" /> Shopping Cart</h2>
    <hr />
    <b-form @submit="onSubmit">
      <p v-if="products.length == 0 && parts.length == 0">
        Your cart is empty! Shop for
        <a href="/parts" style="color: #ce0f3d">parts</a> or place a
        <a href="/services/add" style="color: #ce0f3d">service order</a>.
      </p>
      <b-container>
        <OrderedPartList v-if="parts.length != 0" :orderedParts="parts" />
      </b-container>
      <br v-if="parts.length != 0 && products.length != 0" />
      <ProductsList
        v-if="products.length != 0"
        :products="products"
        :inCart="true"
      />
      <br v-if="products.length != 0 || parts.length != 0" />
      <span
        v-if="products.length != 0 || parts.length != 0"
        style="float: right; font-size: 16px"
        ><strong>Total Cost: </strong
        >{{
          Number(totalCost).toLocaleString('us-US', {
            style: 'currency',
            currency: 'USD',
          })
        }}</span
      >
      <br v-if="products.length != 0 || parts.length != 0" />
      <b-button
        v-if="products.length != 0 || parts.length != 0"
        variant="danger"
        type="submit"
        style="float: right"
        :disabled="disableSubmit"
        v-on:keydown.enter.prevent
        >Submit Order</b-button
      >
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProductsList from '../../components/products/ProductsList.vue';
import OrderedPartList from '../../components/parts/OrderedPartList.vue';
import api from '../../api/orders';
import teams from '../../api/teams';
import Store from '@/shared/store';
import roles from '../../shared/roles';
import { getPriceLaserCutting, getPricePrinting } from '@/utils/genericUtils';

@Component({
  components: {
    ProductsList,
    OrderedPartList,
  },
})
export default class ViewCart extends Vue {
  showFailure = false;
  failureReason = '';
  disableSubmit = false;

  get products() {
    return this.$store.state.cart.products;
  }

  get parts() {
    return this.$store.state.cart.parts;
  }

  get totalCost() {
    return (
      (this.parts.reduce(
        (prev: number, curr: Part) => prev + curr.price * curr.quantityOrdered,
        0,
      ) as number) +
      (this.products.reduce((prev: number, curr: Product) => {
        if (curr.type == 0) {
          return prev + getPricePrinting(curr) * curr.data.quantity;
        } else if (curr.type == 1) {
          return prev + getPriceLaserCutting(curr) * curr.data.quantity;
        }
      }, 0) as number) +
      new Set(this.products.map((elem: Product) => elem.type)).size * 1.5
    );
  }

  mounted() {
    //lightweight api call to make sure the students dont have overdue loans
    teams.getFilament(roles.teamName).then((res) => {
      if (res.status === 402) {
        this.$router.push('/overdue');
      }
    });
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.disableSubmit = true;
    api.postOrder(this.products, this.parts).then((res) => {
      if (res.data?.status == 'success') {
        this.products.forEach((prod: Product) => {
          if (prod.type == 0) {
            Store.remove(`${prod.id}-stl`);
            Store.remove(`${prod.id}-sw`);
          } else {
            Store.remove(`${prod.id}-dxf`);
          }
        });
        this.$store.dispatch('clearCart');
        this.$router.push('/orders/team').catch(() => {});
      } else {
        this.showFailure = true;
        this.disableSubmit = false;
        this.failureReason = res.data?.reason;
      }
    });
  }
}
</script>
