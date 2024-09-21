<template>
  <div>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Orders" active title-link-class="osu-link">
          <ViewOrdersTable
            :orders="orders"
            :showStatus="false"
            :showTeam="false"
          ></ViewOrdersTable>
        </b-tab>
        <b-tab title="Parts" title-link-class="osu-link">
          <ViewOrderedPartsTable :orders="orders"></ViewOrderedPartsTable>
        </b-tab>
        <b-tab title="Charges" title-link-class="osu-link">
          <Charges :teamId="teamId" v-on:update="update"></Charges>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Charges from '../charges/Charges.vue';
import ViewOrdersTable from '../orders/ViewOrdersTable.vue';
import ViewOrderedPartsTable from '../orders/ViewOrderedPartsTable.vue';
import orders from '../../api/orders';
import roles from '../../shared/roles';

@Component({
  components: {
    Charges,
    ViewOrdersTable,
    ViewOrderedPartsTable,
  },
})
export default class TeamBudgetInformation extends Vue {
  @Prop(String) teamId!: string;
  showFailure = false;

  orders: Order[] = [];

  get admin() {
    return roles.admin;
  }

  get store() {
    return roles.store;
  }

  mounted() {
    orders.getOrdersByTeam(this.teamId).then((res) => {
      if (res.success) {
        const allOrders: Order[] = res.data;

        this.orders = allOrders.filter((order) => {
          return order.approved !== false;
        });
      }
    });
  }

  update() {
    this.$emit('update');
  }
}
</script>
