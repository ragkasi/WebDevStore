<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Edited order item.
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Failed to edit order item! <b>{{ failureReason }}</b> Try again later.
    </b-alert>

    <b-form @submit="onSubmit" v-if="part">
      <dl>
        <dt>Team</dt>
        <dd>{{ order.team }}</dd>
        <dt>Time Placed</dt>
        <dd>{{ new Date(order.dateSubmitted).toLocaleString() }}</dd>
      </dl>
      <h5>{{ part.name }}</h5>
      <b-form-group
        id="input-group-part-price"
        label="Price"
        label-for="input-part-price"
      >
        <b-form-input
          id="input-part-price"
          :number="true"
          type="number"
          v-model="part.price"
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
          v-model="part.quantityOrdered"
          min="1"
          step="1"
          required
        ></b-form-input>
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import orders from '../../api/orders';
@Component({})
export default class EditPartForm extends Vue {
  @Prop() order!: Order;
  @Prop() partIdx!: number;

  part: Part | null = null;
  oldPart: Part | null = null;

  mounted() {
    this.part = JSON.parse(JSON.stringify(this.order.parts[this.partIdx]));
    this.oldPart = JSON.parse(JSON.stringify(this.order.parts[this.partIdx]));
  }

  failureReason = '';

  showSuccess = false;
  showFailure = false;

  onSubmit(evt: Event) {
    evt.preventDefault();
    if (this.order && this.part && this.oldPart) {
      this.$set(this.order.parts, this.partIdx, this.part);
      this.order.totalCost +=
        this.part.quantityOrdered * this.part.price -
        this.oldPart.quantityOrdered * this.oldPart.price;
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
