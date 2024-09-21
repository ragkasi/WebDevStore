<template>
  <FehTableWrapping
    :all="parts"
    :shown="shownParts"
    v-on:pagingChange="pagingChange"
    v-if="hasMounted"
  >
    <template v-slot:top-right>
      <div style="float: right">
        <OrderedPartsSearch v-on:update="update" :parts="parts" />
      </div>
    </template>
    <b-table
      id="parts-table"
      striped
      hover
      :items="shownParts"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :current-page="paging.current"
      :per-page="paging.per"
      :sort-compare="sortCompare"
      responsive="sm"
    >
      <template #cell(date)="data">
        <a :href="'/orders/' + data.item.data.orderId" class="osu-link">
          {{ new Date(data.item.data.dateSubmitted).toLocaleString() }}
        </a>
      </template>

      <template #cell(price)="data">
        {{
          Number(data.value).toLocaleString('us-US', {
            style: 'currency',
            currency: 'USD',
          })
        }}
      </template>

      <template #cell(totalCost)="data">
        {{
          Number(
            Number(data.item.quantityOrdered) * Number(data.item.price),
          ).toLocaleString('us-US', {
            style: 'currency',
            currency: 'USD',
          })
        }}
      </template>

      <template #cell(returned)="data">
        {{ data.item.quantityOrdered - data.item.quantityRemaining }}
      </template>
    </b-table>
  </FehTableWrapping>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import OrderedPartsSearch from './OrderedPartsSearch.vue';
import FehTableWrapping from '../utils/FehTableWrapping.vue';

@Component({ components: { OrderedPartsSearch, FehTableWrapping } })
export default class ViewOrderedPartsTable extends Vue {
  @Prop(Array) orders!: Order[];

  parts: Part[] = [];
  shownParts: Part[] = [];

  hasMounted = false;
  paging = { per: 1, current: 1, total: 1 };
  pagingChange(incoming: Paging) {
    this.paging = incoming;
  }

  sortBy = 'date';
  sortDesc = false;
  fields = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'name', label: 'Part', sortable: true },
    { key: 'partKey', label: 'Part Number', sortable: true },
    { key: 'quantityOrdered', label: 'Quantity', sortable: true },
    { key: 'price', label: 'Unit Price', sortable: true },
    { key: 'totalCost', label: 'Total', sortable: true },
    { key: 'returned', label: 'Returned', sortable: true },
  ];

  teamField = { key: 'team', label: 'Team', sortable: true };

  update(shownParts: Part[]) {
    this.shownParts = shownParts;
  }

  mounted() {
    this.getPartsFromOrders();
    this.shownParts = this.parts;
    this.hasMounted = true;
  }

  getPartsFromOrders() {
    this.parts = [];
    this.orders.forEach((order) => {
      this.parts = this.parts.concat(order.parts);
    });
  }

  @Watch('orders')
  onOrdersChanged() {
    this.getPartsFromOrders();
    this.shownParts = this.parts;
  }

  sortCompare(a: Part, b: Part, key: string) {
    if (key === 'date') {
      return a.data.dateSubmitted > b.data.dateSubmitted ? -1 : 1;
    } else if (key == 'totalCost') {
      return a.quantityOrdered * a.price - b.quantityOrdered * b.price;
    } else if (key == 'returned') {
      return (
        a.quantityOrdered -
        a.quantityRemaining -
        (b.quantityOrdered - b.quantityRemaining)
      );
    }
  }
}
</script>
