<template>
  <div>
    <h2>Teams</h2>
    <hr />

    <div v-if="admin">
      <b-btn v-b-modal.add-team-modal class="m-2" variant="danger"
        >Add Team</b-btn
      >
      <b-btn v-b-modal.add-student-modal class="m-2" variant="danger"
        >Add Student</b-btn
      >
      <b-btn v-b-modal.add-roster-modal class="m-2" variant="danger"
        >Add Roster</b-btn
      >

      <b-btn
        v-b-modal.delete-all-teams-modal
        class="m-2"
        variant="danger"
        style="float: right"
        >Delete All Teams</b-btn
      >
    </div>

    <div class="mt-2">
      <b-table
        striped
        hover
        :items="teams"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        responsive="sm"
      >
        <template #cell(name)="data">
          <a v-bind:href="'teams/' + data.value" class="osu-link">{{
            data.value
          }}</a>
        </template>

        <template #cell(section)="data">
          <div v-if="data.value">
            {{ buildSectionString(data.value) }}
          </div>
        </template>

        <template #cell(budget)="data">
          ${{ parseFloat(data.value).toFixed(2) }}
        </template>

        <template #cell(proteus)="data">
          <div v-if="data.value">
            <b-link
              :href="`/protei/${data.value.number}/details`"
              class="osu-link"
              :disabled="!store && !proteusDeveloper"
              >Proteus {{ data.value.number }}</b-link
            >
          </div>
          <div v-else>N/A</div>
        </template>

        <template #cell(students)="data">
          <div v-for="student in data.value" :key="student.id">
            • {{ student.firstName }} {{ student.username }}
          </div>
        </template>
      </b-table>
    </div>

    <b-modal id="add-team-modal" title="Add Team" hide-footer>
      <AddTeamForm :sections="sections" v-on:update="update"></AddTeamForm>
    </b-modal>
    <b-modal id="add-student-modal" title="Add Student" hide-footer>
      <AddStudentForm :teams="teams" v-on:update="update"></AddStudentForm>
    </b-modal>
    <b-modal id="add-roster-modal" title="Upload Roster" hide-footer>
      <ParseTeamsForm
        :sections="sections"
        v-on:update="update"
      ></ParseTeamsForm>
    </b-modal>
    <b-modal id="delete-all-teams-modal" title="Delete All Teams" hide-footer>
      <DeleteAllTeamsForm
        :teamCount="teamCount"
        v-on:update="onDeleteAllTeamsSuccess"
      ></DeleteAllTeamsForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AddTeamForm from '../../components/teams/AddTeamForm.vue';
import AddStudentForm from '../../components/users/students/AddStudentForm.vue';
import ParseTeamsForm from '../../components/teams/ParseTeamsForm.vue';
import DeleteAllTeamsForm from '../../components/teams/DeleteAllTeamsForm.vue';
import teams from '../../api/teams';
import sections from '../../api/sections';
import { buildSectionString, successToast } from '../../utils/genericUtils';
import roles from '../../shared/roles';

@Component({
  components: {
    AddTeamForm,
    AddStudentForm,
    ParseTeamsForm,
    DeleteAllTeamsForm,
  },
})
export default class ViewTeams extends Vue {
  teams: Team[] | null = null;
  sections: Section[] | null = null;

  sortBy = 'name';
  sortDesc = false;
  fields = [
    { key: 'name', sortable: true },
    { key: 'section', sortable: true },
    { key: 'budget', sortable: true },
    { key: 'proteus', sortable: true },
    { key: 'students', sortable: false },
  ];

  get admin() {
    return roles.admin;
  }

  get ta() {
    return roles.ta;
  }

  get store() {
    return roles.store;
  }

  get proteusDeveloper() {
    return roles.proteusDeveloper;
  }

  update() {
    if (this.admin) {
      this.loadAllTeams();
      this.loadSections();
    } else if (this.ta) {
      this.loadTeamsInstructed();
    } else {
      this.$router.push('/forbidden');
    }
  }

  loadAllTeams() {
    teams.getTeams().then((res) => {
      //auth check
      if (res.status === 403) {
        this.$router.push('/forbidden');
      }
      this.teams = res.data;
    });
  }

  loadTeamsInstructed() {
    teams.getTeamsInstructed().then((res) => {
      //auth check
      if (res.status === 403) {
        this.$router.push('/forbidden').catch(() => {});
      }
      this.teams = res.data;
    });
  }

  loadSections() {
    sections.getSections().then((res) => {
      if (res.status === 403) {
        this.$router.push('/forbidden').catch(() => {});
      }
      this.sections = res.data;
    });
  }

  mounted() {
    this.update();
  }

  buildSectionString(section: Section) {
    return buildSectionString(section);
  }

  onDeleteAllTeamsSuccess() {
    this.$bvModal.hide('delete-all-teams-modal');
    this.update();
    successToast(this, 'Successfully Deleted All Teams');
  }

  get teamCount() {
    return this.teams?.length ?? 0;
  }
}
</script>
