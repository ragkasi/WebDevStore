<template>
  <div>
    <h2>Charge Team</h2>
    <hr />

    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error adding charge! Try again later.
    </b-alert>

    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-description"
        label="Description:"
        label-for="input-description"
      >
        <b-form-input
          id="input-description"
          v-model="form.description"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-amount"
        label="Amount:"
        label-for="input-amount"
      >
        <b-form-input
          id="input-amount"
          v-model="form.amount"
          required
          type="number"
          min="0"
          step=".01"
        ></b-form-input>
      </b-form-group>

      <b-button
        type="submit"
        class="m-2"
        variant="danger"
        :disabled="disableSubmit"
      >
        <div v-if="addingNewCharge">Add Charge</div>
        <div v-else>Update Charge</div>
      </b-button>
      <b-button @click="cancel" class="m-2" variant="danger"> Cancel </b-button>
    </b-form>

    <hr />
    <br />
    <SuggestedCharges
      v-on:copyFromSuggestedCharge="copyFromSuggestedCharge"
    ></SuggestedCharges>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SuggestedCharges from './SuggestedCharges.vue';
import charges from '../../api/charges';

@Component({
  components: { SuggestedCharges },
})
export default class ChargeTeam extends Vue {
  @Prop(String) teamId!: string;
  @Prop(Object) charge!: Charge;
  @Prop(Boolean) addingNewCharge!: boolean;

  form = {
    description: '',
    amount: null,
  } as {
    description: string;
    amount: number | null;
  };

  showSuccess = false;
  showFailure = false;
  disableSubmit = false;

  clearForm() {
    this.form = {
      description: this.addingNewCharge ? '' : this.charge.description,
      amount: this.addingNewCharge ? null : this.charge.amount,
    };
  }

  mounted() {
    this.clearForm();
  }

  cancel() {
    this.$emit('cancel');
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.showFailure = false;
    this.showSuccess = false;
    this.disableSubmit = true;

    if (this.addingNewCharge) {
      this.addNewCharge();
    } else {
      this.editCharge();
    }
  }

  addNewCharge() {
    charges
      .postCharge({
        description: this.form.description,
        amount: this.form.amount ?? -1,
        teamId: this.teamId,
      })
      .then((data) => {
        if (data.success) {
          this.clearForm();
          this.showSuccess = true;
          this.$emit('add-success');
        } else {
          this.showFailure = true;
        }
        this.disableSubmit = false;
      });
  }

  editCharge() {
    charges
      .putCharge(this.charge.id, {
        description: this.form.description,
        amount: this.form.amount ?? -1,
        teamId: this.teamId,
      })
      .then((data) => {
        if (data.success) {
          this.clearForm();
          this.showSuccess = true;
          this.$emit('edit-success');
        } else {
          this.showFailure = true;
        }
        this.disableSubmit = false;
      });
  }

  copyFromSuggestedCharge(charge: Charge) {
    this.form = charge;
  }
}
</script>
