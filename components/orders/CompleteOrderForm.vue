<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Completed Order.
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error completing order! <b>{{ failureReason }}</b> Try again later.
    </b-alert>

    <b-alert variant="danger" v-model="showKeycodeFailure" dismissible>
      Error with key code! {{ keycodeFailureReason }}
    </b-alert>

    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-key-code"
        label-for="input-part-key-code"
        class="mt-1"
      >
        <b-form-input
          id="input-part-key-code"
          v-model="keycode"
          placeholder="Keytag Number"
          :state="validKeycode"
          required
          autofocus
        ></b-form-input>
      </b-form-group>
      <b-row>
        <b-col style="m-4">
          <b-btn @click="fillMostRecentTeam">Most Recent Team</b-btn>
        </b-col>
        <b-col>
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
            <b-btn type="submit" variant="danger" :disabled="!validKeycode">
              Complete
            </b-btn>
          </div>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import orders from '../../api/orders';
import students from '../../api/students';
import {
  getMostRecentKeycode,
  setMostRecentKeycode,
} from '../../utils/genericUtils';
import { keycodeLength } from '../../utils/config';

@Component({})
export default class ReturnForm extends Vue {
  @Prop() order!: Order;

  keycode = '';
  keycodeFailureReason = '';
  failureReason = '';

  validKeycode = false;

  showSuccess = false;
  showFailure = false;
  showKeycodeFailure = false;

  @Watch('keycode')
  onKeycodeChanged(val: string) {
    this.validKeycode = false;
    if (val.length == keycodeLength && Number.isInteger(Number(val))) {
      students.checkKeycode(val).then((res) => {
        if (res.data?.status == 'success') {
          this.validKeycode = true;
          this.showKeycodeFailure = false;
          this.keycodeFailureReason = '';
        }
      });
    } else if (val.length > 0) {
      this.showKeycodeFailure = true;
      this.keycodeFailureReason = `Keycodes are integers with ${keycodeLength} digits.`;
    } else {
      this.showKeycodeFailure = false;
      this.keycodeFailureReason = '';
    }
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    if (this.order) {
      orders.checkOrderBelongs(this.order.id, this.keycode).then((res) => {
        if (res.data?.result == 'success') {
          if (res.data.belongs) {
            orders.updateOrder(this.order.id, this.order).then(() => {
              setMostRecentKeycode(this.keycode);
              this.showSuccess = true;
              setTimeout(() => {
                this.$router.push('/orders/all').catch(() => {});
              }, 1000);
            });
          } else {
            this.showFailure = true;
            this.failureReason = `This order belongs to ${this.order.team}, but the user is on ${res.data?.team}.`;
          }
        } else {
          this.showFailure = true;
          this.failureReason = res.data.reason;
        }
      });
    }
  }

  clearForm() {
    this.keycode = '';
  }

  fillMostRecentTeam() {
    this.keycode = getMostRecentKeycode();
  }
}
</script>
