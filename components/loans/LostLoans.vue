<template>
  <div>
    <b-alert variant="success" v-model="showReportedFoundSuccess" dismissible>
      Loan reported as found.
    </b-alert>

    <div class="mt-2">
      <FehTableWrapping
        :all="lostLoans"
        :shown="shownLostLoans"
        v-on:pagingChange="pagingChange"
        v-if="hasMounted"
      >
        <template v-slot:top-right>
          <div style="float: right">
            <LoansSearch v-on:update="update" :loans="lostLoans" />
          </div>
        </template>
        <b-table
          id="lost-loans-table"
          striped
          hover
          :items="shownLostLoans"
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
          </template>

          <template #cell(teamName)="data">
            {{ data.value }}
          </template>

          <template #cell(actions)="data">
            <b-button
              variant="danger"
              @click="foundLoan = data.item"
              v-b-modal.found-loan-modal
              >Tool Found</b-button
            >
          </template>
        </b-table>
      </FehTableWrapping>
    </div>

    <b-modal id="found-loan-modal" title="Found Loan" hide-footer>
      <ReportFoundLoanForm
        :loan="foundLoan"
        v-on:update-success="loanReportedAsFoundSuccess"
      ></ReportFoundLoanForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LoansSearch from './LoansSearch.vue';
import ReportFoundLoanForm from './ReportFoundLoanForm.vue';
import FehTableWrapping from '../utils/FehTableWrapping.vue';

@Component({
  components: { LoansSearch, ReportFoundLoanForm, FehTableWrapping },
})
export default class LostLoans extends Vue {
  @Prop(Array) lostLoans!: Loan[];
  shownLostLoans: Loan[] = [];
  foundLoan: Loan[] | null = null;

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

  showReportedFoundSuccess = false;

  update(shownLostLoans: Loan[]) {
    this.shownLostLoans = shownLostLoans;
  }

  mounted() {
    this.shownLostLoans = Array.from(this.lostLoans);
    this.hasMounted = true;
  }

  loanReportedAsFoundSuccess() {
    this.$bvModal.hide('found-loan-modal');
    this.$emit('update');
    this.showReportedFoundSuccess = true;
  }
}
</script>
