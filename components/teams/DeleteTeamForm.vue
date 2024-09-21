<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error deleting team! Try again later.
    </b-alert>
    <b-form @submit="onSubmit">
      <b-alert variant="danger" show
        >Are you sure you want to delete team
        <span class="font-weight-bolder"> {{ team.name }}</span
        >?
        <br />
      </b-alert>
      <div></div>

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Delete
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import teams from '../../api/teams';

@Component({})
export default class DeleteTeamForm extends Vue {
  @Prop(Object) team!: Team;

  showFailure = false;
  disableSubmit = false;

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.showFailure = false;
    this.disableSubmit = true;

    teams.deleteTeam(this.team.id).then((data) => {
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
