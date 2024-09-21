<template>
  <div v-if="shown">
    <p style="float: left; margin: 10px">
      Showing
      {{ shown.length ? (currentPage - 1) * perPage + 1 : 0 }}
      to {{ Math.min(currentPage * perPage, shown.length) }} of
      {{ shown.length }} entries
      <span v-if="shown.length != all.length">
        (filtered from {{ all.length }} total entries)
      </span>
    </p>
  </div>
  <div v-else>
    Showing
    {{ all.length ? (currentPage - 1) * perPage + 1 : 0 }}
    to
    {{ Math.min(currentPage * perPage, all.length) }}
    of {{ all.length }} entries
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class ShowingBlurb extends Vue {
  @Prop(Number) currentPage!: number;
  @Prop(Number) perPage!: number;
  @Prop(Array) all!: any[];
  @Prop({ required: false, type: Array, default: null }) shown!: any[];
}
</script>
