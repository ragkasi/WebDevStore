<template>
  <div>
    <h2>Proteus Management</h2>
    <hr />
    <b-btn
      v-b-modal.add-proteus-modal
      class="m-2"
      variant="danger"
      v-if="proteusDeveloper"
      >Add Proteus</b-btn
    >

    <div class="mt-2" v-if="protei">
      <ProteusTable :protei="protei" v-on:select-proteus="selectProteus" />
    </div>

    <b-modal id="add-proteus-modal" title="Add Proteus" hide-footer>
      <AddProteusForm
        v-on:add-success="addSuccess"
        v-on:update="update"
        :teams="teams"
        :users="users"
      ></AddProteusForm>
    </b-modal>

    <b-modal id="edit-proteus-modal" title="Update Proteus" hide-footer>
      <EditProteusForm
        v-on:edit-success="editSuccess"
        :proteus="selectedProteus"
        :teams="teams"
        :users="users"
      ></EditProteusForm>
    </b-modal>

    <b-modal id="delete-proteus-modal" title="Delete Proteus" hide-footer>
      <DeleteProteusForm
        v-on:delete-success="deleteSuccess"
        :proteus="selectedProteus"
      ></DeleteProteusForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { failToast, successToast } from '@/utils/genericUtils';
import { Component, Vue } from 'vue-property-decorator';
import AddProteusForm from '../../components/protei/AddProteusForm.vue';
import EditProteusForm from '../../components/protei/EditProteusForm.vue';
import DeleteProteusForm from '../../components/protei/DeleteProteusForm.vue';
import ProteusLocationDetail from '../../components/protei/ProteusLocationDetail.vue';
import ProteusTable from '../../components/protei/ProteusTable.vue';
import roles from '../../shared/roles';
import protei from '../../api/protei';
import users from '../../api/users';
import teams from '../../api/teams';

@Component({
  components: {
    AddProteusForm,
    EditProteusForm,
    ProteusLocationDetail,
    DeleteProteusForm,
    ProteusTable,
  },
})
export default class ViewProtei extends Vue {
  protei: Proteus[] | null = null;
  selectedProteus: Proteus | null = null;
  users: User[] | null = null;
  teams: Team[] | null = null;

  selectProteus(p: Proteus) {
    this.selectedProteus = p;
  }

  update() {
    protei.getProtei().then((res) => {
      if (res.status === 403) {
        this.$router.push('/forbidden');
        return;
      }
      if (res.data.status == 'success') {
        this.protei = res.data.protei;
      } else {
        failToast(this, 'Failed to retreive protei, please try again later.');
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
        failToast(this, 'Failed to retreive users, please try again later.');
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
        failToast(this, 'Failed to retreive teams, please try again later.');
      }
    });
  }

  mounted() {
    this.update();
  }

  addSuccess() {
    this.$bvModal.hide('add-proteus-modal');
    successToast(this, 'Proteus added!');
    this.update();
  }

  editSuccess() {
    this.$bvModal.hide('edit-proteus-modal');
    successToast(this, 'Proteus updated!');
    this.update();
  }

  deleteSuccess() {
    this.$bvModal.hide('delete-proteus-modal');
    successToast(this, 'Proteus deleted!');
    this.update();
  }

  get proteusDeveloper() {
    return roles.proteusDeveloper;
  }
}
</script>
