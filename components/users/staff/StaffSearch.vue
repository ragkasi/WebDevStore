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
export default class StaffSearch extends Vue {
  @Prop(Array) staff!: User[];

  text = '';

  @Watch('text')
  onTextChanged(val: string) {
    val = val.toLowerCase();
    const toRemove: User[] = [];
    this.staff?.forEach((user) => {
      if (
        !(
          user.username.toLowerCase().includes(val) ||
          user.firstName.toLowerCase().includes(val) ||
          user.lastName.toLowerCase().includes(val)
        )
      ) {
        toRemove.push(user);
      }
    });
    const shownStaff = Array.from(this.staff);
    toRemove?.forEach((elem) => {
      const index = shownStaff.indexOf(elem);
      if (index !== -1) {
        shownStaff.splice(index, 1);
      }
    });

    this.$emit('update', shownStaff);
  }
}
</script>
