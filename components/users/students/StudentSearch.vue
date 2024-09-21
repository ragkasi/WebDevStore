<template>
  <b-form inline class="align-items-centered">
    <b-form-group class="mb-2 mr-2">
      <b-form-input
        v-model="text"
        type="text"
        placeholder="Search"
      ></b-form-input>
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class StudentSearch extends Vue {
  @Prop(Array) students!: Student[];

  text = '';

  @Watch('text')
  onTextChanged(val: string) {
    val = val.toLowerCase();
    const toRemove: Student[] = [];
    this.students?.forEach((student) => {
      if (
        !(
          student.username.toLowerCase().includes(val) ||
          student.firstName.toLowerCase().includes(val) ||
          student.lastName.toLowerCase().includes(val) ||
          student.keycode.toString().toLowerCase().includes(val) ||
          student.team?.name.toLowerCase().includes(val)
        )
      ) {
        toRemove.push(student);
      }
    });
    const shownStudents = Array.from(this.students);
    toRemove?.forEach((elem) => {
      const index = shownStudents.indexOf(elem);
      if (index !== -1) {
        shownStudents.splice(index, 1);
      }
    });

    this.$emit('update', shownStudents);
  }
}
</script>
