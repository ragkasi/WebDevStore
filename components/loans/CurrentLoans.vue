<template>
  <div>
    <div class="mt-2">
      <FehTableWrapping
        :all="currentLoans"
        :shown="shownCurrentLoans"
        v-on:pagingChange="pagingChange"
        v-if="hasMounted"
      >
        <template v-slot:top-right>
          <div style="float: right">
            <LoansSearch v-on:update="update" :loans="currentLoans" />
          </div>
        </template>
        <b-table
          id="current-loans-table"
          striped
          hover
          :items="shownCurrentLoans"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :current-page="paging.current"
          :per-page="paging.per"
          responsive="sm"
        >
          <template #cell(item)="data">
            {{ data.value }}
          </template>

          <template #cell(checkOutTime)="data">
            {{ new Date(data.value).toLocaleString() }}
            <b-badge
              v-if="checkoutTimeOverdue(new Date(data.value))"
              class="badge"
              variant="danger"
              >Overdue</b-badge
            >
          </template>

          <template #cell(teamName)="data">
            {{ data.value }}
          </template>

          <template #cell(actions)="data">
            <b-button
              variant="danger"
              @click="forceReturnLoan = data.item"
              v-b-modal.force-return-modal
              >Force Return</b-button
            >
            &nbsp;
            <b-button
              variant="danger"
              @click="lostLoan = data.item"
              v-b-modal.lost-loan-modal
              >Tool Lost</b-button
            >
          </template>
        </b-table>
      </FehTableWrapping>
    </div>

    <b-modal id="lost-loan-modal" title="Lost Loan" hide-footer>
      <ReportLostLoanForm
        :loan="lostLoan"
        v-on:update-success="loanReportedAsLostSuccess"
      ></ReportLostLoanForm>
    </b-modal>

    <b-modal id="force-return-modal" title="Force Return Loan" hide-footer>
      <ForceReturnForm
        :loan="forceReturnLoan"
        v-on:update="loanForceReturnedSuccess"
      ></ForceReturnForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { successToast } from '../../utils/genericUtils';
import { Component, Prop, Vue } from 'vue-property-decorator';
import LoansSearch from './LoansSearch.vue';
import ReportLostLoanForm from './ReportLostLoanForm.vue';
import ForceReturnForm from './ForceReturnForm.vue';
import FehTableWrapping from '../utils/FehTableWrapping.vue';

@Component({
  components: {
    LoansSearch,
    ReportLostLoanForm,
    ForceReturnForm,
    FehTableWrapping,
  },
})
export default class CurrentLoans extends Vue {
  @Prop(Array) currentLoans!: Loan[];
  shownCurrentLoans: Loan[] = [];
  lostLoan: Loan | null = null;
  forceReturnLoan: Loan | null = null;

  hasMounted = false;
  paging = { per: 1, current: 1, total: 1 };
  pagingChange(incoming: Paging) {
    this.paging = incoming;
  }

  sortBy = 'checkOutTime';
  sortDesc = true;
  fields = [
    { key: 'item', label: 'Item', sortable: true },
    { key: 'description', label: 'Item Description', sortable: true },
    { key: 'checkOutTime', label: 'Checked Out', sortable: true },
    { key: 'teamName', label: 'Team', sortable: true },
    { key: 'actions', label: '', sortable: false },
  ];

  showReportedLostSuccess = false;

  update(shownCurrentLoans: Loan[]) {
    this.shownCurrentLoans = shownCurrentLoans;
  }

  mounted() {
    this.shownCurrentLoans = Array.from(this.currentLoans);
    this.hasMounted = true;
  }

  checkoutTimeOverdue(checkoutTime: Date) {
    return (Date.now() - checkoutTime.getTime()) / 36e5 > 1;
  }

  loanReportedAsLostSuccess() {
    successToast(this, 'Successfully marked loan as lost.');
    this.$bvModal.hide('lost-loan-modal');
    this.$emit('update');
  }

  loanForceReturnedSuccess() {
    successToast(this, 'Successfully force returned loan.');
    this.$bvModal.hide('force-return-modal');
    this.$emit('update');
  }
}
</script>
