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
          disabled
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

      <b-form-checkbox
        id="report-checkbox"
        v-model="form.creatingIssue"
        size="md"
        >Report an issue?</b-form-checkbox
      >

      <div v-if="form.creatingIssue">
        <b-form-group
          id="input-proteus-issues"
          label-for="input-issues"
          label="Symptoms:"
        >
          <b-form-checkbox-group
            id="input-issues"
            v-model="form.issue.issuePrompts"
            :options="issuePromptOptions"
            stacked
            name="symptom-options"
            :required="form.issue.issuePrompts.length === 0"
          >
            <b-form-invalid-feedback :state="validPrompts"
              >Please select at least one.</b-form-invalid-feedback
            >
          </b-form-checkbox-group>
        </b-form-group>

        <b-form-group
          id="input-issue-last-action"
          label="What was the student last doing when the issue began?"
          label-for="issue-last-action"
        >
          <b-form-textarea
            id="issue-last-action"
            v-model="form.issue.lastStudentAction"
            required
          ></b-form-textarea>
        </b-form-group>
      </div>

      <b-form-group
        id="input-proteus-note"
        label="Note:"
        label-for="input-note"
      >
        <b-form-textarea
          id="input-note"
          v-model="form.note"
          required
        ></b-form-textarea>
      </b-form-group>

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Update Proteus
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ProteusStatus, ProteusIssuePrompts } from '../../utils/config';
import protei from '@/api/protei';
import { failToast } from '@/utils/genericUtils';

/*
  Sorry to whoever has to deal with this.
  There's a ton of overlap between this component and the AddProteusForm.
  But I couldn't do inheratence and gave up.
  Fixing this is left as an excersise to future TAs.
*/
@Component({ props: { proteus: Object } })
export default class EditProteusForm extends Vue {
  @Prop(Object) readonly proteus!: Proteus;
  @Prop(Array) readonly teams!: Team[];
  @Prop(Array) readonly users!: User[];

  form = {
    number: 0,
    status: '',
    location: '',
    teamId: '',
    userId: '',
    otherLocationDetails: '',
    storeLocationDetails: '',
    creatingIssue: false,
    issue: { lastStudentAction: '', issuePrompts: [] },
    note: '',
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

  get issuePromptOptions() {
    return ProteusIssuePrompts.map((prompt) => {
      return {
        text: prompt,
        value: prompt,
      };
    });
  }

  get validPrompts() {
    return this.form.issue.issuePrompts.length > 0;
  }

  disableSubmit = false;

  mounted() {
    this.resetForm();
  }

  resetForm() {
    this.form = {
      number: this.proteus.number ?? 0,
      status: this.proteus.status,
      location: this.proteus.location ?? 'Other',
      teamId: this.proteus.teamId,
      userId: this.proteus.userId,
      otherLocationDetails: this.proteus.otherLocationDetails ?? '',
      storeLocationDetails: this.proteus.storeLocationDetails ?? '',
      note: '',
      creatingIssue: false,
      issue: { lastStudentAction: '', issuePrompts: [] },
    };
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.disableSubmit = true;
    const update = {
      id: this.proteus.id,
      number: this.form.number,
      status: this.form.status,
      location: this.form.location,
      teamId: this.form.teamId,
      userId: this.form.userId,
      otherLocationDetails: this.form.otherLocationDetails,
      storeLocationDetails: this.form.storeLocationDetails,
      note: this.form.note,
    } as ProteusUpdate;
    // Only create an issue if the checkbox is selected
    const issue = this.form.creatingIssue ? this.form.issue : null;
    protei.postProteusUpdate(update, issue).then((res) => {
      if (res.success) {
        this.resetForm();
        this.$emit('edit-success');
      } else {
        failToast(this, 'Edit failed, please try again later.');
        this.disableSubmit = false;
      }
    });
  }
}
</script>
