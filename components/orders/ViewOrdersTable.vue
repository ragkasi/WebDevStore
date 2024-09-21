<template>
  <div>
    <FehTableWrapping
      :all="orders"
      :shown="shownOrders"
      v-on:pagingChange="pagingChange"
      v-if="hasMounted"
    >
      <template v-slot:top-right>
        <div style="float: right" class="mt-1">
          <OrdersSearch v-on:update="update" :orders="orders" />
        </div>
      </template>
      <b-table
        id="orders-table"
        striped
        hover
        :items="shownOrders"
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
          <a :href="`/teams/${data.value}`" class="osu-link">
            {{ data.value }}
          </a>
        </template>

        <template #cell(status)="data">
          <b-badge v-if="data.item.hasParts" style="background-color: #ce0f3d"
            >Parts</b-badge
          >
          <span v-if="data.item.hasParts">&nbsp;</span>
          <b-badge v-if="data.item.hasPrinted" style="background-color: #ce0f3d"
            >3D Printing</b-badge
          >
          <span v-if="data.item.hasParts || data.item.hasPrinted">&nbsp;</span>
          <b-badge
            v-if="data.item.hasLaserCut"
            style="background-color: #ce0f3d"
            >Laser Cutting</b-badge
          >
        </template>

        <template #cell(totalCost)="data">
          {{
            Number(data.value).toLocaleString('us-US', {
              style: 'currency',
              currency: 'USD',
            })
          }}
        </template>
        <template #cell(actions)="data">
          <b-link :href="'/orders/' + data.item.id" class="osu-link">
            View Details
          </b-link>
        </template>
      </b-table>
    </FehTableWrapping>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import OrdersSearch from '../../components/orders/OrdersSearch.vue';
import FehTableWrapping from '../utils/FehTableWrapping.vue';

@Component({ components: { OrdersSearch, FehTableWrapping } })
export default class ViewOrdersTable extends Vue {
  @Prop(Array) orders!: Order[];
  @Prop() showStatus!: boolean;
  @Prop({ default: true }) showTeam!: boolean;
  @Prop() productFilter!: number;

  shownOrders: Order[] = [];

  hasMounted = false;
  paging = { per: 1, current: 1, total: 1 };
  pagingChange(incoming: Paging) {
    this.paging = incoming;
  }

  sortBy = 'dateSubmitted';
  sortDesc = true;
  fields = [
    { key: 'dateSubmitted', label: 'Date Submitted', sortable: true },
    { key: 'totalCost', label: 'Total', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  statusField = {
    key: 'status',
    label: 'Status',
    sortable: true,
    showStatus: true,
  };

  teamField = { key: 'team', label: 'Team', sortable: true };

  update(shownOrders: Order[]) {
    this.shownOrders = shownOrders;
  }

  mounted() {
    this.shownOrders = Array.from(this.orders);

    if (this.showStatus) {
      this.fields.splice(1, 0, this.statusField);
    }
    if (this.showTeam) {
      this.fields.splice(1, 0, this.teamField);
    }
    this.hasMounted = true;
  }

  @Watch('orders')
  onOrdersChanged() {
    this.shownOrders = Array.from(this.orders);
  }
}
</script>
