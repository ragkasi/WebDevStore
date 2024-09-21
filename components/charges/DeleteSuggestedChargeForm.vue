<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error deleting suggested charge! Try again later.
    </b-alert>
    <b-form @submit="onSubmit">
      <b-alert variant="danger" show
        >Are you sure you want to delete this suggested charge?
        <br />
        <br />
        <span class="font-weight-bolder">
          {{ charge.description }}: ${{ charge.amount }}
        </span></b-alert
      >
      <div></div>

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Delete
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import charges from '../../api/charges';

@Component({})
export default class DeleteSuggestedChargeForm extends Vue {
  @Prop(Object) charge!: Charge;

  showFailure = false;
  disableSubmit = false;

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.showFailure = false;
    this.disableSubmit = true;

    charges.deleteSuggestedCharge(this.charge.id).then((data) => {
      if (data.success) {
        this.$emit('update');
      } else {
        this.showFailure = true;
      }
      this.disableSubmit = false;
    });
  }
}
</script>
