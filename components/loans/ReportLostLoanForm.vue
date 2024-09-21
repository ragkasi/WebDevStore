<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error reporting lost loan! Try again later.
    </b-alert>
    <b-form @submit="onSubmit">
      <div show>
        Do you want to mark the tool
        <span class="font-weight-bold">{{ lostTool }}</span> on loan to
        <span class="font-weight-bold">{{ loan.teamName }}</span> as lost?
        <br /><br />This will prevent the team members from being locked out.
        You can charge the team for losing the tool on that team's page.
        Additionally, the tool quantity available for borrowing will be
        decremented by one.
      </div>
      <br />

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Report Lost
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import loans from '../../api/loans';

@Component({})
export default class ReportLostLoanForm extends Vue {
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

    loans.reportLostLoan(this.loan.id).then((data) => {
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
