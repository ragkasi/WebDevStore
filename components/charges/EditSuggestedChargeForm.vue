<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error adding suggested charge! Try again later.
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

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Update suggested charge
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import charges from '../../api/charges';

@Component({})
export default class EditSuggestedChargeForm extends Vue {
  @Prop(Object) suggestedCharge!: Charge;
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
      description: this.suggestedCharge.description,
      amount: this.suggestedCharge.amount,
    };
  }

  mounted() {
    this.clearForm();
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.showFailure = false;
    this.showSuccess = false;
    this.disableSubmit = true;

    charges
      .putSuggestedCharge(this.suggestedCharge.id, {
        description: this.form.description,
        amount: this.form.amount ?? -1,
      })
      .then((data) => {
        if (data.success) {
          this.clearForm();
          this.showSuccess = true;
          this.$emit('update');
        } else {
          this.showFailure = true;
        }
        this.disableSubmit = false;
      });
  }
}
</script>
