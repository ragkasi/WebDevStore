<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Deleted Order
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error deleting order! <b>{{ failureReason }}</b> Try again later.
    </b-alert>
    <b-form @submit="onSubmit">
      <p>Are you sure you want to delete this order?</p>
      <b-form-group style="float: right">
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
        <b-btn type="submit" variant="danger" :disabled="disableSubmit">
          Delete
        </b-btn>
      </b-form-group>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import api from '../../api/orders';
@Component({})
export default class RejectOrderForm extends Vue {
  @Prop() order!: Order;

  showSuccess = false;
  showFailure = false;
  disableSubmit = false;

  failureReason = '';

  onSubmit(evt: Event) {
    evt.preventDefault();
    api.deleteOrder(this.order.id).then((res) => {
      if (res.data?.status == 'success') {
        this.showSuccess = true;
        this.disableSubmit = true;
        setTimeout(() => {
          this.$router.push('/orders/all').catch(() => {});
        }, 1000);
      } else {
        this.showFailure = true;
        this.failureReason = res.data?.reason;
      }
    });
  }
}
</script>
