<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Section added!
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error adding section! Try again later.
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
        Add Section
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import sections from '../../api/sections';
import { sectionTimeOptions, sectionRoomOptions } from '../../utils/config';

@Component({})
export default class AddSectionForm extends Vue {
  form = {
    id: '',
    letter: '',
    time: '',
    room: '',
  };

  showSuccess = false;
  showFailure = false;
  disableSubmit = false;

  sectionTimeOptions = sectionTimeOptions;
  sectionRoomOptions = sectionRoomOptions;

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
    this.showSuccess = false;
    this.disableSubmit = true;

    sections.postSection(this.form).then((data) => {
      if (data.success) {
        this.clearForm();
        this.showSuccess = true;
        this.$emit('update');
      } else {
        this.showFailure = true;
      }
      this.disableSubmit = false;
    });
  }
}
</script>
