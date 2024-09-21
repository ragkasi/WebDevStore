<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error updating order! Try again later.
    </b-alert>
    <div v-if="!order || !gotApprovalStatus" class="loader" />
    <div v-else>
      <h2>Order Details</h2>
      <hr />
      <b-link :href="redirectPage" style="color: #ce0f3d">
        Back to Orders
      </b-link>
      <hr />
      <div v-if="order.approved == null && admin">
        <b-button v-b-modal.approveOrderModal variant="danger"
          >Approve This Order</b-button
        >
        <span>&ensp;</span>
        <b-button v-b-modal.rejectModal variant="danger"
          >Reject This Order</b-button
        >
        <span>&ensp;</span>
        <b-button v-b-modal.approveTeamModal variant="danger"
          >Approve Team For All Future Orders</b-button
        >
        <hr />
      </div>
      <div v-else-if="admin || store" style="float: right">
        <b-button v-b-modal.deleteOrderModal variant="danger"
          ><i class="fa fa-trash"
        /></b-button>
        <span>&ensp;</span>
        <b-button v-if="order.approved" @click="updateOrder()" variant="danger"
          >Update Order</b-button
        >
      </div>
      <dl>
        <dt>Time Placed</dt>
        <dd>{{ new Date(order.dateSubmitted).toLocaleString() }}</dd>
        <dt>Placed By</dt>
        <dd>{{ order.student }}</dd>
        <dt>Total Cost</dt>
        <dd>
          {{
            Number(totalCost).toLocaleString('us-US', {
              style: 'currency',
              currency: 'USD',
            })
          }}
        </dd>
        <dt>Team</dt>
        <dd>
          <a :href="`/teams/${order.team}`" class="osu-link">
            {{ order.team }}
          </a>
        </dd>
        <dt>Status</dt>
        <dd>{{ getStatusMessage() }}</dd>
      </dl>
      <hr />
      <b-table
        id="orders-table"
        striped
        hover
        v-if="parts.length"
        :items="parts"
        :fields="relevantFields()"
        responsive="sm"
      >
        <template #cell(name)="data">
          <h5 style="margin: 0px">{{ data.item.name }}</h5>
          <small style="color: #666666">{{ data.item.partKey }}</small>
        </template>

        <template #cell(price)="data">
          {{
            Number(data.value).toLocaleString('us-US', {
              style: 'currency',
              currency: 'USD',
            })
          }}
        </template>

        <template #cell(quantityOrdered)="data">
          {{ data.value }}
        </template>

        <template #cell(subtotal)="data">
          {{
            Number(data.item.price * data.item.quantityOrdered).toLocaleString(
              'us-US',
              {
                style: 'currency',
                currency: 'USD',
              },
            )
          }}
        </template>

        <template #cell(status)="data">
          <span v-if="student">{{
            getStatusString(data.item.data.status)
          }}</span>
          <b-button-group v-else>
            <b-button
              @click="
                () => {
                  data.item.data.status = 0;
                }
              "
              :pressed="data.item.data.status == 0"
              variant="outline-danger"
              size="sm"
              >Placed</b-button
            >
            <b-button
              @click="
                () => {
                  data.item.data.status = 1;
                }
              "
              :pressed="data.item.data.status == 1"
              variant="outline-danger"
              size="sm"
              >Filled</b-button
            >
            <b-button
              @click="
                () => {
                  data.item.data.status = 2;
                }
              "
              :pressed="data.item.data.status == 2"
              variant="outline-danger"
              size="sm"
              >Picked Up</b-button
            >
          </b-button-group>
        </template>

        <template #cell(actions)="data">
          <div v-if="admin || store">
            <b-button
              class="button"
              variant="danger"
              style="padding: 3px 6px"
              @click="removePart(data.index)"
            >
              <i class="fa fa-trash" />
            </b-button>
            <span>&ensp;</span>
            <b-button
              class="button"
              variant="danger"
              style="padding: 3px 6px"
              @click="showEditPartModal(data.index)"
            >
              <i class="fa fa-edit" />
            </b-button>
          </div>
          <b-button
            v-else-if="
              student &&
              data.item.canReturn &&
              data.item.quantityRemaining != 0 &&
              data.item.quantityRemaining != data.item.quantityToReturn
            "
            variant="danger"
            @click="showReturnPartModal(data.index)"
            >Return Item(s)</b-button
          >
        </template>
      </b-table>

      <b-row v-if="order.products.length != 0">
        <b-col md="12">
          <PRProducts
            v-if="printed.length"
            :products="printed"
            :inCart="false"
            :order="order"
            v-on:removeAll="removeAllOfService"
            v-on:removeOne="removePrinted"
            v-on:update="refresh"
          ></PRProducts>
          <LCProducts
            v-if="lasercut.length"
            :products="lasercut"
            :inCart="false"
            :order="order"
            v-on:removeAll="removeAllOfService"
            v-on:removeOne="removeLasercut"
            v-on:update="refresh"
          ></LCProducts>
        </b-col>
      </b-row>
    </div>
    <b-modal
      id="approveOrderModal"
      ref="approveOrderModal"
      title="Approve Order"
      hide-footer
    >
      <ApproveOrderForm
        :order="order"
        v-on:close="
          () => {
            this.$refs['approveOrderModal'].hide();
          }
        "
      ></ApproveOrderForm>
    </b-modal>
    <b-modal
      id="rejectModal"
      ref="rejectModal"
      title="Reject Order"
      hide-footer
    >
      <RejectOrderForm
        :order="order"
        v-on:close="
          () => {
            this.$refs['rejectModal'].hide();
          }
        "
      ></RejectOrderForm>
    </b-modal>
    <b-modal
      id="approveTeamModal"
      ref="approveTeamModal"
      title="Approve Order and Team"
      hide-footer
    >
      <ApproveTeamForm
        :order="order"
        v-on:close="
          () => {
            this.$refs['approveTeamModal'].hide();
          }
        "
      ></ApproveTeamForm>
    </b-modal>
    <b-modal
      id="deleteOrderModal"
      ref="deleteOrderModal"
      title="Delete Order"
      hide-footer
    >
      <DeleteOrderForm
        :order="order"
        v-on:close="
          () => {
            this.$refs['deleteOrderModal'].hide();
          }
        "
      ></DeleteOrderForm>
    </b-modal>
    <b-modal
      id="completeOrderModal"
      ref="completeOrderModal"
      title="Complete Order"
      hide-footer
    >
      <CompleteOrderForm
        :order="order"
        v-on:close="
          () => {
            this.$refs['completeOrderModal'].hide();
          }
        "
      ></CompleteOrderForm>
    </b-modal>
    <b-modal
      id="editPartModal"
      ref="editPartModal"
      title="Edit Part"
      hide-footer
    >
      <EditPartForm
        :order="order"
        :partIdx="partIdx"
        v-on:close="
          () => {
            this.$refs['editPartModal'].hide();
          }
        "
        v-on:update="refresh"
      ></EditPartForm>
    </b-modal>
    <b-modal
      id="returnPartModal"
      ref="returnPartModal"
      title="Return Part"
      hide-footer
    >
      <ReturnPartForm
        :order="order"
        :partIdx="partIdx"
        v-on:close="
          () => {
            this.$refs['returnOrderItemModal'].hide();
            this.refresh();
          }
        "
      ></ReturnPartForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import orders from '../../api/orders';

