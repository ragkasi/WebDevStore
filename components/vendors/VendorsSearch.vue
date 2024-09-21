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
export default class VendorsSearch extends Vue {
  @Prop(Array) vendors!: Vendor[];

  text = '';

  @Watch('text')
  onTextChanged(val: string) {
    val = val.toLowerCase();
    const toRemove: Vendor[] = [];
    this.vendors?.forEach((elem) => {
      if (!elem.name.toLowerCase().includes(val)) {
        toRemove.push(elem);
      }
    });
    const shownVendors = Array.from(this.vendors);
    toRemove?.forEach((elem) => {
      const index = shownVendors.indexOf(elem);
      if (index !== -1) {
        shownVendors.splice(index, 1);
      }
    });

    this.$emit('update', shownVendors);
  }
}
</script>
