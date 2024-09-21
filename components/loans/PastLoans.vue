<template>
  <div class="mt-2">
    <FehTableWrapping
      :all="pastLoans"
      :shown="shownPastLoans"
      v-on:pagingChange="pagingChange"
      v-if="hasMounted"
    >
      <template v-slot:top-right>
        <div style="float: right">
          <LoansSearch v-on:update="update" :loans="pastLoans" />
        </div>
      </template>
      <b-table
        id="past-loans-table"
        striped
        hover
        :items="shownPastLoans"
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

        <template #cell(checkInTime)="data">
          {{ new Date(data.value).toLocaleString() }}
        </template>

        <template #cell(teamName)="data">
          {{ data.value }}
        </template>
      </b-table>
    </FehTableWrapping>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LoansSearch from './LoansSearch.vue';
import FehTableWrapping from '../utils/FehTableWrapping.vue';

@Component({
  components: { LoansSearch, FehTableWrapping },
})
export default class PastLoans extends Vue {
  @Prop(Array) pastLoans!: Loan[];
  shownPastLoans: Loan[] = [];

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
    { key: 'checkInTime', label: 'Checked In', sortable: true },
    { key: 'teamName', label: 'Team', sortable: true },
  ];

  update(shownPastLoans: Loan[]) {
    this.shownPastLoans = shownPastLoans;
  }

  mounted() {
    this.shownPastLoans = Array.from(this.pastLoans);
    this.hasMounted = true;
  }
}
</script>
