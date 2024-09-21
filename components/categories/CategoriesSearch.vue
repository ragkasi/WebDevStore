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
export default class CategoriesSearch extends Vue {
  @Prop(Array) categories!: Category[];

  text = '';

  @Watch('text')
  onTextChanged(val: string) {
    val = val.toLowerCase();
    const toRemove: Category[] = [];
    this.categories?.forEach((elem) => {
      if (!elem.name.toLowerCase().includes(val)) {
        toRemove.push(elem);
      }
    });
    const shownCategories = Array.from(this.categories);
    toRemove?.forEach((elem) => {
      const index = shownCategories.indexOf(elem);
      if (index !== -1) {
        shownCategories.splice(index, 1);
      }
    });

    this.$emit('update', shownCategories);
  }
}
</script>
