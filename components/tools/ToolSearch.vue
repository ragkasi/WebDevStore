<template>
  <b-form inline class="align-items-centered">
    <b-form-group class="mb-2 mr-2">
      <b-form-input
        v-model="text"
        type="text"
        placeholder="Search"
      ></b-form-input>
    </b-form-group>
    <b-form-group class="mb-2 mr-2">
      <b-form-select v-model="sort" :options="sortOptions"> </b-form-select>
    </b-form-group>
    <b-form-group class="mb-2 mr-2">
      <b-btn v-if="store || admin" variant="danger" to="/loans/create"
        >Add Tool</b-btn
      >
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { sortToolOptions } from '../../utils/config';
import roles from '../../shared/roles';

@Component({})
export default class ToolsSearch extends Vue {
  @Prop(Array) readonly tools!: Tool[];

  text = '';

  sort = 0;

  category = 0;

  sortOptions = sortToolOptions;

  get admin() {
    return roles.admin;
  }

  get store() {
    return roles.store;
  }

  @Watch('tools', { immediate: true, deep: true })
  onPartsChanged(val: Tool[]) {
    const toRemove: Tool[] = [];
    val.forEach((tool) => {
      if (!tool.name.toLowerCase().includes(this.text)) {
        toRemove.push(tool);
      } else if (this.sort !== 0) {
        toRemove.push(tool);
      }
    });
    const shownTools = Array.from(val);
    toRemove.forEach((tool) => {
      const index = shownTools.indexOf(tool);
      if (index !== -1) {
        shownTools.splice(index, 1);
      }
    });
    this.$emit('update', shownTools);
  }

  @Watch('text', { immediate: true })
  onTextChanged(val: string) {
    val = val.toLowerCase();
    const toRemove: Tool[] = [];
    this.tools.forEach((tool) => {
      if (!tool.name.toLowerCase().includes(val)) {
        toRemove.push(tool);
      }
    });
    const shownTools = Array.from(this.tools);
    toRemove.forEach((part) => {
      const index = shownTools.indexOf(part);
      if (index !== -1) {
        shownTools.splice(index, 1);
      }
    });

    this.$emit('update', shownTools);
  }

  @Watch('sort', { immediate: true })
  onSortChanged(val: number) {
    let shownTools: Tool[] = [];

    const indices = Array.from(this.tools.keys());
    if (val === 0) {
      indices.sort((a, b) =>
        this.tools[a].name.localeCompare(this.tools[b].name),
      );
    } else if (val == 1) {
      indices.sort((a, b) =>
        (this.tools[b].numCheckedOut / this.tools[b].quantity)
          .toString()
          .localeCompare(
            (this.tools[a].numCheckedOut / this.tools[a].quantity).toString(),
          ),
      );
    } else if (val == 2) {
      indices.sort((a, b) =>
        (this.tools[a].numCheckedOut / this.tools[a].quantity)
          .toString()
          .localeCompare(
            (this.tools[b].numCheckedOut / this.tools[b].quantity).toString(),
          ),
      );
    }
    shownTools = indices.map((i) => this.tools[i]);
    this.$emit('update', shownTools);
  }
}
</script>
