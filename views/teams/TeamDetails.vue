<template>
  <div>
    <b-form @submit="onSubmit">
      <b-container>
        <b-row>
          <b-col>
            <h2>Team Details</h2>
          </b-col>
          <b-col class="text-right">
            <!-- this is a pencil idk why it's not showing up in vscode -->
            <b-btn
              class="m-2"
              v-if="admin && !editing"
              v-on:click="toggleEdit"
              variant="danger"
              >✏️ &nbsp; Edit</b-btn
            >
            <b-btn
              class="m-2"
              v-if="admin && !editing"
              variant="danger"
              v-b-modal.delete-team-modal
              >🗑 &nbsp; Delete</b-btn
            >

            <div v-else-if="admin && editing">
              <b-btn class="m-2" type="submit" variant="danger">Submit</b-btn>
              <b-btn class="m-2" v-on:click="toggleEdit" variant="danger"
                >Cancel</b-btn
              >
            </div>
            <b-btn
              class="m-2"
              v-if="ta || admin"
              variant="danger"
              :href="`mailto:${emailStudents()}`"
            >
              <i class="fa fa-envelope" /> &nbsp; Email</b-btn
            >
          </b-col>
        </b-row>
      </b-container>

      <b-alert variant="success" v-model="showSuccess" dismissible>
        Team Updated
      </b-alert>
      <b-alert variant="danger" v-model="showFailure" dismissible>
        Error updating team! Try again later.
      </b-alert>

      <b-container v-if="team">
        <b-row>
          <b-col>
            <div class="font-weight-bold mt-2">Name</div>
            <b-form-group
              v-if="editing"
              id="input-group-name"
              label-for="input-name"
            >
              <b-form-input
                id="input-name"
                placeholder="Name"
                v-model="form.team"
                required
              ></b-form-input>
            </b-form-group>
            <div v-else>{{ team.name }}</div>

            <div class="font-weight-bold mt-2">Section</div>
            <b-form-group
              v-if="editing"
              id="input-group-section"
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
            <div v-else-if="section">
              {{ section.letter }} {{ section.time }}, Room {{ section.room }}
            </div>

            <div class="font-weight-bold mt-2">Budget</div>
            <b-form-group
              v-if="editing"
              id="input-group-budget"
              label-for="input-budget"
            >
              <b-form-input
                id="input-budget"
                v-model="form.budget"
                :number="true"
                type="number"
                :max="startingBudget"
                step=".01"
                required
              ></b-form-input>
            </b-form-group>
            <div v-else>${{ parseFloat(team.budget).toFixed(2) }}</div>

            <div class="font-weight-bold mt-2">3D Printing Material Limit</div>
            <b-form-group
              v-if="editing"
              id="input-group-filament"
              label-for="input-filament"
            >
              <b-form-input
                id="input-filament"
                v-model="form.filament"
                :number="true"
                type="number"
                min="0"
                :max="startingFilament"
                step=".01"
                required
              ></b-form-input>
            </b-form-group>
            <div v-else>{{ team.filament }} grams</div>
            <div class="font-weight-bold mt-2">Order Approval Status</div>
            <b-form-checkbox
              v-if="editing"
              type="checkbox"
              id="checkbox"
              v-model="form.orderApprovalStatus"
            />
            <div v-else>
              <div v-if="team.orderApprovalStatus">✅ &nbsp;Approved</div>
              <div v-else>❌ &nbsp;Unapproved</div>
            </div>
            <div class="font-weight-bold mt-2">Proteus Number</div>
            <div v-if="team.proteus">
              <b-link
                :href="`/protei/${team.proteus.number}/details`"
                class="osu-link"
                v-if="store || proteusDeveloper"
                >Proteus {{ team.proteus.number }}</b-link
              >
              <div v-else>Proteus {{ team.proteus.number }}</div>
            </div>
            <div v-else>N/A</div>
            <div class="font-weight-bold mt-2">RCS Identifying String</div>
            <div>
              <i class="fa fa-link" />
              <a
                :href="`${studentFileS3BucketUrl}/teamKeys/${team.name}.txt`"
                download
                class="osu-link"
              >
                Download File
              </a>
            </div>
          </b-col>

          <b-col>
            <div class="font-weight-bold mt-2">Members</div>
            <b-table
              striped
              hover
              :items="students"
              :fields="fields"
              responsive="sm"
              class="mt-3"
            >
              <template #cell(name)="data">
                {{ data.item.firstName }} {{ data.item.lastName }}
              </template>

              <template #cell(email)="data">
                <a
                  :href="'mailto:' + data.item.username + '@osu.edu'"
                  class="osu-link"
                  >{{ data.item.username }}@osu.edu</a
                >
              </template>
            </b-table>
          </b-col>
        </b-row>
        <hr />
        <br />
        <TeamBudgetInformation
          :teamId="team.id"
          v-on:update="update"
        ></TeamBudgetInformation>
      </b-container>
    </b-form>

    <b-modal id="delete-team-modal" title="Delete Team" hide-footer>
      <DeleteTeamForm
        :team="team"
        v-on:update="onDeleteTeamSuccess"
      ></DeleteTeamForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import teams from '../../api/teams';
