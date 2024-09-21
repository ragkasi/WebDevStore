<template>
  <div>
    <b-container>
      <b-row align-v="center">
        <b-col>
          <h2>Proteus Details</h2>
        </b-col>
        <b-col class="text-right">
          <b-btn
            class="m-2"
            v-if="admin || store || proteusDeveloper"
            variant="danger"
            v-b-modal.edit-proteus-modal
            >✏️ &nbsp; Edit</b-btn
          >
          <b-btn variant="danger" href="/protei">Back to List</b-btn>
        </b-col>
      </b-row>
    </b-container>
    <hr />
    <div v-if="proteus">
      <b-container class="p-0">
        <b-row no-gutters>
          <b-col cols="4">
            <div class="font-weight-bold mt-2">Number</div>
            {{ proteus.number }}
            <div class="font-weight-bold mt-2">Status</div>
            {{ proteus.status }}
            <div class="font-weight-bold mt-2">Last Updator:</div>
            <div v-if="proteus.updatedByUser">
              {{ proteus.updatedByUser.fullName }}
            </div>
            <div v-else>✖ Removed ✖</div>
            <div class="font-weight-bold mt-2">Last Updated:</div>
            {{ getFormattedDate(proteus.updatedAt) }}
            <div class="font-weight-bold mt-2">Location</div>
            {{ proteus.location }}
            <div class="font-weight-bold mt-2">Location Details</div>
            <ProteusLocationDetail :base="proteus" :truncate="false" />
          </b-col>
          <b-col v-if="proteusDeveloper" cols="8">
            <div class="font-weight-bold mt-2">Note</div>
            <b-textarea
              v-model="form.note"
              class="lazy"
              @change="editProteusNote"
              rows="7"
            ></b-textarea>
          </b-col>
        </b-row>
      </b-container>
      <hr />
      <b-card no-body class="mt-2">
        <b-tabs card>
          <b-tab title="Updates" active title-link-class="osu-link">
            <ProteusUpdateTable :updates="proteus.updates">
            </ProteusUpdateTable>
          </b-tab>
          <div v-if="proteusDeveloper">
            <b-tab title="Outstanding Issues" title-link-class="osu-link">
              <ProteusIssueTable
                :proteus="proteus"
                :issues="proteus.issues.filter((issue) => !issue.resolved)"
              />
            </b-tab>
            <b-tab title="Resolved Issues" title-link-class="osu-link">
              <ProteusIssueTable
                :proteus="proteus"
                :issues="proteus.issues.filter((issue) => issue.resolved)"
              />
            </b-tab>
          </div>
        </b-tabs>
      </b-card>
    </div>

    <b-modal id="edit-proteus-modal" title="Update Proteus" hide-footer>
      <EditProteusForm
        v-on:edit-success="editSuccess"
        :proteus="proteus"
        :teams="teams"
        :users="users"
      ></EditProteusForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { failToast, successToast, formatDate } from '@/utils/genericUtils';
import { Component, Vue } from 'vue-property-decorator';
import EditProteusForm from '../../components/protei/EditProteusForm.vue';
import ProteusLocationDetail from '../../components/protei/ProteusLocationDetail.vue';
import ProteusIssueTable from '../../components/protei/ProteusIssueTable.vue';
import ProteusUpdateTable from '../../components/protei/ProteusUpdateTable.vue';
import roles from '../../shared/roles';
import users from '../../api/users';
import protei from '../../api/protei';
import teams from '../../api/teams';

@Component({
  components: {
    EditProteusForm,
    ProteusLocationDetail,
    ProteusIssueTable,
    ProteusUpdateTable,
  },
})
export default class ViewProtei extends Vue {
  proteus: Proteus | null = null;
  users: User[] | null = null;
  teams: Team[] | null = null;

  update() {
    protei.getProteus(this.$route.params.number).then((res) => {
      if (res.status === 403) {
        this.$router.push('/forbidden');
        return;
      }
      if (res.success) {
        this.proteus = res.data.proteus;
        this.resetForm();
      } else {
        failToast(this, 'Failed to get proteus, please try again later.');
      }
    });
    users.getUsers().then((res) => {
      if (res.status === 403) {
        this.$router.push('/forbidden');
        return;
      }
      if (res?.success) {
        this.users = res.data;
      } else {
        failToast(this, 'Failed to get users, please try again later.');
      }
    });
    teams.getTeams().then((res) => {
      if (res.status === 403) {
        this.$router.push('/forbidden');
        return;
      }
      if (res?.success) {
        this.teams = res.data;
      } else {
        failToast(this, 'Failed to get teams, please try again later.');
      }
    });
  }

  mounted() {
    this.update();
  }

  editSuccess() {
    this.$bvModal.hide('edit-proteus-modal');
    this.update();
    successToast(this, 'Proteus updated!');
  }

  get admin() {
    return roles.admin;
  }

  get proteusDeveloper() {
    return roles.proteusDeveloper;
  }

  get store() {
    return roles.store;
  }

  form = { note: '' };

  resetForm() {
    if (this.proteus) {
      this.form = { note: this.proteus.note };
    }
  }

  getFormattedDate(dateString: string) {
    return formatDate(dateString);
  }

  editProteusNote() {
    const updates = { note: this.form.note, id: this.proteus?.id ?? '' };
    protei.putProteus(updates).then((res) => {
      if (res.success) {
        successToast(this, 'Successfully edited note!');
        this.update();
      } else {
        failToast(this, 'Failed to edit note, please try later.');
      }
    });
  }
}
</script>
