<template>
  <div class="mt-2">
    <FehTableWrapping
      :all="lowParts"
      :shown="shownLowParts"
      v-on:pagingChange="pagingChange"
      v-if="hasMounted"
    >
      <template v-slot:top-right>
        <div style="float: right">
          <LowPartsSearch v-on:update="update" :lowParts="lowParts" />
        </div>
      </template>
      <b-table
        id="current-loans-table"
        striped
        hover
        :items="shownLowParts"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :current-page="paging.current"
        :per-page="paging.per"
        responsive="sm"
      >
        <template #cell(name)="data">
          <h5 style="margin: 0px">{{ data.item.name }}</h5>
          <small style="color: #666666">{{ data.item.partKey }}</small>
        </template>

        <template #cell(quantity)="data">
          {{ data.value }}
        </template>

        <template #cell(reorderThreshold)="data">
          {{ data.value }}
        </template>

        <template #cell(vendorName)="data">
          {{ data.value }}
        </template>

        <template #cell(actions)="data">
          <b-link :href="'/parts/edit/' + data.item.id" class="osu-link"
            >Edit Part</b-link
          >
        </template>
      </b-table>
    </FehTableWrapping>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LowPartsSearch from './LowPartsSearch.vue';
import FehTableWrapping from '../utils/FehTableWrapping.vue';

@Component({
  components: { LowPartsSearch, FehTableWrapping },
})
export default class LowPartsTable extends Vue {
  @Prop(Array) lowParts!: Part[];
  shownLowParts: Part[] = [];

  hasMounted = false;
  paging = { per: 1, current: 1, total: 1 };
  pagingChange(incoming: Paging) {
    this.paging = incoming;
  }

  sortBy = 'name';
  sortDesc = false;
  fields = [
    {
      key: 'name',
      label: 'Part Name',
      sortable: true,
    },
    {
      key: 'quantity',
      label: 'Number In Stock',
      sortable: true,
      thStyle: { width: '10%' },
    },
    {
      key: 'reorderThreshold',
      label: 'Reorder Threshold',
      sortable: true,
      thStyle: { width: '10%' },
    },
    {
      key: 'vendorName',
      label: 'Vendor',
      sortable: true,
      thStyle: { width: '20%' },
    },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  update(shownLowParts: Part[]) {
    this.shownLowParts = shownLowParts;
  }

  mounted() {
    this.shownLowParts = Array.from(this.lowParts);
    this.hasMounted = true;
  }
}
</script>
