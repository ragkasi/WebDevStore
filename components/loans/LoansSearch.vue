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
export default class LoansSearch extends Vue {
  @Prop(Array) loans!: Loan[];

  text = '';

  @Watch('text')
  onTextChanged(val: string) {
    val = val.toLowerCase();
    const toRemove: Loan[] = [];
    this.loans?.forEach((elem) => {
      if (
        !(
          elem.item.toLowerCase().includes(val) ||
          elem.description.toLowerCase().includes(val) ||
          elem.teamName.toLowerCase().includes(val) ||
          new Date(elem.checkOutTime)
            .toLocaleString()
            .toLowerCase()
            .includes(val) ||
          new Date(elem.checkInTime)
            .toLocaleString()
            .toLowerCase()
            .includes(val)
        )
      ) {
        toRemove.push(elem);
      }
    });
    const shownLoans = Array.from(this.loans);
    toRemove?.forEach((elem) => {
      const index = shownLoans.indexOf(elem);
      if (index !== -1) {
        shownLoans.splice(index, 1);
      }
    });

    this.$emit('update', shownLoans);
  }
}
</script>