import PRProducts from '../../components/3d_printing/PRProducts.vue';
import LCProducts from '../../components/laser_cutting/LCProducts.vue';
import ApproveOrderForm from '../../components/orders/ApproveOrderForm.vue';
import RejectOrderForm from '../../components/orders/RejectOrderForm.vue';
import ApproveTeamForm from '../../components/orders/ApproveTeamForm.vue';
import DeleteOrderForm from '../../components/orders/DeleteOrderForm.vue';
import CompleteOrderForm from '../../components/orders/CompleteOrderForm.vue';
import EditPartForm from '../../components/orders/EditPartForm.vue';
import ReturnPartForm from '../../components/returns/ReturnPartForm.vue';

import roles from '../../shared/roles';
import { OrderItemStatus, statusOptions } from '@/utils/config';

@Component({
  components: {
    PRProducts,
    LCProducts,
    ApproveOrderForm,
    RejectOrderForm,
    ApproveTeamForm,
    DeleteOrderForm,
    CompleteOrderForm,
    EditPartForm,
    ReturnPartForm,
  },
})
export default class ViewOrder extends Vue {
  order: Order | null = null;
  oldOrder: Order | null = null;

  partIdx: number | null = null;

  redirectPage = '';

  showFailure = false;

  gotApprovalStatus = false;

