<template>
  <div v-if="protei">
    <b-form class="align-items-centered">
      <b-form-group class="mb-2 mr-2">
        <b-container class="p-1">
          <b-row>
            <b-col>
              <b-form-input
                v-model="filterObject.searchText"
                type="text"
                placeholder="Search"
                debounce="250"
              ></b-form-input>
            </b-col>
            <b-col>
              <b-form-select
                :options="issueTypeOptions"
                v-model="filterObject.issueType"
                v-if="proteusDeveloper"
              ></b-form-select>
            </b-col>
          </b-row>
        </b-container>
      </b-form-group>
    </b-form>
    <FehTableWrapping
      :all="protei"
      :shown="filteredProtei"
      v-if="hasMounted"
      v-on:pagingChange="pagingChange"
    >
      <b-table
        striped
        hover
        :items="protei"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-compare="sortCompare"
        responsive="sm"
        :current-page="paging.current"
        :per-page="paging.per"
        :filter-function="filterProtei"
        :filter="filterObject"
        @filtered="onFiltered"
      >
        <template #cell(updatedAt)="data">
          {{ getFormattedDate(data.value) }}
        </template>

        <template #cell(locationDetails)="data">
          <div class="truncate">
            <ProteusLocationDetail :base="data.item" :truncate="true" />
          </div>
        </template>

        <template #cell(actions)="data">
          <div class="text-right">
            <b-button
              variant="danger"
              v-bind:href="`/protei/${data.item.number}/details`"
            >
              <i class="fa fa-eye" />
            </b-button>
            &nbsp;
            <b-button
              variant="danger"
              @click="selectProteus(data.item)"
              v-b-modal.edit-proteus-modal
            >
              <i class="fa fa-edit" />
            </b-button>
            &nbsp;
            <b-button
              variant="danger"
              v-if="proteusDeveloper"
              @click="selectProteus(data.item)"
              v-b-modal.delete-proteus-modal
              ><i class="fa fa-trash"
            /></b-button>
          </div>
        </template>
      </b-table>
    </FehTableWrapping>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { formatDate } from '@/utils/genericUtils';
import ProteusLocationDetail from '../../components/protei/ProteusLocationDetail.vue';
import FehTableWrapping from '../utils/FehTableWrapping.vue';
import roles from '../../shared/roles';
import { ProteusIssueTypes } from '../../utils/config';

@Component({
  components: { ProteusLocationDetail, FehTableWrapping },
})
export default class ProteusTable extends Vue {
  @Prop(Array) readonly protei!: Proteus[];

  filterObject = {
    searchText: '',
    issueType: '',
  };
  filteredProtei: Proteus[] = this.protei ?? [];
  hasMounted = false;

  sortBy = 'updatedAt';
  sortDesc = true;
  fields = [
    { key: 'number', sortable: true, label: '#' },
    { key: 'status', sortable: true, label: 'Status' },
    { key: 'updatedAt', sortable: true, label: 'Updated' },
    { key: 'location', sortable: true, label: 'Location' },
    { key: 'locationDetails', sortable: true, label: 'Location Details' },
    { key: 'actions', sortable: false, label: '' },
  ];

  sortCompare(a: Proteus, b: Proteus, key: string): number | boolean {
    switch (key) {
      case 'location':
        if (!a['location'] && !b['location']) return 0;
        if (!a['location']) return 1;
        if (!b['location']) return -1;
        // If the locations are the same, sort by the detail string
        if (a['location']! === b['location']!) {
          return this.sortCompare(a, b, 'locationDetails');
        }
        return a['location']?.localeCompare(b['location']!);
      case 'locationDetails': {
        let aString = this.getLocationDetailString(a);
        let bString = this.getLocationDetailString(b);
        if (!aString && !bString) return 0;
        if (!aString) return 1;
        if (!bString) return -1;
        return aString.localeCompare(bString);
      }
      default:
        // If none keys above, return false to allow default sorting.
        return false;
    }
  }

  filterProtei(
    proteus: Proteus,
    filterObject: { searchText: string; issueType: string },
  ) {
    const proteusString = this.toSearchString(proteus);
    const stringMatch = proteusString.includes(
      filterObject.searchText.toLowerCase(),
    );

    const issueTypes = proteus.issues
      ?.filter((issue) => !issue.resolved)
      ?.map((issue) => issue.issueTypes)
      .flat();
    let issueTypeMatch = issueTypes?.includes(filterObject.issueType) ?? false;
    // Only filter by issue when an issue has been selected
    issueTypeMatch = issueTypeMatch || filterObject.issueType == '';

    return stringMatch && issueTypeMatch;
  }

  onFiltered(filteredItems: Proteus[]) {
    this.filteredProtei = filteredItems;
    this.paging.current = 1;
  }

  toSearchString(p: Proteus) {
    return `
    ${p.number}
    ${p.status}
    ${p.location}
    ${this.getLocationDetailString(p)}
    `.toLowerCase();
  }

  get issueTypeOptions() {
    let issueOptions = [{ text: 'Filter by issue...', value: '' }];
    issueOptions = issueOptions.concat(
      ProteusIssueTypes.map((type) => {
        return {
          text: type,
          value: type,
        };
      }),
    );
    return issueOptions;
  }

  paging = { per: 1, current: 1, total: 1 };
  pagingChange(incoming: Paging) {
    this.paging = incoming;
  }

  mounted() {
    // Set all the pagination and search boxes correct
    this.onFiltered(this.protei);
    this.hasMounted = true;
  }

  /*
  Given a proteus and it's location, returns the correct "detail" string.
  Ex: Location 'TA', returns "Michael Taylor.3232".
  Ex: Location 'Team', returns "A1"
  */
  getLocationDetailString(a: Proteus): string {
    switch (a['location']) {
      case 'Team':
        return a?.team?.name ?? '';
      case 'Store':
        return a?.storeLocationDetails ?? '';
      case 'TA':
        return a?.user?.fullName ?? '';
      case 'Other':
        return a?.otherLocationDetails ?? '';
    }
    return '';
  }

  getFormattedDate(dateString: string) {
    return formatDate(dateString);
  }

  get proteusDeveloper() {
    return roles.proteusDeveloper;
  }

  selectProteus(p: Proteus) {
    this.$emit('select-proteus', p);
  }
}
</script>
