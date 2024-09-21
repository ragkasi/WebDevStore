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
export default class OrderedPartsSearch extends Vue {
  @Prop(Array) parts!: Part[];

  text = '';

  @Watch('text')
  onTextChanged(val: string) {
    val = val.toLowerCase();
    const toRemove: Part[] = [];
    this.parts?.forEach((elem) => {
      if (
        !(
          elem.name.toLowerCase().includes(val) ||
          elem.partKey.toLowerCase().includes(val)
        )
      ) {
        toRemove.push(elem);
      }
    });
    const shownParts = Array.from(this.parts);
    toRemove?.forEach((elem) => {
      const index = shownParts.indexOf(elem);
      if (index !== -1) {
        shownParts.splice(index, 1);
      }
    });

    this.$emit('update', shownParts);
  }
}
</script>
