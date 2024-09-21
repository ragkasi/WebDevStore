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
export default class ReturnPartsSearch extends Vue {
  @Prop(Array) returns!: Return[];

  text = '';

  @Watch('text')
  onTextChanged(val: string) {
    val = val.toLowerCase();
    const toRemove: Return[] = [];
    this.returns?.forEach((elem) => {
      if (
        !(
          new Date(elem.dateSubmitted)
            .toLocaleString()
            .toLowerCase()
            .includes(val) ||
          elem.team.toLowerCase().includes(val) ||
          Number(-1 * elem.totalRefund)
            .toLocaleString('us-US', {
              style: 'currency',
              currency: 'USD',
            })
            .includes(val)
        )
      ) {
        toRemove.push(elem);
      }
    });
    const shownReturns = Array.from(this.returns);
    toRemove?.forEach((elem) => {
      const index = shownReturns.indexOf(elem);
      if (index !== -1) {
        shownReturns.splice(index, 1);
      }
    });

    this.$emit('update', shownReturns);
  }
}
</script>
