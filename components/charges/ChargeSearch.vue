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
export default class ChargeSearch extends Vue {
  @Prop(Array) charges!: Charge[];

  text = '';

  @Watch('text')
  onTextChanged(val: string) {
    val = val.toLowerCase();
    const toRemove: Charge[] = [];
    this.charges?.forEach((charge) => {
      if (
        !(
          charge.description.toLowerCase().includes(val) ||
          charge.amount.toString().includes(val)
        )
      ) {
        toRemove.push(charge);
      }
    });
    const shownCharges = Array.from(this.charges);
    toRemove?.forEach((elem) => {
      const index = shownCharges.indexOf(elem);
      if (index !== -1) {
        shownCharges.splice(index, 1);
      }
    });

    this.$emit('update', shownCharges);
  }
}
</script>