  fields = [
    { key: 'name', label: 'Item', sortable: false },
    {
      key: 'price',
      label: 'Price',
      sortable: false,
      thStyle: { width: '10%' },
    },
    {
      key: 'quantityOrdered',
      label: 'Quantity Ordered',
      sortable: false,
      thStyle: { width: '10%' },
    },
    {
      key: 'subtotal',
      label: 'Subtotal',
      sortable: false,
      thStyle: { width: '10%' },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      thStyle: { width: '10%' },
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      notStudent: true,
      completed: true,
      thStyle: { width: '10%' },
    },
  ];

  get admin() {
    return roles.admin;
  }

  get store() {
    return roles.store;
  }

  get student() {
    return roles.student;
  }

  get totalCost() {
    return this.order && this.order.totalCost ? this.order.totalCost : 0;
  }

  get parts() {
    return this.order && this.order.parts ? this.order.parts.slice() : [];
  }

  get printed() {
    return this.order && this.order.products
      ? this.order.products.filter((elem) => elem.type == 0)
      : [];
  }

  get lasercut() {
    return this.order && this.order.products
      ? this.order.products.filter((elem) => elem.type == 1)
      : [];
  }

  getStatusMessage() {
    if (this.order) {
      const message = this.order.statuses;
      this.gotApprovalStatus = true;

      if (message.includes('Placed') && this.order.approved == null) {
        return 'Waiting for Instructor Approval';
      }

      if (message.includes('Rejected') && message.length > 1) {
        const index = message.indexOf('Rejected');
        if (index == 0) return message[1];
      }

      return message[0];
    }
    return '';
  }

  getStatusString(val: number) {
    return statusOptions.filter((elem) => elem.value == val)[0].text;
  }

  relevantFields() {
    if (!this.admin && !this.store) {
      if (this.order && this.order.statuses.includes('Picked up')) {
        return this.fields.filter(
          (field) => field.completed || field.completed == null,
        );
      }
      return this.fields.filter((field) => !field.notStudent);
    }
    return this.fields;
  }

  get thereIsNewPickup() {
    if (!this.order || !this.oldOrder) {
      return false;
    }
    for (const idx in this.order.parts) {
      if (
        this.order.parts[idx]?.data.status == OrderItemStatus.PickedUp &&
        this.oldOrder.parts[idx]?.data.status != OrderItemStatus.PickedUp
      ) {
        return true;
      }
    }

    for (const idx in this.order.products) {
      if (
        this.order.products[idx]?.data.status == OrderItemStatus.PickedUp &&
        this.oldOrder.products[idx]?.data.status != OrderItemStatus.PickedUp
      ) {
        return true;
      }
    }

    return false;
  }

  updateOrder() {
    if (this.order) {
      if (!this.thereIsNewPickup) {
        orders.updateOrder(this.order.id, this.order).then((res) => {
          if (res.status == 200) {
            this.$router.push(this.redirectPage).catch(() => {});
          } else {
            this.showFailure = true;
          }
        });
      } else {
        (
          this.$refs['completeOrderModal'] as Vue & { show: () => boolean }
        ).show();
      }
    }
  }

  removePart(idx: number) {
    if (this.order) {
      if (this.order.parts.length + this.order.products.length == 1) {
        this.deleteOrder();
      } else {
        if (this.order.parts.length == 1) {
          this.order.hasParts = false;
        }
        this.order.parts[idx].data.status = OrderItemStatus.Rejected;
        this.order.totalCost -=
          this.order.parts[idx].quantityOrdered * this.order.parts[idx].price;

        orders.updateOrder(this.order.id, this.order).then((res) => {
          if (res.data?.status == 'success') {
            this.order = res.data?.updatedOrder;
          }
        });
      }
    }
  }

