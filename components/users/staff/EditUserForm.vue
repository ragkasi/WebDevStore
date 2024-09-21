<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error updating user! Try again later.
    </b-alert>

    <b-form @submit="onSubmit">
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
        id="input-group-sections"
        label-for="input-sections"
        label="Sections Instructed:"
      >
        <multiselect
          id="input-sections"
          v-model="form.sections"
          :options="sectionOptions"
          :multiple="true"
          :searchable="false"
          :close-on-select="false"
          :clear-on-select="false"
          :show-labels="false"
          label="label"
          track-by="value"
          placeholder="Sections"
        ></multiselect>
      </b-form-group>

      <b-form-group
        id="input-group-roles"
        label-for="input-roles"
        label="Roles:"
      >
        <multiselect
          id="input-roles"
          v-model="form.roles"
          :options="roleOptions"
          :multiple="true"
          :searchable="false"
          :close-on-select="false"
          :clear-on-select="false"
          :show-labels="false"
          label="label"
          track-by="value"
          placeholder="Roles"
        ></multiselect>
      </b-form-group>

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Update user
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { buildSectionString } from '../../../utils/genericUtils';
import { Component, Prop, Vue } from 'vue-property-decorator';
import users from '../../../api/users';
import { roleOptions } from '../../../utils/config';

@Component({})
export default class EditStudentForm extends Vue {
  @Prop(Array) readonly sections!: Section[];
  @Prop(Object) readonly user!: User;

  form = {
    username: '',
    firstName: '',
    lastName: '',
    roles: [] as { label: string; value: string }[],
    sections: [] as { label: string; value: string }[],
  };

  showFailure = false;
  disableSubmit = false;

  get sectionOptions() {
    const result: { label: string; value: string }[] = [];

    this.sections.forEach((section) => {
      result.push({ label: buildSectionString(section), value: section.id });
    });

    return result;
  }

  get roleOptions() {
    const result: { label: string; value: string }[] = [];

    roleOptions.forEach((option) => {
      result.push({ label: option, value: option });
    });

    return result;
  }

  clearForm() {
    this.form = {
      username: this.user.username,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      roles: this.user.roles.map((role) => {
        return {
          label: role.role,
          value: role.role,
        };
      }),
      sections: this.user.sections.map((section) => {
        return {
          label: buildSectionString(section),
          value: section.id,
        };
      }),
    };
  }

  mounted() {
    this.clearForm();
  }

  onSubmit(evt: Event) {
    if (!this.user.id) {
      return;
    }

    evt.preventDefault();
    this.showFailure = false;
    this.disableSubmit = true;

    users
      .putUser(this.user.id, {
        username: this.form.username,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        //this is kinda ugly. but unfortunately the multiselect doesn't just return the value. I don't
        //want the api to have to parse this.
        sections: this.form.sections.map((section) => section.value),
        roles: this.form.roles.map((role) => role.label),
      })
      .then((data) => {
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
