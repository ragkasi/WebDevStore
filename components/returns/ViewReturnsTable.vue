<template>
  <FehTableWrapping
    :all="returns"
    :shown="shownReturns"
    v-on:pagingChange="pagingChange"
    v-if="hasMounted"
  >
    <template v-slot:top-right>
      <div style="float: right">
        <ReturnPartsSearch v-on:update="update" :returns="returns" />
      </div>
    </template>
    <b-table
      id="returns-table"
      striped
      hover
      :items="shownReturns"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :current-page="paging.current"
      :per-page="paging.per"
      responsive="sm"
    >
      <template #cell(dateSubmitted)="data">
        {{ new Date(data.value).toLocaleString() }}
      </template>

      <template #cell(team)="data">
        {{ data.value }}
      </template>

      <template #cell(totalRefund)="data">
        {{
          Number(-1 * data.value).toLocaleString('us-US', {
            style: 'currency',
            currency: 'USD',
          })
        }}
      </template>
      <template #cell(actions)="data">
        <b-link :href="'/returns/' + data.item.id" style="color: #ce0f3d">
          View Details
        </b-link>
      </template>
    </b-table>
  </FehTableWrapping>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ReturnPartsSearch from './ReturnPartsSearch.vue';
import FehTableWrapping from '../utils/FehTableWrapping.vue';

@Component({
  components: {
    ReturnPartsSearch,
    FehTableWrapping,
  },
})
export default class ViewReturnsTable extends Vue {
  @Prop(Array) returns!: Return[];
  @Prop() showStatus!: boolean;

  shownReturns: Return[] = [];

  hasMounted = false;
  paging = { per: 1, current: 1, total: 1 };
  pagingChange(incoming: Paging) {
    this.paging = incoming;
  }

  sortBy = 'dateSubmitted';
  sortDesc = false;
  fields = [
    { key: 'dateSubmitted', label: 'Date Submitted', sortable: true },
    { key: 'team', label: 'Team', sortable: true },
    { key: 'totalRefund', label: 'Total', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  update(shownReturns: Return[]) {
    this.shownReturns = shownReturns;
  }

  mounted() {
    this.shownReturns = Array.from(this.returns);
    this.hasMounted = true;
  }
}
</script>
