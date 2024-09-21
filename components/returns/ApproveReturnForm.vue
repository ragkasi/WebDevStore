<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Approved Return.
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error returning part! <b>{{ failureReason }}</b> Try again later.
    </b-alert>

    <b-alert variant="danger" v-model="showKeycodeFailure" dismissible>
      Error with key code! {{ keycodeFailureReason }}
    </b-alert>

    <b-form @submit="onSubmit">
      <b-form-group id="input-group-key-code" label-for="input-part-key-code">
        <b-form-input
          id="input-part-key-code"
          v-model="keycode"
          placeholder="Keytag Number"
          :state="validKeycode"
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
        <b-btn type="submit" variant="danger" :disabled="!validKeycode">
          Approve Return
        </b-btn>
      </div>
    </b-form>
  </div>
</template>

<script lang="ts">
import returns from '@/api/returns';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import students from '../../api/students';
import { keycodeLength } from '../../utils/config';
@Component({})
export default class ApproveReturnForm extends Vue {
  @Prop() return!: Return;

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
    returns.checkReturnBelongs(this.return.id, this.keycode).then((res) => {
      if (res.data.belongs) {
        returns.returnOrder(this.return.id, true).then((res) => {
          if (res.data?.result == 'success') {
            this.showSuccess = true;
            this.return.status = 2;
          } else {
            this.showFailure = true;
            this.failureReason = res.data?.reason;
          }
        });
      }
    });
  }

  clearForm() {
    this.keycode = '';
  }
}
</script>
