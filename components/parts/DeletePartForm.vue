<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error deleting part! Try again later.
    </b-alert>
    <b-form @submit="onSubmit">
      <b-alert variant="danger" show
        >Are you sure you want to delete part
        <span class="font-weight-bolder"> {{ part.name.toUpperCase() }}</span
        >?
        <br />
      </b-alert>
      <div></div>

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Delete
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import parts from '../../api/parts';

@Component({})
export default class DeletePartForm extends Vue {
  @Prop(Object) part!: Part;

  showFailure = false;
  disableSubmit = false;

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.showFailure = false;
    this.disableSubmit = true;

    parts.deletePart(this.part.id).then((data) => {
      if (data.success) {
        this.$emit('update');
      } else {
        this.showFailure = true;
      }
      this.disableSubmit = false;
    });
  }
}
</script>
