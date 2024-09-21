<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Edited order item.
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Failed to edit order item! <b>{{ failureReason }}</b> Try again later.
    </b-alert>

    <b-form @submit="onSubmit" v-if="product">
      <dl>
        <dt>Team</dt>
        <dd>{{ order.team }}</dd>
        <dt>Time Placed</dt>
        <dd>{{ new Date(order.dateSubmitted).toLocaleString() }}</dd>
      </dl>
      <b-form-group
        id="input-group-weight"
        label="Part Weight"
        label-for="input-weight"
      >
        <b-form-input
          id="input-weight"
          :number="true"
          type="number"
          v-model="product.data.weight"
          min="0.01"
          step="0.01"
          required
        ></b-form-input>
        <small>Provided by MakerBot software</small>
      </b-form-group>
      <b-form-group
        id="input-group-part-quantity"
        label="Quantity"
        label-for="input-part-quantity"
      >
        <b-form-input
          id="input-part-quantity"
          :number="true"
          type="number"
          v-model="product.data.quantity"
          min="1"
          step="1"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-part-description"
        label="Description"
        label-for="input-part-description"
      >
        <b-form-textarea
          id="input-part-description"
          v-model="product.data.description"
          required
          rows="3"
          max-rows="3"
        ></b-form-textarea>
      </b-form-group>
      <div style="float: right">
        <b-btn
          variant="secondary"
          @click="
            () => {
              this.$emit('close');
            }
          "
        >
          Cancel
        </b-btn>
        <span>&nbsp;</span>
        <b-btn type="submit" variant="danger"> Update </b-btn>
      </div>
    </b-form>
  </div>
</template>

<script lang="ts">
import orders from '@/api/orders';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({})
export default class EditPrintedForm extends Vue {
  @Prop() order!: Order;
  @Prop() printedId!: string;

  product: PrintedProduct | null = null;
  oldProduct: PrintedProduct | null = null;

  productIdx = -1;

  mounted() {
    this.product = this.order.products.find(
      (elem) => elem.id == this.printedId && elem.type == 0,
    ) as PrintedProduct;

    this.productIdx = this.order.products.indexOf(this.product);

    this.oldProduct = JSON.parse(JSON.stringify(this.product));
  }

  failureReason = '';

  showSuccess = false;
  showFailure = false;

  onSubmit(evt: Event) {
    evt.preventDefault();
    if (this.order && this.product && this.oldProduct) {
      this.product.data.weight = Number(
        Number(this.product.data.weight).toFixed(2),
      );
      this.product.price = Number(
        Number(this.product.data.weight * 0.15).toFixed(2),
      );

      this.$set(this.order.products, this.productIdx, this.product);
      this.order.totalCost +=
        this.product.data.quantity * this.product.price -
        this.oldProduct.data.quantity * this.oldProduct.price;

      this.order.totalWeight +=
        this.product.data.quantity * this.product.data.weight -
        this.oldProduct.data.quantity * this.oldProduct.data.weight;

      orders.updateOrder(this.order.id, this.order).then((res) => {
        if (res.data?.status == 'success') {
          this.showSuccess = true;
          setTimeout(() => {
            this.$emit('close');
            this.$emit('update');
          }, 1000);
        } else {
          this.showFailure = true;
          this.failureReason = res.data?.reason;
        }
      });
    }
  }
}
</script>
