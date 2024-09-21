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
        id="input-group-area"
        label="Part Area"
        label-for="input-area"
      >
        <b-form-input
          id="input-area"
          :number="true"
          type="number"
          v-model="product.data.area"
          min="0.01"
          step="0.01"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-length"
        label="Part Length"
        label-for="input-length"
      >
        <b-form-input
          id="input-length"
          :number="true"
          type="number"
          v-model="product.data.length"
          min="0.01"
          step="0.01"
          required
        ></b-form-input>
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
import { productMaterialTypes } from '../../utils/config';
@Component({})
export default class EditLasercutForm extends Vue {
  @Prop() order!: Order;
  @Prop() laserId!: string;

  product: LaserCutProduct | null = null;
  oldProduct: LaserCutProduct | null = null;

  productIdx = -1;

  mounted() {
    this.product = this.order.products.find(
      (elem) => elem.id == this.laserId && elem.type == 1,
    ) as LaserCutProduct;

    this.productIdx = this.order.products.indexOf(this.product);

    this.oldProduct = JSON.parse(JSON.stringify(this.product));
  }

  failureReason = '';

  showSuccess = false;
  showFailure = false;

  onSubmit(evt: Event) {
    evt.preventDefault();
    if (this.order && this.product && this.oldProduct) {
      this.product.data.length = Number(
        Number(this.product.data.length).toFixed(2),
      );
      this.product.data.area = Number(
        Number(this.product.data.area).toFixed(2),
      );
      const materialType = this.product.data.materialType;
      this.product.price = Number(
        Number(
          this.product.data.length * 0.07 +
            this.product.data.area *
              productMaterialTypes.filter(
                (elem) => elem.value == materialType,
              )[0].costPerUnitArea,
        ).toFixed(2),
      );

      this.$set(this.order.products, this.productIdx, this.product);
      this.order.totalCost +=
        this.product.data.quantity * this.product.price -
        this.oldProduct.data.quantity * this.oldProduct.price;
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
