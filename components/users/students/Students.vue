<template>
  <div>
    <b-alert variant="success" v-model="showDeleteSuccess" dismissible>
      Students deleted!
    </b-alert>

    <b-alert variant="success" v-model="showEditSuccess" dismissible>
      Student updated!
    </b-alert>

    <b-alert variant="danger" v-model="showUpdateKeycodeFailure" dismissible>
      Failed to update keycode. Make sure that it is unique and a valid value.
    </b-alert>

    <div class="mt-2">
      <b-btn v-b-modal.add-student-modal class="m-2" variant="danger"
        >Add Student</b-btn
      >
      <b-btn v-b-modal.delete-all-students-modal class="m-2" variant="danger"
        >Delete All Students</b-btn
      >
      <br />
      <FehTableWrapping
        :all="students"
        :shown="shownStudents"
        v-on:pagingChange="pagingChange"
        v-if="hasMounted"
      >
        <template v-slot:top-right>
          <div style="float: right">
            <StudentSearch v-on:update="update" :students="students" />
          </div>
        </template>
        <b-table
          id="students-table"
          striped
          hover
          :items="shownStudents"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :current-page="paging.current"
          :per-page="paging.per"
          responsive="sm"
        >
          <template #cell(keycode)="data">
            <b-form>
              <b-form-input
                @blur="updateKeycode(data.item)"
                v-on:keydown.enter.prevent="updateKeycode"
                v-model="data.item.keycode"
                :maxlength="keycodeLength"
              ></b-form-input>
            </b-form>
          </template>

          <template #cell(actions)="data">
            <div class="text-right">
              <b-button
                variant="danger"
                @click="editedStudent = data.item"
                v-b-modal.edit-student-modal
              >
                <i class="fa fa-edit" />
              </b-button>
              &nbsp;
              <b-button
                variant="danger"
                @click="deletedStudent = data.item"
                v-b-modal.delete-student-modal
                ><i class="fa fa-trash"
              /></b-button>
            </div>
          </template>
        </b-table>
      </FehTableWrapping>
    </div>

    <b-modal
      id="delete-all-students-modal"
      title="Delete All Students"
      hide-footer
    >
      <DeleteAllStudentsForm
        v-on:delete-success="deleteSuccess"
        v-bind:studentCount="students.length"
      ></DeleteAllStudentsForm>
    </b-modal>

    <b-modal id="delete-student-modal" title="Delete Student" hide-footer>
      <DeleteStudentForm
        v-on:delete-success="deleteSuccess"
        v-bind:student="deletedStudent"
      ></DeleteStudentForm>
    </b-modal>

    <b-modal id="edit-student-modal" title="Update Student" hide-footer>
      <EditStudentForm
        v-bind:student="editedStudent"
        v-bind:teams="teams"
        v-on:edit-success="editSuccess"
      ></EditStudentForm>
    </b-modal>

    <b-modal id="add-student-modal" title="Add Student" hide-footer>
      <AddStudentForm
        :teams="teams"
        v-on:update="loadStudents"
      ></AddStudentForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import StudentSearch from './StudentSearch.vue';
import DeleteAllStudentsForm from './DeleteAllStudentsForm.vue';
import DeleteStudentForm from './DeleteStudentForm.vue';
import EditStudentForm from './EditStudentForm.vue';
import AddStudentForm from './AddStudentForm.vue';
import FehTableWrapping from '../../utils/FehTableWrapping.vue';
import students from '../../../api/students';
import teams from '../../../api/teams';
import { keycodeLength } from '../../../utils/config';
@Component({
  components: {
    StudentSearch,
    DeleteAllStudentsForm,
    DeleteStudentForm,
    EditStudentForm,
    AddStudentForm,
    FehTableWrapping,
  },
})
export default class Students extends Vue {
  students: Student[] = [];
  shownStudents: Student[] = [];
  teams: Team[] = [];
  deletedStudent: Student | null = null;
  editedStudent: Student | null = null;

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
    { key: 'keycode', label: 'Key Code', sortable: false },
    { key: 'team.name', label: 'Team', sortable: true },
    { key: 'actions', sortable: false, label: '' },
  ];

  showDeleteSuccess = false;
  showEditSuccess = false;
  showUpdateKeycodeFailure = false;

  keycodeLength = keycodeLength;

  update(shownStudents: Student[]) {
    this.shownStudents = shownStudents;
  }

  mounted() {
    this.loadTeams();
    this.loadStudents();
    this.hasMounted = true;
  }

  updateKeycode(student: Student) {
    if (!student.id) {
      return;
    }
    students.updateStudentKeycode(student.id, student.keycode).then((res) => {
      if (!res.success) {
        this.showUpdateKeycodeFailure = true;
        student.keycode = '';
      }
    });
  }

  loadStudents() {
    students.getStudents().then((res) => {
      this.students = res.data;
      this.update(this.students);
    });
  }

  async loadTeams() {
    teams.getTeams().then((res) => {
      this.teams = res.data;
    });
  }

  deleteSuccess() {
    this.$bvModal.hide('delete-all-students-modal');
    this.$bvModal.hide('delete-student-modal');
    this.showDeleteSuccess = true;
    this.loadStudents();
  }

  editSuccess() {
    this.$bvModal.hide('edit-student-modal');
    this.showEditSuccess = true;
    this.loadStudents();
  }
}
</script>
