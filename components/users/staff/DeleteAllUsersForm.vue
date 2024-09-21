<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error deleting student! Try again later.
    </b-alert>
    <b-form @submit="onSubmit">
      <b-alert variant="danger" show
        >Are you sure you want to delete all
        <span class="font-weight-bolder">
          {{ userCount }}
        </span>
        non-admin users?</b-alert
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
import users from '../../../api/users';

@Component({})
export default class DeleteAllUsersForm extends Vue {
  @Prop(Number) userCount!: number;

  showFailure = false;
  disableSubmit = false;

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.showFailure = false;
    this.disableSubmit = true;

    users.deleteAllNonAdminUsers().then((data) => {
      if (data.success) {
        this.$emit('delete-success');
      } else {
        this.showFailure = true;
      }
      this.disableSubmit = false;
    });
  }
}
</script>