  removePrinted(id: string) {
    if (this.order) {
      if (
        !this.order.parts.length &&
        !this.lasercut.length &&
        this.printed.length == 1
      ) {
        this.deleteOrder();
      } else {
        const idx = this.order.products.findIndex(
          (elem) => elem.id == id && elem.type == 0,
        );
        if (idx == -1) {
          return;
        }
        const data = this.order.products[idx].data as {
          quantity: number;
          status: number;
        } & PrintedMetadata;

        this.order.products[idx].data.status = OrderItemStatus.Rejected;
        this.order.totalCost -= this.order.products[idx].price * data.quantity;
        this.order.totalWeight -= data.weight * data.quantity;
        if (this.printed.length == 1) {
          this.order.hasPrinted = false;
          this.order.totalCost -= 1.5; //return service fee if last instance is being removed
        }
        orders.updateOrder(this.order.id, this.order).then((res) => {
          if (res.data?.status == 'success') {
            this.order = res.data?.updatedOrder;
          }
        });
      }
    }
  }

  removeLasercut(id: string) {
    if (this.order) {
      if (
        !this.order.parts.length &&
        !this.printed.length &&
        this.lasercut.length == 1
      ) {
        this.deleteOrder();
      } else {
        const idx = this.order.products.findIndex(
          (elem) => elem.id == id && elem.type == 1,
        );
        if (idx == -1) {
          return;
        }
        this.order.products[idx].data.status = OrderItemStatus.Rejected;
        this.order.totalCost -=
          this.order.products[idx].price *
          this.order.products[idx].data.quantity;
        if (this.lasercut.length == 1) {
          this.order.hasLaserCut = false;
          this.order.totalCost -= 1.5; //return service fee if last instance is being removed
        }
        orders.updateOrder(this.order.id, this.order).then((res) => {
          if (res.data?.status == 'success') {
            this.order = res.data?.updatedOrder;
          }
        });
      }
    }
  }

  removeAllOfService(type: number) {
    if (this.order) {
      if (
        !this.order.parts.length &&
        ((type == 0 && !this.lasercut.length && this.printed.length) ||
          (type == 1 && this.lasercut.length && !this.printed.length))
      ) {
        this.deleteOrder();
      } else {
        let refund = 1.5;
        this.order.products.forEach((prod) => {
          if (prod.type == type) {
            prod.data.status = OrderItemStatus.Rejected;
            refund += prod.price * prod.data.quantity;
          }
        });
        this.order.totalCost -= refund;
        if (type == 0) {
          this.order.hasPrinted = false;
          this.order.totalWeight = 0;
        } else if (type == 1) {
          this.order.hasLaserCut = false;
        }
        orders.updateOrder(this.order.id, this.order).then((res) => {
          if (res.data?.status == 'success') {
            this.order = res.data?.updatedOrder;
          }
        });
      }
    }
  }

  showEditPartModal(idx: number) {
    if (this.parts?.length) {
      this.partIdx = idx;
      (this.$refs['editPartModal'] as Vue & { show: () => boolean }).show();
    }
  }

  showReturnPartModal(idx: number) {
    if (this.parts?.length) {
      this.partIdx = idx;
      (this.$refs['returnPartModal'] as Vue & { show: () => boolean }).show();
    }
  }

  refresh() {
    orders.getOrderByID(this.$route.params.id).then((res) => {
      if (res.status == 404) {
        this.$router.push('/orders');
        return;
      }
      if (res && res.data) {
        this.order = res.data;
        this.oldOrder = JSON.parse(JSON.stringify(this.order));
        this.getStatusMessage();
      }
    });

    if (this.admin || this.store) {
      this.redirectPage = '/orders/all';
    } else if (this.student) {
      this.redirectPage = '/orders/team';
    }
  }

  mounted() {
    this.refresh();
  }

  deleteOrder() {
    if (this.order) {
      orders.deleteOrder(this.order.id).then((res) => {
        if (res.data?.status == 'success') {
          this.$router.push(this.redirectPage).catch(() => {});
        }
      });
    }
  }
}
</script>
