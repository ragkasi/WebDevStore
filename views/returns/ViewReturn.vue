<template>
  <div>
    <div v-if="returnItem != null">
      <h2>Order Details</h2>
      <hr />
      <b-link :href="redirectPage" style="color: #ce0f3d">
        Back to Orders
      </b-link>
      <hr />
      <b-link :href="'/orders/' + returnItem.orderId" style="color: #ce0f3d">
        Order Reference
      </b-link>
      <hr />
      <dl>
        <dt>Time Placed</dt>
        <dd>{{ new Date(returnItem.dateSubmitted).toLocaleString() }}</dd>
        <dt>Total Refund</dt>
        <dd>
          {{
            Number(-1 * returnItem.totalRefund).toLocaleString('us-US', {
              style: 'currency',
              currency: 'USD',
            })
          }}
        </dd>
        <dt>Team</dt>
        <dd>
          {{ returnItem.team }}
        </dd>
        <dt>Status</dt>
        <dd>
          {{ getStatusMessage(returnItem.status) }}
        </dd>
      </dl>
      <hr />
      <dl>
        <dt>Part Name</dt>
        <dd>{{ returnItem.part.name }}</dd>
        <dt>Part Key</dt>
        <dd>
          {{ returnItem.part.partKey }}
        </dd>
        <dt>Unit Price</dt>
        <dd>
          {{ returnItem.part.price }}
        </dd>
        <dt>Return Quantity</dt>
        <dd>
          {{ returnItem.part.quantityToReturn }}
        </dd>
      </dl>
      <div v-if="(admin || store) && returnItem.status == 0">
        <b-button variant="danger" v-b-modal.approveReturnModal
          >Approve Return
        </b-button>
        <span>&nbsp;</span>
        <b-button variant="danger" v-b-modal.rejectReturnModal
          >Reject Return
        </b-button>
      </div>
    </div>
    <b-modal
      id="approveReturnModal"
      ref="approveReturnModal"
      title="Approve Return"
      hide-footer
    >
      <ApproveReturnForm
        :return="returnItem"
        v-on:close="
          () => {
            this.$refs['approveReturnModal'].hide();
          }
        "
      ></ApproveReturnForm>
    </b-modal>

    <b-modal
      id="rejectReturnModal"
      ref="rejectReturnModal"
      title="Reject Return"
      hide-footer
    >
      <RejectReturnForm
        :return="returnItem"
        v-on:close="
          () => {
            this.$refs['rejectReturnModal'].hide();
          }
        "
      ></RejectReturnForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import returns from '../../api/returns';
import roles from '../../shared/roles';
import ApproveReturnForm from '../../components/returns/ApproveReturnForm.vue';
import RejectReturnForm from '../../components/returns/RejectReturnForm.vue';

@Component({
  components: { ApproveReturnForm, RejectReturnForm },
})
export default class ViewReturn extends Vue {
  returnItem: Return | null = null;

  get admin() {
    return roles.admin;
  }

  get store() {
    return roles.store;
  }

  get student() {
    return roles.student;
  }

  redirectPage = '';

  getStatusMessage(val: number) {
    if (val == 0) {
      return 'Placed';
    } else if (val == 1) {
      return 'Rejected';
    } else if (val == 2) {
      return 'Approved';
    }
    return '';
  }

  mounted() {
    returns.getReturnByID(this.$route.params.id).then((res) => {
      if (res && res.data) {
        const [ret] = res.data;
        this.returnItem = ret;
      }
    });
    if (this.admin || this.store) {
      this.redirectPage = '/orders/all';
    } else if (this.student) {
      this.redirectPage = '/orders/team';
    }
  }
}
</script>
