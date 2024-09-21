<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group id="input-group-message" label-for="input-message">
        <b-form-textarea
          id="input-message"
          v-model="form.message"
          placeholder="Click to edit..."
          required
        ></b-form-textarea>
      </b-form-group>
      <b-button type="submit" variant="danger"> Add Note </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import notes from '../../api/notes';
import { failToast } from '../../utils/genericUtils';

@Component({})
export default class AddNoteForm extends Vue {
  form = {
    message: '',
  };

  clearForm() {
    this.form = {
      message: '',
    };
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    notes.postNote(this.form).then((res) => {
      if (res.data.status == 'success') {
        this.clearForm();
        this.$emit('add-success');
      } else {
        failToast(this, 'Failed to create note, please try again later.');
      }
    });
  }
}
</script>
