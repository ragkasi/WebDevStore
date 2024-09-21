<template>
  <div>
    <div v-if="!hasMounted" class="loader" />
    <p v-if="hasMounted && orders && orders.length === 0">
      <b>{{ noOrderMessage }}</b>
    </p>
    <p v-else-if="hasMounted && filteredOrdersCount == 0">
      <b>No orders of selected type</b>
    </p>
    <b-card v-else-if="hasMounted && filteredOrdersCount" no-body>
      <b-tabs>
        <b-tab
          v-if="rejected.length && !store"
          title-link-class="osu-link"
          @click="showRejected"
        >
          <template #title>
            Rejected
            <b-badge style="background-color: #ce0f3d">{{
              rejected.length
            }}</b-badge>
          </template>
          <ViewOrdersTable
            :orders="shownRejected"
            :productFilter="productFilter"
            :showStatus="false"
          ></ViewOrdersTable>
        </b-tab>
        <b-tab
          v-if="unapproved.length && (admin || student)"
          title-link-class="osu-link"
          @click="showUnapproved"
          active
        >
          <template #title>
            Unapproved
            <b-badge style="background-color: #ce0f3d">{{
              unapproved.length
            }}</b-badge>
          </template>
          <ViewOrdersTable
            :orders="shownUnapproved"
            :productFilter="productFilter"
            :showStatus="false"
          ></ViewOrdersTable>
        </b-tab>
        <b-tab
          v-if="unfilled.length"
          title-link-class="osu-link"
          @click="showUnfilled"
          active
        >
          <template #title>
            Unfilled
            <b-badge style="background-color: #ce0f3d">{{
              unfilled.length
            }}</b-badge>
          </template>
          <ViewOrdersTable
            :orders="shownUnfilled"
            :productFilter="productFilter"
            :showStatus="true"
          ></ViewOrdersTable>
        </b-tab>
        <b-tab
          v-if="inProgress.length"
          title-link-class="osu-link"
          @click="showInProgress"
          active
        >
          <template #title>
            In Progress
            <b-badge style="background-color: #ce0f3d">{{
              inProgress.length
            }}</b-badge>
          </template>
          <ViewOrdersTable
            :orders="shownInProgress"
            :productFilter="productFilter"
            :showStatus="true"
          ></ViewOrdersTable>
        </b-tab>
        <b-tab
          v-if="partial.length"
          title-link-class="osu-link"
          @click="showPartiallyFilled"
        >
          <template #title>
            Partially Filled
            <b-badge style="background-color: #ce0f3d">{{
              partial.length
            }}</b-badge>
          </template>
          <ViewOrdersTable
            :orders="shownPartial"
            :productFilter="productFilter"
            :showStatus="true"
          ></ViewOrdersTable>
        </b-tab>
        <b-tab
          v-if="ready.length"
          title-link-class="osu-link"
          @click="showReadyForPickup"
        >
          <template #title>
            Ready for Pickup
            <b-badge style="background-color: #ce0f3d">{{
              ready.length
            }}</b-badge>
          </template>
          <ViewOrdersTable
            :orders="shownReady"
            :productFilter="productFilter"
            :showStatus="false"
          ></ViewOrdersTable>
        </b-tab>
        <b-tab
          v-if="completed.length"
          title-link-class="osu-link"
          @click="showCompleted"
        >
          <template #title>
            Completed
            <b-badge style="background-color: #ce0f3d">{{
              completed.length
            }}</b-badge>
          </template>
          <ViewOrdersTable
            :orders="shownCompleted"
            :productFilter="productFilter"
            :showStatus="false"
          ></ViewOrdersTable>
        </b-tab>
        <b-tab
          v-if="requestedReturns.length && productFilter == -1"
          title-link-class="osu-link"
          @click="showRequestedReturns"
        >
          <template #title>
            Requested Returns
            <b-badge style="background-color: #ce0f3d">{{
              requestedReturns.length
            }}</b-badge>
          </template>
          <ViewReturnsTable :returns="shownRequestedReturns"></ViewReturnsTable>
        </b-tab>
        <b-tab
          v-if="approvedReturns.length && productFilter == -1"
          title-link-class="osu-link"
          @click="showApprovedReturns"
        >
          <template #title>
            Approved Returns
            <b-badge style="background-color: #ce0f3d">{{
              approvedReturns.length
            }}</b-badge>
          </template>
          <ViewReturnsTable :returns="shownApprovedReturns"></ViewReturnsTable>
        </b-tab>
      </b-tabs>
    </b-card>
    <hr />
    <div v-if="admin" style="float: right">
      <b-button-group style="float: right; display: flex">
        <b-button v-b-modal.deleteOld variant="danger">Clear Old Orders</b-button>
      </b-button-group>
    </div>
    <b-modal
      id="deleteOld"
      ref="deleteOld"
      title="Delete Old Orders"
      hide-footer
    >
      <DeleteOldOrderForm
        :order="order"
        :value="value"
        v-on:close="
          () => {
            this.$refs['deleteOld'].hide();
          }
        "
      ></DeleteOldOrderForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import orders from '../../api/orders';
