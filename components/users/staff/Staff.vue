<template>
  <div>
    <div class="mt-2">
      <b-alert variant="success" v-model="showDeleteSuccess" dismissible>
        Users deleted!
      </b-alert>

      <b-btn v-b-modal.add-user-modal class="m-2" variant="danger"
        >Add User</b-btn
      >

      <b-btn v-b-modal.delete-all-users-modal class="m-2" variant="danger"
        >Delete All Non-Admin Users</b-btn
      >

      <br />
      <FehTableWrapping
        :all="staff"
        :shown="shownStaff"
        v-on:pagingChange="pagingChange"
        v-if="hasMounted"
      >
        <template v-slot:top-right>
          <div style="float: right">
            <StaffSearch v-on:update="update" :staff="staff" />
          </div>
        </template>

        <b-table
          id="staff-table"
          striped
          hover
          :items="shownStaff"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :current-page="paging.current"
          :per-page="paging.per"
          responsive="sm"
        >
          <template #cell(roles)="data">
            <div v-for="role in data.value" :key="role.id">
              • {{ role.role }}
            </div>
          </template>

          <template #cell(sections)="data">
            <div v-for="section in data.value" :key="section.id">
              • {{ buildSectionString(section) }}
            </div>
          </template>

          <template #cell(actions)="data">
            <div class="text-right">
              <b-button
                variant="danger"
                @click="editedUser = data.item"
                v-b-modal.edit-user-modal
              >
                <i class="fa fa-edit" />
              </b-button>
              &nbsp;
              <b-button
                variant="danger"
                @click="deletedUser = data.item"
                v-b-modal.delete-user-modal
                ><i class="fa fa-trash"
              /></b-button>
            </div>
          </template>
        </b-table>
      </FehTableWrapping>
    </div>

    <b-modal id="delete-all-users-modal" title="Delete All Users" hide-footer>
      <DeleteAllUsersForm
        v-on:delete-success="deleteSuccess"
        v-bind:userCount="nonAdminUserCount"
      ></DeleteAllUsersForm>
    </b-modal>

    <b-modal id="delete-user-modal" title="Delete User" hide-footer>
      <DeleteUserForm
        v-on:delete-success="deleteSuccess"
        v-bind:user="deletedUser"
      ></DeleteUserForm>
    </b-modal>

    <b-modal id="edit-user-modal" title="Update User" hide-footer>
      <EditUserForm
        v-bind:user="editedUser"
        v-bind:sections="sections"
        v-on:edit-success="editSuccess"
      ></EditUserForm>
    </b-modal>

    <b-modal id="add-user-modal" title="Add User" hide-footer>
      <AddUserForm
        v-on:update="loadUsers"
        v-bind:sections="sections"
      ></AddUserForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import StaffSearch from '../staff/StaffSearch.vue';
import DeleteAllUsersForm from './DeleteAllUsersForm.vue';
import DeleteUserForm from './DeleteUserForm.vue';
import AddUserForm from './AddUserForm.vue';
import EditUserForm from './EditUserForm.vue';
import FehTableWrapping from '../../utils/FehTableWrapping.vue';
import users from '../../../api/users';
import sections from '../../../api/sections';
import { buildSectionString } from '../../../utils/genericUtils';
@Component({
  components: {
    StaffSearch,
    DeleteAllUsersForm,
    DeleteUserForm,
    AddUserForm,
    EditUserForm,
    FehTableWrapping,
  },
})
export default class Staff extends Vue {
  staff: User[] = [];
  shownStaff: User[] = [];
  sections: Section[] = [];

  deletedUser: User | null = null;
  editedUser: User | null = null;

  hasMounted = false;
  paging = { per: 1, current: 1, total: 1 };
  pagingChange(incoming: Paging) {
    this.paging = incoming;
  }

  sortBy = 'username';
  sortDesc = true;
  fields = [
    { key: 'username', label: 'Last Name.#', sortable: true },
    { key: 'firstName', label: 'First', sortable: true },
    { key: 'roles', label: 'Roles', sortable: false },
    { key: 'sections', label: 'Sections', sortable: false },
    { key: 'actions', label: '', sortable: false },
  ];

  showDeleteSuccess = false;
  showEditSuccess = false;

  get nonAdminUserCount() {
    const userHasAdminRole = (user: User) => {
      return user.roles.reduce((prev, curr) => {
        if (curr.role === 'Admin') {
          return true;
        } else {
          return prev;
        }
      }, false);
    };

    let count = 0;
    this.staff.forEach((user) => {
      if (!userHasAdminRole(user)) {
        count += 1;
      }
    });

    return count;
  }

  update(shownStaff: User[]) {
    this.shownStaff = shownStaff;
  }

  mounted() {
    this.loadUsers();
    this.loadSections();
    this.hasMounted = true;
  }

  loadUsers() {
    users.getUsers().then((res) => {
      this.staff = res.data;
      this.update(this.staff);
    });
  }

  loadSections() {
    sections.getSections().then((res) => {
      this.sections = res.data;
    });
  }

  buildSectionString(section: Section) {
    return buildSectionString(section);
  }

  deleteSuccess() {
    this.$bvModal.hide('delete-all-users-modal');
    this.$bvModal.hide('delete-user-modal');
    this.showDeleteSuccess = true;
    this.loadUsers();
  }

  editSuccess() {
    this.$bvModal.hide('edit-user-modal');
    this.showEditSuccess = true;
    this.loadUsers();
  }
}
</script>
