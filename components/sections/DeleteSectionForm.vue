<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error deleting section! Try again later.
    </b-alert>
    <b-form @submit="onSubmit">
      <b-alert variant="danger" show
        >Are you sure you want to delete section:
        <p class="font-weight-bolder">
          {{ section.letter }} {{ section.time }} {{ section.room }}?
        </p></b-alert
      >
      <div></div>

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Delete
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import sections from '../../api/sections';

@Component({ props: { section: Object } })
export default class DeleteSectionForm extends Vue {
  showFailure = false;
  disableSubmit = false;

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.showFailure = false;
    this.disableSubmit = true;

    sections.deleteSection(this.$props.section.id).then((data) => {
      if (data.success) {
        this.$emit('delete-success');
      } else {
        this.showFailure = true;
      }
      this.disableSubmit = false;
    });
  }
}
</script>