import roles from '../../shared/roles';
import sections from '../../api/sections';
import { buildSectionString } from '../../utils/genericUtils';
import TeamBudgetInformation from '../../components/teams/TeamBudgetInformation.vue';
import DeleteTeamForm from '../../components/teams/DeleteTeamForm.vue';
import { startingBudget, startingFilament } from '../../utils/config';
import { studentFileS3BucketUrl } from '../../utils/config';

@Component({
  components: {
    TeamBudgetInformation,
    DeleteTeamForm,
  },
})
export default class TeamDetails extends Vue {
  team: Team | null = null;

  students: Student[] | null = null;
  section: Section | null = null;
  sections: Section[] | null = null;

  startingBudget = startingBudget;
  startingFilament = startingFilament;

  studentFileS3BucketUrl = studentFileS3BucketUrl;

  fields = [
    { key: 'name', sortable: false },
    { key: 'email', sortable: false, label: 'Email' },
  ];

  editing = false;
  showSuccess = false;
  showFailure = false;
  form = {
    team: '',
    budget: 0,
    filament: 0,
    orderApprovalStatus: false,
    sectionId: '',
  };

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

  get sectionOptions() {
    const result: { text: string; value: string }[] = [];

    if (!this.sections) {
      return result;
    }

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

  update() {
    this.editing = false;
    teams.getTeamByName(this.$route.params.name).then((res) => {
      //auth check
      if (res.status === 403) {
        this.$router.push('/forbidden').catch(() => {});
        return;
      } else if (res.status === 402) {
        this.$router.push('/overdue').catch(() => {});
        return;
      }

      if (res.data) {
        this.team = res.data;
      } else {
        this.$router.push('/notFound').catch(() => {});
        return;
      }

      this.section = this.team?.section ?? null;
      this.students = this.team?.students ?? null;
      this.clearForm();
    });

    if (this.admin) {
      this.getSections();
    }
  }

  clearForm() {
    this.form = {
      team: this.team?.name ?? '',
      budget: this.team?.budget ?? 0,
      filament: this.team?.filament ?? 0,
      orderApprovalStatus: this.team?.orderApprovalStatus ?? false,
      sectionId: this.section?.id ?? '',
    };
  }

  toggleEdit() {
    this.editing = !this.editing;
    this.clearForm();
  }

  //update team
  onSubmit(evt?: Event) {
    evt?.preventDefault();
    this.showFailure = false;
    this.showSuccess = false;

    if (!this.team) {
      return;
    }

    teams
      .putTeam(this.team.id, {
        id: this.team.id,
        name: this.form.team,
        filament: this.form.filament,
        budget: this.form.budget,
        students: [],
        orderApprovalStatus: this.form.orderApprovalStatus,
        sectionId: this.form.sectionId,
      })
      .then((res) => {
        if (res.success) {
          this.showSuccess = true;
          this.team = res.data.team;
          this.section = res.data.section;
          this.$emit('update');
          this.editing = false;
          this.clearForm();
        } else {
          this.showFailure = true;
        }
      });
  }

  mounted() {
    this.update();
  }

  //bind keys for form. Should make it easier/less frustrating to use
  created() {
    window.addEventListener('keydown', (e) => {
      if (e.key == 'Escape' && this.editing) {
        this.toggleEdit();
      } else if (e.key == 'Enter' && this.editing) {
        this.onSubmit();
      }
    });
  }

  onDeleteTeamSuccess() {
    this.$bvModal.hide('delete-team-modal');
    this.$router.push('/teams');
  }

  emailStudents() {
    return this.team?.students?.map((student) => {
      return student.username + '@buckeyemail.osu.edu';
    });
  }

  // #region helper functions
  private getSections() {
    sections.getSections().then((res) => {
      if (res.status === 403) {
        this.$router.push('/forbidden');
      }
      this.sections = res.data;
    });
  }
  // #endregion
}
</script>
