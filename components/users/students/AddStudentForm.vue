<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Student added!
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error adding student! Try again later.
    </b-alert>

    <b-alert variant="danger" v-model="showKeycodeFailure" dismissible>
      Error with key code! {{ keycodeFailureReason }}
    </b-alert>

    <b-form @submit="onSubmit">
      <b-form-group id="input-group-team" label="Team:" label-for="input-team">
        <b-form-select
          id="input-team"
          v-model="form.team"
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

      <b-form-group
        id="input-group-keycode"
        label="Keycode (optional):"
        label-for="input-keycode"
      >
        <b-form-input
          id="input-keycode"
          v-model="form.keycode"
          placeholder="1234"
          :state="validKeycode"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Add student
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import students from '../../../api/students';
import { keycodeLength } from '../../../utils/config';

@Component({})
export default class AddStudentForm extends Vue {
  @Prop(Array) readonly teams!: Team[];

  form = {
    team: '',
    username: '',
    firstName: '',
    lastName: '',
    keycode: '',
  };

  showKeycodeFailure = false;
  keycodeFailureReason = '';
  validKeycode = true;

  showSuccess = false;
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
      username: '',
      team: '',
      firstName: '',
      lastName: '',
      keycode: '',
    };
  }

  @Watch('form.keycode')
  onKeycodeChanged(val: string) {
    if (
      (val.length == keycodeLength && Number.isInteger(Number(val))) ||
      val.length == 0
    ) {
      this.validKeycode = true;
      this.showKeycodeFailure = false;
    } else {
      this.validKeycode = false;
      this.showKeycodeFailure = true;
      this.keycodeFailureReason = `Keycodes are integers with ${keycodeLength} digits.`;
    }
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.showFailure = false;
    this.showSuccess = false;
    this.disableSubmit = true;

    students
      .postStudent({
        username: this.form.username,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        keycode: this.form.keycode,
        //Note that this is the ID of the team, not the name (see the text/value pairs above.)
        teamID: this.form.team,
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
