<template>
  <div>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error deleting student! Try again later.
    </b-alert>
    <b-form @submit="onSubmit">
      <b-alert variant="danger" show
        >Are you sure you want to delete this student?
        <br />
        <span class="font-weight-bolder">
          {{ student.firstName }} {{ student.username }}
        </span></b-alert
      >
      <div></div>

      <b-button type="submit" variant="danger" :disabled="disableSubmit">
        Delete
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import students from '../../../api/students';

@Component({})
export default class DeleteStudentForm extends Vue {
  @Prop(Object) student!: Student;

  showFailure = false;
  disableSubmit = false;

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.showFailure = false;
    this.disableSubmit = true;

    if (!this.student?.id) {
      return;
    }

    students.deleteStudent(this.student.id).then((data) => {
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