import returns from '../../api/returns';
import ViewOrdersTable from './ViewOrdersTable.vue';
import ViewReturnsTable from '../returns/ViewReturnsTable.vue';
import roles from '../../shared/roles';
import DeleteOldOrderForm from '../../components/orders/DeleteOldOrderForm.vue';

@Component({ components: { ViewOrdersTable, ViewReturnsTable, DeleteOldOrderForm } })
export default class ViewOrdersContainer extends Vue {
  @Prop() productFilter!: number;

  hasMounted = false;

  noOrderMessage = '';

  rejected: Order[] = [];
  shownRejected: Order[] = [];

  orders: Order[] = [];

  unapproved: Order[] = [];
  shownUnapproved: Order[] = [];

  unfilled: Order[] = [];
  shownUnfilled: Order[] = [];

  inProgress: Order[] = [];
  shownInProgress: Order[] = [];

  partial: Order[] = [];
  shownPartial: Order[] = [];

  ready: Order[] = [];
  shownReady: Order[] = [];

  completed: Order[] = [];
  shownCompleted: Order[] = [];

  returns: Return[] = [];

  requestedReturns: Return[] = [];
  shownRequestedReturns: Return[] = [];

  approvedReturns: Return[] = [];
  shownApprovedReturns: Return[] = [];

  filteredOrdersCount = 0;

  get teamName() {
    return roles.teamName;
  }

  get store() {
    return roles.store;
  }

  get admin() {
    return roles.admin;
  }

  get student() {
    return roles.student;
  }

  @Watch('productFilter')
  onProductFilterChanged() {
    this.initializeOrderTables();
  }

  showRejected() {
    const newShownOrders: Order[] = [];
    this.orders.forEach((elem: Order) => {
      if (elem.approved == false) {
        if (
          this.productFilter == -1 ||
          (elem.hasPrinted && this.productFilter == 0) ||
          (elem.hasLaserCut && this.productFilter == 1)
        ) {
          newShownOrders.push(elem);
        }
      }
    });
    this.rejected = newShownOrders;
    this.shownRejected = newShownOrders;
    this.filteredOrdersCount += newShownOrders.length;
  }

  showUnapproved() {
    const newShownOrders: Order[] = [];
    this.orders.forEach((elem: Order) => {
      if (elem.approved == null) {
        if (
          this.productFilter == -1 ||
          (elem.hasPrinted && this.productFilter == 0) ||
          (elem.hasLaserCut && this.productFilter == 1)
        ) {
          newShownOrders.push(elem);
        }
      }
    });
    this.unapproved = newShownOrders;
    this.shownUnapproved = newShownOrders;
    this.filteredOrdersCount += newShownOrders.length;
  }

  showUnfilled() {
    const newShownOrders: Order[] = [];
    this.orders.forEach((elem: Order) => {
      if (elem.approved && elem.statuses.includes('Placed')) {
        if (
          this.productFilter == -1 ||
          (elem.hasPrinted && this.productFilter == 0) ||
          (elem.hasLaserCut && this.productFilter == 1)
        ) {
          newShownOrders.push(elem);
        }
      }
    });
    this.unfilled = newShownOrders;
    this.shownUnfilled = newShownOrders;
    this.filteredOrdersCount += newShownOrders.length;
  }

