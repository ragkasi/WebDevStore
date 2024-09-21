<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error returning tool! <b>{{ failureReason }}</b> Try again later.
    </b-alert>

    <b-form @submit="onSubmit">
      <div show>
        Do you want to force return the tool
        <span class="font-weight-bold">{{ tool }}</span> on loan to
        <span class="font-weight-bold">{{ loan.teamName }}</span
        >? <br /><br />
      </div>

      <div style="float: right">
        <b-btn type="submit" variant="danger" :disabled="disableSubmit">
          Return Tool
        </b-btn>
      </div>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import loans from '../../api/loans';
@Component({})
export default class ForceReturnForm extends Vue {
  @Prop(Object) loan!: Loan;

  get tool() {
    return this.loan.isTool ? this.loan.Tool?.name : this.loan.Part?.name;
  }

  keycode = '';
  keycodeFailureReason = '';
  failureReason = '';

  validKeycode = false;

  showSuccess = false;
  showFailure = false;
  showKeycodeFailure = false;

  disableSubmit = false;

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.disableSubmit = true;
    loans.checkIn([this.loan.id]).then((res) => {
      if (res.data?.status == 'success') {
        this.showSuccess = true;
        this.$emit('update');
      } else {
        this.showFailure = true;
        this.failureReason = res.data?.reason;
      }
      this.disableSubmit = false;
    });
  }

  clearForm() {
    this.keycode = '';
  }
}
</script>
