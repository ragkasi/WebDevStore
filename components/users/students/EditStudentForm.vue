<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error updating student! Try again later.
    </b-alert>

    <b-form @submit="onSubmit">
      <b-form-group id="input-group-team" label="Team:" label-for="input-team">
        <b-form-select
          id="input-team"
          v-model="form.teamID"
          :options="teamOptions"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-username"
        label="Name.#:"
        label-for="input-username"
      >
        <b-form-input
          id="input-username"
          v-model="form.username"
          placeholder="name.#"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-firstName"
        label="First Name:"
        label-for="input-firstName"
      >
        <b-form-input
          id="input-firstName"
          v-model="form.firstName"
          placeholder="Luke"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-lastName"
        label="Last Name:"
        label-for="input-lastName"
      >
        <b-form-input
          id="input-lastName"
          v-model="form.lastName"
          placeholder="Skywalker"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Update student
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import students from '../../../api/students';

@Component({})
export default class EditStudentForm extends Vue {
  @Prop(Array) readonly teams!: Team[];
  @Prop(Object) readonly student!: Student;

  form = {
    teamID: '',
    username: '',
    firstName: '',
    lastName: '',
    keycode: '',
  };

  showFailure = false;
  disableSubmit = false;

  get teamOptions() {
    const result: { text: string; value: string | number }[] = [];

    this.teams.forEach((team) => {
      result.push({ text: team.name, value: team.id });
    });

    return result;
  }

  clearForm() {
    this.form = {
      username: this.student?.username ?? '',
      teamID: this.student?.teamID ?? '',
      firstName: this.student?.firstName ?? '',
      lastName: this.student?.lastName ?? '',
      keycode: this.student?.keycode ?? '',
    };
  }

  mounted() {
    this.clearForm();
  }

  onSubmit(evt: Event) {
    if (!this.student?.id) {
      return;
    }
    evt.preventDefault();
    this.showFailure = false;
    this.disableSubmit = true;

    students.updateStudent(this.student.id, this.form).then((data) => {
      if (data.success) {
        this.clearForm();
        this.$emit('edit-success');
      } else {
        this.showFailure = true;
      }
      this.disableSubmit = false;
    });
  }
}
</script>
