<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Vendor Edited!
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error editing vendor! <b>{{ failureReason }}</b> Try again later.
    </b-alert>

    <b-form @submit="onSubmit">
      <b-form-group id="input-group-vendor-name" label-for="input-vendor-name">
        <b-form-input
          id="input-vendor-name"
          v-model="name"
          placeholder="Vendor Name"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group style="float: right">
        <b-button type="submit" variant="danger"> Edit </b-button>
      </b-form-group>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import api from '../../api/vendors';
@Component({})
export default class EditVendorForm extends Vue {
  name: string = '';
  @Prop() id!: string;

  showSuccess = false;
  showFailure = false;

  failureReason = '';

  onSubmit(evt: Event) {
    evt.preventDefault();
    api.editVendor(this.id, this.name).then((res) => {
      if (res.data?.status == 'success') {
        this.showSuccess = true;
        this.name = '';
        this.$emit('refresh');
      } else {
        this.showFailure = true;
        this.failureReason = res.data.reason;
      }
    });
  }
}
</script>
