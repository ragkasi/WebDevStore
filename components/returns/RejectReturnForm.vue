<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Rejected Return.
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error rejecting return! <b>{{ failureReason }}</b> Try again later.
    </b-alert>

    <b-form @submit="onSubmit">
      <p>Do you want to reject this return?</p>
      <div style="float: right">
        <b-btn
          variant="secondary"
          @click="
            () => {
              this.$emit('close');
            }
          "
        >
          Cancel
        </b-btn>
        <span>&nbsp;</span>
        <b-btn type="submit" variant="danger"> Reject Return </b-btn>
      </div>
    </b-form>
  </div>
</template>

<script lang="ts">
import returns from '@/api/returns';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({})
export default class ApproveReturnForm extends Vue {
  @Prop() return!: Return;

  failureReason = '';

  showSuccess = false;
  showFailure = false;

  onSubmit(evt: Event) {
    evt.preventDefault();
    returns.returnOrder(this.return.id, false).then((res) => {
      if (res.data?.result == 'success') {
        this.showSuccess = true;
        this.return.status = 1;
        setTimeout(() => {
          this.$router.push('/orders/all').catch(() => {});
        }, 2000);
      } else {
        this.showFailure = true;
        this.failureReason = res.data?.reason;
      }
    });
  }
}
</script>
