<template>
  <div>
    <h2>Sections</h2>
    <hr />

    <b-alert variant="success" v-model="showDeleteSuccess" dismissible>
      Section deleted!
    </b-alert>

    <b-alert variant="success" v-model="showEditSuccess" dismissible>
      Section updated!
    </b-alert>

    <b-btn v-b-modal.add-section-modal class="m-2" variant="danger"
      >Add Section</b-btn
    >

    <div class="mt-2">
      <b-table
        striped
        hover
        :items="sections"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        responsive="sm"
      >
        <template #cell(instructors)="data">
          <div v-for="instructor in data.value" :key="instructor.id">
            • {{ instructor.firstName }} {{ instructor.lastName }}
          </div>
        </template>

        <template #cell(actions)="data">
          <div class="text-right">
            <b-button
              variant="danger"
              @click="editedSection = data.item"
              v-b-modal.edit-section-modal
            >
              <i class="fa fa-edit" />
            </b-button>
            &nbsp;
            <b-button
              variant="danger"
              @click="deletedSection = data.item"
              v-b-modal.delete-section-modal
              ><i class="fa fa-trash"
            /></b-button>
          </div>
        </template>
      </b-table>
    </div>

    <b-modal id="add-section-modal" title="Add Section" hide-footer>
      <AddSectionForm v-on:update="update"></AddSectionForm>
    </b-modal>

    <b-modal id="edit-section-modal" title="Update Section" hide-footer>
      <EditSectionForm
        v-on:edit-success="editSuccess"
        v-bind:section="editedSection"
      ></EditSectionForm>
    </b-modal>

    <b-modal id="delete-section-modal" title="Delete Section" hide-footer>
      <DeleteSectionForm
        v-on:delete-success="deleteSuccess"
        v-bind:section="deletedSection"
      ></DeleteSectionForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AddSectionForm from '../../components/sections/AddSectionForm.vue';
import EditSectionForm from '../../components/sections/EditSectionForm.vue';
import DeleteSectionForm from '../../components/sections/DeleteSectionForm.vue';
import sections from '../../api/sections';

@Component({
  components: { AddSectionForm, EditSectionForm, DeleteSectionForm },
})
export default class ViewSections extends Vue {
  sections: Section[] | null = null;
  editedSection: Section | null = null;
  deletedSection: Section | null = null;

  showDeleteSuccess = false;
  showEditSuccess = false;

  sortBy = 'name';
  sortDesc = false;
  fields = [
    { key: 'letter', sortable: true, label: 'Section' },
    { key: 'time', sortable: true },
    { key: 'room', sortable: true },
    { key: 'instructors', sortable: true },
    { key: 'actions', sortable: false, label: '' },
  ];

  deleteSuccess() {
    this.$bvModal.hide('delete-section-modal');
    this.showDeleteSuccess = true;
    this.update();
  }

  editSuccess() {
    this.$bvModal.hide('edit-section-modal');
    this.showEditSuccess = true;
    this.update();
  }

  update() {
    sections.getSections().then((res) => {
      //auth check
      if (res.status === 403) {
        this.$router.push('/forbidden').catch(() => {});
      }
      this.sections = res.data;
    });
  }

  mounted() {
    this.update();
  }
}
</script>
