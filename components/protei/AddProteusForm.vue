<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group
        id="input-proteus-number"
        label="Number:"
        label-for="input-number"
      >
        <b-form-input
          id="input-number"
          v-model="form.number"
          placeholder="Input proteus number..."
          required
          min="1"
          max="200"
          type="number"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-status"
        label="Status:"
        label-for="input-status"
      >
        <b-form-select
          id="input-status"
          v-model="form.status"
          required
          :options="proteusStatusOptions"
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-location"
        label="Location:"
        label-for="input-location"
      >
        <b-form-radio-group
          id="input-location"
          v-model="form.location"
          required
          :options="proteusLocationOptions"
        ></b-form-radio-group>
      </b-form-group>

      <b-form-group
        id="input-proteus-team"
        label="Team:"
        label-for="input-team"
        v-if="['Team'].includes(form.location)"
      >
        <b-form-select
          id="input-team"
          v-model="form.teamId"
          required
          :options="teamOptions"
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="input-proteus-user"
        label="TA:"
        label-for="input-user"
        v-if="['TA'].includes(form.location)"
      >
        <b-form-select
          id="input-user"
          v-model="form.userId"
          required
          :options="userOptions"
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="input-store-location-details"
        label="Store details:"
        label-for="store-location-details"
        v-if="['Store'].includes(form.location)"
      >
        <b-form-input
          type="text"
          id="store-location-details"
          v-model="form.storeLocationDetails"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-other-location-details"
        label="Other details:"
        label-for="other-location-details"
        v-if="['Other'].includes(form.location)"
      >
        <b-form-input
          type="text"
          id="other-location-details"
          v-model="form.otherLocationDetails"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Add Proteus
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import protei from '@/api/protei';
import { failToast } from '@/utils/genericUtils';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ProteusStatus } from '../../utils/config';

@Component({})
export default class AddProteusForm extends Vue {
  @Prop(Array) readonly teams!: Team[];
  @Prop(Array) readonly users!: User[];

  form = {
    number: undefined, // Intentionally undefined so placeholder text displays
    status: '',
    location: 'Team',
    teamId: '',
    userId: '',
    otherLocationDetails: '',
    storeLocationDetails: '',
  };

  get proteusStatusOptions() {
    const selectables = Object.values(ProteusStatus).map(
      (statusName: string) => {
        return {
          value: statusName,
          text: statusName,
        };
      },
    );
    return selectables;
  }

  get proteusLocationOptions() {
    return [
      { value: 'Team', text: 'Team' },
      { value: 'TA', text: 'TA' },
      { value: 'Store', text: 'Store' },
      { value: 'Other', text: 'Other' },
    ];
  }

  get teamOptions() {
    return this.teams.map((team) => {
      return {
        value: team.id,
        text: team.name,
      };
    });
  }

  get userOptions() {
    return this.users.map((user) => {
      return {
        value: user.id,
        text: user.fullName,
      };
    });
  }

  disableSubmit = false;

  clearForm() {
    this.form = {
      number: undefined,
      status: '',
      location: 'Team',
      teamId: '',
      userId: '',
      otherLocationDetails: '',
      storeLocationDetails: '',
    };
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.disableSubmit = true;
    const proteus = {
      number: this.form.number,
      status: this.form.status,
      location: this.form.location,
      teamId: this.form.teamId,
      userId: this.form.userId,
      otherLocationDetails: this.form.otherLocationDetails,
      storeLocationDetails: this.form.storeLocationDetails,
    } as Proteus;

    protei.postProteus(proteus).then((res) => {
      if (res.success) {
        this.clearForm();
        this.$emit('add-success');
      } else {
        failToast(this, 'Proteus add failed, please try again later.');
        this.disableSubmit = false;
      }
    });
  }
}
</script>
