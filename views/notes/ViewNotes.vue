<template>
  <div>
    <h2>Notes</h2>
    <hr />
    <b-btn v-b-modal.add-note-modal class="m-2" variant="danger"
      >Add Note</b-btn
    >
    <b-container class="p-0">
      <b-row>
        <b-col
          v-for="note in notes"
          :key="note.id"
          href="#"
          class="flex-wrap flew-row justify-content-center"
          md="6"
          lg="4"
          xl="3"
        >
          <div>
            <b-card
              border-variant="dark"
              tag="article"
              style="max-width: 20rem"
              class="mb-2"
            >
              <b-card-header class="font-lg" header-text-variant="muted">
                <b-container>
                  <b-row align-v="center">
                    <b-col cols="8" class="p-0">
                      <b-row>
                        <b-col>
                          <small>{{ getFormattedDate(note.updatedAt) }}</small>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col>
                          <small>{{ getFormattedTime(note.updatedAt) }}</small>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col cols="4">
                      <b-btn variant="danger" @click="deleteNote(note)">
                        <b-icon icon="trash" />
                      </b-btn>
                    </b-col>
                  </b-row>
                </b-container>
              </b-card-header>
              <b-card-body class="p-1">
                <b-card-text>
                  <b-textarea
                    v-model="note.message"
                    class="lazy"
                    @change="editNote(note)"
                  ></b-textarea>
                </b-card-text>
              </b-card-body>
              <b-card-footer
                class="text-left font-sm"
                footer-text-variant="muted"
              >
                <small> Modified by {{ note.editor }} </small>
              </b-card-footer>
            </b-card>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <b-modal id="add-note-modal" title="Add Note" hide-footer>
      <AddNoteForm v-on:add-success="addSuccess"></AddNoteForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AddNoteForm from '../../components/notes/AddNoteForm.vue';
import notes from '../../api/notes';
import { successToast, failToast, formatDate } from '../../utils/genericUtils';

@Component({
  components: { AddNoteForm },
})
export default class ViewNotes extends Vue {
  notes: Note[] | null = null;

  addSuccess() {
    this.$bvModal.hide('add-note-modal');
    successToast(this, 'Note created!');
    this.update();
  }

  deleteSuccess() {
    successToast(this, 'Note deleted!');
    this.update();
  }

  editSuccess() {
    successToast(this, 'Note updated!');
    this.update();
  }

  update() {
    notes.getNotes().then((res) => {
      //auth check
      if (res.status === 403) {
        this.$router.push('/forbidden');
      }
      if (res.data.status == 'success') {
        this.notes = res.data.notes.sort((a: Note, b: Note) => {
          if (a.updatedAt == null) return 1;
          if (b.updatedAt == null) return -1;
          if (a.updatedAt == b.updatedAt) return 0;
          return a.updatedAt < b.updatedAt ? 1 : -1;
        });
      } else {
        failToast(this, 'Failed to retrieve notes. Please try again later.');
      }
    });
  }

  deleteNote(note: Note) {
    notes.deleteNote(note).then((res) => {
      if (res.data?.status == 'success') {
        this.deleteSuccess();
      } else {
        failToast(this, 'Failed to delete note. Please try again later.');
      }
    });
  }

  editNote(note: Note) {
    notes.putNote(note).then((res) => {
      if (res.data?.status == 'success') {
        this.editSuccess();
      } else {
        failToast(this, 'Failed to edit note. Please try again later.');
      }
    });
  }

  getFormattedDate(dateString: string) {
    return formatDate(dateString);
  }

  getFormattedTime(dateString: string) {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
    } as const;
    return new Intl.DateTimeFormat('default', options).format(
      new Date(dateString),
    );
  }

  mounted() {
    this.update();
  }
}
</script>
