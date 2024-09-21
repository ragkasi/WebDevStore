<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Return requested.
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Failed to request return! <b>{{ failureReason }}</b> Try again later.
    </b-alert>

    <b-alert show variant="secondary">
      <b>Important:</b> You will only be refunded 75% of the original purchase
      price for returns. Your return will not be accepted if the items are not
      returned in their original condition. Once you have submitted your return
      request, please bring the items to the store.
    </b-alert>

    <b-form @submit="onSubmit" v-if="part">
      <dl>
        <dt>Part Name</dt>
        <dd>{{ part.name }}</dd>
        <dt>Part Key</dt>
        <dd>{{ part.partKey }}</dd>
        <dt>Unit Price</dt>
        <dd>
          {{
            Number(part.price).toLocaleString('us-US', {
              style: 'currency',
              currency: 'USD',
            })
          }}
        </dd>
      </dl>
      <b-form-group
        id="input-group-part-quantity"
        label="Quantity"
        label-for="input-part-quantity"
      >
        <b-form-input
          id="input-part-quantity"
          :number="true"
          type="number"
          v-model="quantityToReturn"
          min="1"
          :max="part.quantityRemaining - part.quantityToReturn"
          step="1"
          required
        ></b-form-input>
      </b-form-group>
      <dl>
        <dt>Refund Amount</dt>
        <dd>
          {{
            Number(part.price * quantityToReturn * 0.75).toLocaleString(
              'us-US',
              {
                style: 'currency',
                currency: 'USD',
              },
            )
          }}
        </dd>
      </dl>
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
        <b-btn type="submit" variant="danger" :disabled="disableSubmit">
          Request Return
        </b-btn>
      </div>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import api from '../../api/returns';
@Component({})
export default class ReturnPartForm extends Vue {
  @Prop() order!: Order;
  @Prop() partIdx!: number;

  part: Part | null = null;
  quantityToReturn: number = 0;

  mounted() {
    this.part = this.order.parts[this.partIdx];
    this.quantityToReturn = this.part
      ? this.part.quantityRemaining - this.part.quantityToReturn
      : 0;
  }

  failureReason = '';

  showSuccess = false;
  showFailure = false;

  disableSubmit = false;

  onSubmit(evt: Event) {
    evt.preventDefault();
    if (this.order && this.part) {
      this.disableSubmit = true;
      api.requestReturn(this.part.id, this.quantityToReturn).then((res) => {
        if (res.data?.result == 'success') {
          this.showSuccess = true;
          setTimeout(() => {
            this.$emit('close');
          }, 1000);
        } else {
          this.showFailure = true;
          this.failureReason = res.data?.reason;
          this.disableSubmit = false;
        }
      });
    }
  }
}
</script>
