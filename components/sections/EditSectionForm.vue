<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error updating section! Try again later.
    </b-alert>
    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-letter"
        label="Letter:"
        label-for="input-letter"
      >
        <b-form-input
          id="input-letter"
          v-model="form.letter"
          placeholder="Section Letter"
          :maxLength="1"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-time" label="Time:" label-for="input-time">
        <b-form-select
          id="input-time"
          v-model="form.time"
          placeholder="Section Time"
          required
          :options="sectionTimeOptions"
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-room" label="Room:" label-for="input-room">
        <b-form-select
          id="input-room"
          v-model="form.room"
          placeholder="Section Room"
          :options="sectionRoomOptions"
          required
        ></b-form-select>
      </b-form-group>

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Update
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import sections from '../../api/sections';
import { sectionTimeOptions, sectionRoomOptions } from '../../utils/config';

@Component({ props: { section: Object } })
export default class EditSectionForm extends Vue {
  form = {
    id: '',
    letter: '',
    time: '',
    room: '',
  };

  showFailure = false;
  disableSubmit = false;

  sectionTimeOptions = sectionTimeOptions;
  sectionRoomOptions = sectionRoomOptions;

  mounted() {
    const section = this.$props.section;
    this.form = {
      id: '',
      letter: section.letter,
      time: section.time,
      room: section.room,
    };
  }

  clearForm() {
    this.form = {
      id: '',
      letter: '',
      time: '',
      room: '',
    };
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.showFailure = false;
    this.disableSubmit = true;

    sections.putSection(this.$props.section.id, this.form).then((data) => {
      if (data.success) {
        this.clearForm();
        this.$emit('edit-success');
      } else {
        this.showFailure = true;
      }
      this.disableSubmit = false;
    });
  }
}
</script>
