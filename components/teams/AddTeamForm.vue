<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Team added!
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error adding team! Try again later.
    </b-alert>
    <b-form @submit="onSubmit">
      <b-form-group id="input-group-name" label="Name:" label-for="input-name">
        <b-form-input
          id="input-name"
          v-model="form.name"
          placeholder="Team Name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-section"
        label="Section:"
        label-for="input-section"
      >
        <b-form-select
          id="input-section"
          v-model="form.sectionId"
          placeholder="Section"
          required
          :options="sectionOptions"
        ></b-form-select>
      </b-form-group>

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Add Team
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import teams from '../../api/teams';
import { buildSectionString } from '../../utils/genericUtils';

@Component({ props: { section: Object } })
export default class AddTeamForm extends Vue {
  @Prop(Array) readonly sections!: Section[];
  form = {
    name: '',
    sectionId: '',
  };

  showSuccess = false;
  showFailure = false;
  disableSubmit = false;

  get sectionOptions() {
    const result: { text: string; value: string }[] = [];

    this.sections.forEach((section) => {
      if (section.id) {
        result.push({
          text: buildSectionString(section),
          value: section.id,
        });
      }
    });

    return result;
  }

  clearForm() {
    this.form = {
      name: '',
      sectionId: '',
    };
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.showFailure = false;
    this.showSuccess = false;
    this.disableSubmit = true;

    teams.postTeam(this.form.name, this.form.sectionId).then((res) => {
      if (res.success) {
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
