<template>
  <div>
    <b-container>
      <b-row align-v="end">
        <b-col>
          <div class="mb-2">
            <b-form inline
              >Show
              <b-select
                v-model="paging.per"
                :options="pageCountOptions"
                class="mx-2"
                size="sm"
              >
              </b-select>
              entries
            </b-form>
          </div>
        </b-col>
        <b-col><slot name="top-right" /></b-col>
      </b-row>
    </b-container>
    <slot />
    <b-container>
      <b-row align-h="between" align-v="center">
        <b-col>
          <ShowingBlurb
            :currentPage="paging.current"
            :perPage="paging.per"
            :all="all"
            :shown="shown"
        /></b-col>
        <b-col>
          <div class="float-right">
            <b-pagination
              v-model="paging.current"
              :total-rows="paging.total"
              :per-page="paging.per"
              page-class="customPage"
              class="mb-0"
            ></b-pagination>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ShowingBlurb from './ShowingBlurb.vue';

@Component({ components: { ShowingBlurb } })
export default class FehTableWrapping extends Vue {
  @Prop({ required: false, type: Array, default: () => [10, 25, 50, 100] })
  pageCountOptions!: number[];
  @Prop({ required: false, type: Number, default: 50 }) defaultPerPage!: number;
  @Prop({ required: true, type: Array }) all!: any[];
  @Prop({ required: false, type: Array, default: null }) shown!: any[];

  paging = { per: 1, current: 1, total: 1 };
  @Watch('paging', { deep: true })
  onPagingChanged() {
    this.$emit('pagingChange', this.paging);
  }

  mounted() {
    this.paging.per = this.defaultPerPage;
    this.paging.total = this.shown ? this.shown.length : this.all.length;
  }

  // Recompute the total number of rows if/when that changes above
  updated() {
    this.paging.total = this.shown ? this.shown.length : this.all.length;
  }
}
</script>

<style>
.customPage.page-item.active .page-link {
  background-color: #ce0f3d;
  border-color: #ce0f3d;
  color: white !important;
}

.customPage.page-item:not(active) .page-link,
li.page-item > .page-link {
  color: #ce0f3d;
}

.page-link {
  color: #ce0f3d;
}

.disabled {
  color: grey !important;
}
</style>
