<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      {{ teamsAdded }} teams and {{ studentsAdded }} students added!
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error adding teams! Try again later.
    </b-alert>

    <p>
      Download
      <a href="#" @click="downloadUploadRosterTemplate">the .csv template</a>
      to get started. Don't remove the header row.
    </p>

    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-section"
        label="Section:"
        label-for="input-section"
      >
        <b-form-select
          id="input-section"
          v-model="form.sectionId"
          required
          :options="sectionOptions"
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-file"
        label="Team roster:"
        label-for="input-file"
      >
        <b-form-file
          id="input-file"
          v-model="form.file"
          required
          accept="text/csv"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
          :state="Boolean(form.file)"
        ></b-form-file>
      </b-form-group>
      <b-button type="submit" variant="danger"> Add Teams </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  buildSectionString,
  base64StringToFile,
} from '../../utils/genericUtils';
import teams from '../../api/teams';

@Component({})
export default class ParseTeamsForm extends Vue {
  @Prop(Array) readonly sections!: Section[];

  form: { file: File | null; sectionId: string } = {
    file: null,
    sectionId: '',
  };

  showSuccess = false;
  showFailure = false;
  disableSubmit = false;

  teamsAdded = 0;
  studentsAdded = 0;

  uploadRosterTemplate: File | null = null;

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
      file: null,
      sectionId: '',
    };
  }

  downloadUploadRosterTemplate() {
    teams.getRosterTemplate().then((res) => {
      if (res.success) {
        const blob = base64StringToFile(res.data?.src, 'csv');
        var fileURL = window.URL.createObjectURL(blob);
        var fileLink = document.createElement('a');

        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'UploadRoster.csv');
        document.body.appendChild(fileLink);

        fileLink.click();
      } else {
        console.log('Failed to get roster template');
      }
    });
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.disableSubmit = true;

    if (!this.form.file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsBinaryString(this.form.file);
    reader.addEventListener('load', async (ev) => {
      const result = ev.target?.result as string | null | undefined;

      if (result) {
        const changes = result
          .trim()
          .split('\n')
          .slice(1)
          .map((a) => a.split(','))
          .map(([team, nameNumber, firstName, lastName]) => ({
            teamName: team.trim(),
            username: nameNumber.toLowerCase().trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          }));

        const rosterPostData = {
          sectionId: this.form.sectionId,
          ...{ teams: changes },
        };

        teams.postRoster(rosterPostData).then((res) => {
          if (res.success) {
            this.clearForm();
            this.determineSuccess(res);
            this.$emit('update');
          } else {
            this.showFailure = true;
          }
          this.disableSubmit = false;
        });
      }
    });
  }

  determineSuccess(res: any) {
    this.teamsAdded = res.data.teamsAdded;
    this.studentsAdded = res.data.studentsAdded;

    if (this.teamsAdded > 0 || this.studentsAdded > 0) {
      this.showSuccess = true;
    } else {
      this.showFailure = true;
    }
  }
}
</script>
