<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error reporting found loan! Try again later.
    </b-alert>
    <b-form @submit="onSubmit">
      <div show>
        Do you want to mark the tool
        <span class="font-weight-bold">{{ lostTool }}</span> on loan to
        <span class="font-weight-bold">{{ loan.teamName }}</span> as found?
        <br /><br />This will mark the loan as complete (returned), and the tool
        quantity available for borrowing will be incremented by one.
      </div>
      <br />

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Report Found
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import loans from '../../api/loans';

@Component({})
export default class ReportFoundLoanForm extends Vue {
  @Prop(Object) loan!: Loan;

  showFailure = false;
  disableSubmit = false;

  get lostTool() {
    return this.loan.isTool ? this.loan.Tool?.name : this.loan.Part?.name;
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.showFailure = false;
    this.disableSubmit = true;

    loans.reportFoundLoan(this.loan.id).then((data) => {
      if (data.success) {
        this.$emit('update-success');
      } else {
        this.showFailure = true;
      }
      this.disableSubmit = false;
    });
  }
}
</script>
