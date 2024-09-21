<template>
  <b-form inline class="align-items-centered">
    <b-form-group class="mb-2 mr-2">
      <b-form-select v-model="category" :options="options"> </b-form-select>
    </b-form-group>
    <b-form-group class="mb-2 mr-2">
      <b-form-select v-model="sort" :options="sortOptions"> </b-form-select>
    </b-form-group>
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
import { sortPartOptions } from '../../utils/config';
import categories from '../../api/categories';
import roles from '@/shared/roles';
@Component({})
export default class PartSearch extends Vue {
  @Prop(Array) readonly parts!: Part[];

  get admin() {
    return roles.admin;
  }

  get store() {
    return roles.store;
  }

  text = '';

  sort = 0;

  category = 'All Categories';

  options: { text: string; value: any }[] = [
    { text: 'All Categories', value: 'All Categories' },
  ];
  sortOptions = sortPartOptions;

  mounted() {
    categories.getCategories().then((res) => {
      if (res.status) {
        this.options = [{ text: 'All Categories', value: 'All Categories' }];
        res.data?.forEach((elem: Category) => {
          this.options.push({ text: elem.name, value: elem.name });
        });
      }
    });
  }

  @Watch('parts', { immediate: true, deep: true })
  onPartsChanged(val: Part[]) {
    const toRemove: Part[] = [];
    val?.forEach((part) => {
      if (
        !(
          part.name.toLowerCase().includes(this.text) ||
          (part as any).partKey.toLowerCase().includes(this.text)
        )
      ) {
        toRemove.push(part);
      } else if (
        this.category != 'All Categories' &&
        this.category != part.categoryName
      ) {
        toRemove.push(part);
      }
    });
    const shownParts = Array.from(val);
    toRemove?.forEach((part) => {
      const index = shownParts.indexOf(part);
      if (index !== -1) {
        shownParts.splice(index, 1);
      }
    });

    this.$emit('update', shownParts);
  }

  @Watch('text', { immediate: true })
  onTextChanged(val: string) {
    val = val.toLowerCase();
    const toRemove: Part[] = [];
    this.parts?.forEach((part) => {
      if (
        !(
          part.name.toLowerCase().includes(val) ||
          (part as any).partKey.toLowerCase().includes(val)
        )
      ) {
        toRemove.push(part);
      }
    });
    const shownParts = Array.from(this.parts);
    toRemove?.forEach((part) => {
      const index = shownParts.indexOf(part);
      if (index !== -1) {
        shownParts.splice(index, 1);
      }
    });
    this.$emit('update', shownParts);
  }

  @Watch('category', { immediate: true })
  onCategoryChanged(val: string) {
    let shownParts: Part[] = [];
    if (val === 'All Categories') {
      shownParts = Array.from(this.parts);
    } else {
      this.parts?.forEach((part) => {
        if (part.categoryName === val) {
          shownParts.push(part);
        }
      });
    }
    this.$emit('update', shownParts);
  }

  @Watch('sort', { immediate: true })
  onSortChanged(val: number) {
    let shownParts: Part[] = [];

    const indices = Array.from(this.parts.keys());
    if (val === 0) {
      indices.sort((a, b) =>
        this.parts[a].name.localeCompare(this.parts[b].name),
      );
    } else if (val == 1) {
      indices.sort((a, b) => this.parts[a].price - this.parts[b].price);
    } else if (val == 2) {
      indices.sort((a, b) => this.parts[b].price - this.parts[a].price);
    }
    shownParts = indices.map((i) => this.parts[i]);

    this.$emit('update', shownParts);
  }
}
</script>