  showInProgress() {
    const newShownOrders: Order[] = [];
    this.orders.forEach((elem: Order) => {
      if (elem.approved && elem.statuses.includes('In Progress')) {
        if (
          this.productFilter == -1 ||
          (elem.hasPrinted && this.productFilter == 0) ||
          (elem.hasLaserCut && this.productFilter == 1)
        ) {
          newShownOrders.push(elem);
        }
      }
    });
    this.inProgress = newShownOrders;
    this.shownInProgress = newShownOrders;
    this.filteredOrdersCount += newShownOrders.length;
  }

  showPartiallyFilled() {
    const newShownOrders: Order[] = [];
    this.orders.forEach((elem: Order) => {
      if (elem.statuses.includes('Partially filled')) {
        if (
          this.productFilter == -1 ||
          (elem.hasPrinted && this.productFilter == 0) ||
          (elem.hasLaserCut && this.productFilter == 1)
        ) {
          newShownOrders.push(elem);
        }
      }
    });
    this.partial = newShownOrders;
    this.shownPartial = newShownOrders;
    this.filteredOrdersCount += newShownOrders.length;
  }

  showReadyForPickup() {
    const newShownOrders: Order[] = [];
    this.orders.forEach((elem: Order) => {
      if (elem.statuses.includes('Filled')) {
        if (
          this.productFilter == -1 ||
          (elem.hasPrinted && this.productFilter == 0) ||
          (elem.hasLaserCut && this.productFilter == 1)
        ) {
          newShownOrders.push(elem);
        }
      }
    });
    this.ready = newShownOrders;
    this.shownReady = newShownOrders;
    this.filteredOrdersCount += newShownOrders.length;
  }

  showCompleted() {
    const newShownOrders: Order[] = [];
    this.orders.forEach((elem: Order) => {
      if (elem.approved && elem.statuses.includes('Picked up')) {
        if (
          this.productFilter == -1 ||
          (elem.hasPrinted && this.productFilter == 0) ||
          (elem.hasLaserCut && this.productFilter == 1)
        ) {
          newShownOrders.push(elem);
        }
      }
    });
    this.completed = newShownOrders;
    this.shownCompleted = newShownOrders;
    this.filteredOrdersCount += newShownOrders.length;
  }

  showRequestedReturns() {
    const newShownReturns: Return[] = [];
    this.returns.forEach((elem: Return) => {
      if (elem.status == 0) {
        newShownReturns.push(elem);
      }
    });
    this.requestedReturns = newShownReturns;
    this.shownRequestedReturns = newShownReturns;
  }

  showApprovedReturns() {
    const newShownReturns: Return[] = [];
    this.returns.forEach((elem: Return) => {
      if (elem.status == 2) {
        newShownReturns.push(elem);
      }
    });
    this.approvedReturns = newShownReturns;
    this.shownApprovedReturns = newShownReturns;
  }

  initializeOrderTables() {
    this.filteredOrdersCount = 0;
    if (!this.store) {
      this.showRejected();
    }
    if (this.admin || this.student) {
      this.showUnapproved();
    }
    this.showUnfilled();
    this.showInProgress();
    this.showPartiallyFilled();
    this.showReadyForPickup();
    this.showCompleted();
  }

  initializeReturnTables() {
    this.showRequestedReturns();
    this.showApprovedReturns();
  }

  mounted() {
    if (window.location.pathname == '/orders/team') {
      Promise.all([
        orders.getOrders().then((res) => {
          if (res.status === 402) {
            this.$router.push('/overdue');
            return;
          }
          if (res) {
            this.orders = res.data;
          }
          this.initializeOrderTables();
          this.noOrderMessage = "Your team hasn't placed any orders.";
        }),
        returns.getReturns().then((res) => {
          if (res) {
            this.returns = res.data;
          }
          this.initializeReturnTables();
        }),
      ]).then(() => {
        this.hasMounted = true;
      });
    } else if (window.location.pathname == '/orders/all') {
      if (roles.student) {
        this.$router.push('/forbidden');
        return;
      }
      Promise.all([
        orders.getAllOrders().then((res) => {
          if (res) {
            this.orders = res.data;
          }
          this.initializeOrderTables();
          this.noOrderMessage = 'No orders have been placed.';
        }),
        returns.getAllReturns().then((res) => {
          if (res) {
            this.returns = res.data;
          }
          this.initializeReturnTables();
        }),
      ]).then(() => {
        this.hasMounted = true;
      });
    }
  }
}
</script>
