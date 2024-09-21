<template>
  <div>
    <b-container>
      <b-row align-v="center">
        <b-col>
          <h2>Proteus Issue Management</h2>
        </b-col>
        <b-col class="text-right">
          <b-btn variant="danger" class="m-1" href="/protei"
            >Back to List</b-btn
          >
          <b-btn
            class="m-1"
            variant="danger"
            :href="`/protei/${this.$route.params.number}/details`"
            >Back to Proteus</b-btn
          >
        </b-col>
      </b-row>
    </b-container>
    <hr />
    <div v-if="this.issue">
      <div class="font-weight-bold mt-2">Created:</div>
      {{ getFormattedDate(issue.createdAt) }}
      <div class="font-weight-bold mt-2">Creator:</div>
      <div v-if="issue.update.createdByUser">
        {{ issue.update.createdByUser.fullName }}
      </div>
      <div v-else>✖ Removed ✖</div>
      <div class="font-weight-bold mt-2">Last Updated:</div>
      {{ getFormattedDate(issue.updatedAt) }}
      <div class="font-weight-bold mt-2">Updator:</div>
      <div v-if="issue.updatedByUser">
        {{ issue.updatedByUser.fullName }}
      </div>
      <div v-else>✖ Removed ✖</div>

      <div class="font-weight-bold mt-2">Symptoms:</div>
      <ul>
        <li v-for="prompt in form.issuePrompts" :key="`issueType-${prompt}`">
          {{ prompt }}
        </li>
      </ul>

      <b-form @submit="onSubmit">
        <b-form-group
          id="proteus-issue-start"
          label="What was the student last doing when the issue started?"
          label-for="issue-start"
          label-class="font-weight-bold"
        >
          <b-form-textarea
            id="issue-start"
            v-model="form.lastStudentAction"
            disabled
          ></b-form-textarea>
        </b-form-group>
        <b-form-group
          id="proteus-issue-note"
          label="Note:"
          label-for="issue-note"
          label-class="font-weight-bold"
        >
          <b-form-textarea
            id="issue-note"
            v-model="form.note"
            disabled
          ></b-form-textarea>
        </b-form-group>
        <b-form-group
          id="input-proteus-issues"
          label-for="input-issues"
          label="Issue categories:"
          label-class="font-weight-bold"
        >
          <b-form-checkbox-group
            id="input-issues"
            v-model="form.issueTypes"
            :options="issueTypeOptions"
            stacked
            name="type-options"
            :required="form.issueTypes.length === 0"
          >
            <b-form-invalid-feedback :state="validTypes"
              >Please select at least one.</b-form-invalid-feedback
            >
          </b-form-checkbox-group>
        </b-form-group>

        <b-form-checkbox id="issue-resolved" v-model="form.resolved" size="md"
          ><strong>Issue Resolved?</strong></b-form-checkbox
        >

        <b-button class="mt-2" type="submit" variant="danger">
          Update Issue
        </b-button>
      </b-form>
    </div>
  </div>
</template>

<script lang="ts">
import { failToast, formatDate, successToast } from '@/utils/genericUtils';
import { ProteusIssueTypes } from '../../utils/config';
import { Component, Vue } from 'vue-property-decorator';
import protei from '../../api/protei';

@Component({
  components: {},
})
export default class ViewProteusIssue extends Vue {
  issue: ProteusIssue | null = null;

  form: {
    resolved: boolean;
    issueTypes: string[];
    issuePrompts: string[];
    lastStudentAction: string;
    note: string;
  } = {
    resolved: false,
    issueTypes: [],
    issuePrompts: [],
    lastStudentAction: '',
    note: '',
  };

  update() {
    protei.getIssue(`${this.$route.params.id}`).then((res) => {
      if (res.status === 403) {
        this.$router.push('/forbidden');
      }
      if (res.success) {
        this.issue = res.data.issue;
        this.resetForm();
      } else {
        failToast(this, 'Failed to get issue, please try again later.');
      }
    });
  }

  resetForm() {
    if (this.issue) {
      this.form = {
        resolved: this.issue.resolved,
        issueTypes: this.issue.issueTypes,
        issuePrompts: this.issue.issuePrompts,
        note: this.issue.update?.note ?? '',
        lastStudentAction: this.issue.lastStudentAction,
      };
    }
  }

  mounted() {
    this.update();
    this.resetForm();
  }

  editSuccess() {
    successToast(this, 'Issue updated!');
    this.update();
  }

  get issueTypeOptions() {
    return ProteusIssueTypes.map((type) => {
      return {
        text: type,
        value: type,
      };
    });
  }

  get validTypes() {
    return this.form.issueTypes.length > 0;
  }

  getFormattedDate(dateString: string) {
    return formatDate(dateString);
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    const updatedIssue = {
      id: this.issue?.id ?? '',
      issueTypes: this.form.issueTypes,
      resolved: this.form.resolved,
    } as ProteusIssue;
    protei.putIssue(updatedIssue).then((res) => {
      if (res.success) {
        this.editSuccess();
      } else {
        failToast(this, 'Edit failed, please try again later.');
      }
    });
  }
}
</script>
