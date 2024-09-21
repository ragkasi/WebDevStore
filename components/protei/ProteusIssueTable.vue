<template>
  <FehTableWrapping
    :all="issues"
    v-on:pagingChange="pagingChange"
    v-if="hasMounted"
    :pageCountOptions="[5, 10]"
    :defaultPerPage="5"
  >
    <b-table
      striped
      hover
      :items="issues"
      :fields="issueFields"
      :sort-by.sync="issueSortBy"
      :sort-desc.sync="issueSortDesc"
      responsive="sm"
      :sort-compare="issueSortCompare"
      :current-page="paging.current"
      :per-page="paging.per"
    >
      <template #cell(updatedAt)="data">
        {{ getFormattedDate(data.item.updatedAt) }}
      </template>
      <template #cell(updatedByUser)="data">
        <div v-if="data.item.updatedByUser">
          {{ data.item.updatedByUser.fullName }}
        </div>
        <div v-else>✖ Removed ✖</div>
      </template>
      <template #cell(issueTypes)="data">
        <div>
          <ul class="mb-0">
            <li v-for="type in data.item.issueTypes" :key="`issueType-${type}`">
              {{ type }}
            </li>
          </ul>
        </div>
      </template>
      <template #cell(actions)="data">
        <div class="text-right">
          <b-button
            variant="danger"
            :href="`/protei/${proteus.number}/issues/${data.item.id}`"
          >
            <i class="fa fa-eye" />
            /
            <i class="fa fa-edit" />
          </b-button>
        </div>
      </template>
    </b-table>
  </FehTableWrapping>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { formatDate } from '@/utils/genericUtils';
import FehTableWrapping from '../utils/FehTableWrapping.vue';

@Component({ components: { FehTableWrapping } })
export default class ProteusIssueTable extends Vue {
  @Prop(Array) readonly issues!: ProteusIssue[];
  @Prop(Object) readonly proteus!: Proteus;

  hasMounted = false;
  paging = { per: 1, current: 1, total: 1 };
  pagingChange(incoming: Paging) {
    this.paging = incoming;
  }

  issueSortBy = 'updatedAt';
  issueSortDesc = true;
  issueFields = [
    { key: 'updatedAt', sortable: true, label: 'Updated' },
    { key: 'updatedByUser', sortable: true, label: 'Updator' },
    { key: 'issueTypes', sortable: false, label: 'Types' },
    { key: 'actions', sortable: false, label: '' },
  ];

  issueSortCompare(a: ProteusIssue, b: ProteusIssue, key: string) {
    if (key == 'updatedByUser') {
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
