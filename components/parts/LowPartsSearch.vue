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
export default class LowPartsSearch extends Vue {
  @Prop(Array) lowParts!: Part[];

  text = '';

  @Watch('text')
  onTextChanged(val: string) {
    val = val.toLowerCase();
    const toRemove: Part[] = [];
    this.lowParts?.forEach((elem) => {
      if (
        !(
          elem.name.toLowerCase().includes(val) ||
          elem.quantity.toString().includes(val) ||
          elem.reorderThreshold.toString().includes(val) ||
          elem.vendorName.toLowerCase().includes(val)
        )
      ) {
        toRemove.push(elem);
      }
    });
    const shownLowParts = Array.from(this.lowParts);
    toRemove?.forEach((elem) => {
      const index = shownLowParts.indexOf(elem);
      if (index !== -1) {
        shownLowParts.splice(index, 1);
      }
    });

    this.$emit('update', shownLowParts);
  }
}
</script>
