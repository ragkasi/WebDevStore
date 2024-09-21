<template>
  <FehTableWrapping
    :all="updates"
    v-on:pagingChange="pagingChange"
    v-if="hasMounted"
    :pageCountOptions="[5, 10]"
    :defaultPerPage="5"
  >
    <b-table
      striped
      hover
      :items="updates"
      :fields="updateFields"
      :sort-by.sync="updateSortBy"
      :sort-desc.sync="updateSortDesc"
      responsive="sm"
      :sort-compare="updateSortCompare"
      :current-page="paging.current"
      :per-page="paging.per"
    >
      <template #cell(updatedAt)="data">
        {{ getFormattedDate(data.item.updatedAt) }}
      </template>
      <template #cell(createdByUser)="data">
        <div v-if="data.item.createdByUser">
          {{ data.item.createdByUser.fullName }}
        </div>
        <div v-else>✖ Removed ✖</div>
      </template>
      <template #cell(createdAt)="data">
        {{ getFormattedDate(data.item.createdAt) }}
      </template>
      <template #cell(locationDetails)="data">
        <ProteusLocationDetail :base="data.item" />
      </template>
    </b-table>
  </FehTableWrapping>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ProteusLocationDetail from '../../components/protei/ProteusLocationDetail.vue';
import FehTableWrapping from '../utils/FehTableWrapping.vue';
import { formatDate } from '@/utils/genericUtils';

@Component({ components: { ProteusLocationDetail, FehTableWrapping } })
export default class ProteusUpdateTable extends Vue {
  @Prop(Array) readonly updates!: ProteusUpdate[];

  hasMounted = false;
  paging = { per: 1, current: 1, total: 1 };
  pagingChange(incoming: Paging) {
    this.paging = incoming;
  }

  updateSortBy = 'createdAt';
  updateSortDesc = true;
  /*
  For the sake of sorting the columns, it'd be better to use custom formatters.
  Too bad I didn't know they existed till now.
  https://bootstrap-vue.org/docs/components/table#formatter-callback
  */
  updateFields = [
    { key: 'createdAt', sortable: true, label: 'Date' },
    { key: 'createdByUser', sortable: true, label: 'Creator' },
    { key: 'status', sortable: true, label: 'Status' },
    { key: 'location', sortable: true, label: 'Location' },
    { key: 'locationDetails', sortable: false, label: 'Location Details' },
    { key: 'note', sortable: true, label: 'Note' },
  ];

  updateSortCompare(a: ProteusUpdate, b: ProteusUpdate, key: string) {
    if (key == 'createdByUser') {
      // Sort accounting for possibility of a null value
      if (!a[key] && !b[key]) return 0;
      if (!a[key]) return 1;
      if (!b[key]) return -1;
      if (a[key]?.fullName == b[key]?.fullName) return 0;
      return a[key]!.fullName < b[key]!.fullName ? -1 : 1;
    } else {
      return false;
    }
  }

  getFormattedDate(dateString: string) {
    return formatDate(dateString);
  }

  mounted() {
    this.hasMounted = true;
  }
}
</script>
