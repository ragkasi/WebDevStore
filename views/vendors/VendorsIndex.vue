<template>
  <div>
    <h2>Part Vendors</h2>
    <hr />
    <div class="mb-3">
      <b-button variant="danger" v-b-modal="'add-vendor-modal'"
        >Add Part Vendor</b-button
      >
    </div>
    <div class="mt-2">
      <FehTableWrapping
        :all="vendors"
        :shown="shownVendors"
        v-on:pagingChange="pagingChange"
        v-if="hasMounted"
        :defaultPerPage="10"
      >
        <template v-slot:top-right>
          <div style="float: right">
            <VendorsSearch v-on:update="update" :vendors="vendors" />
          </div>
        </template>
        <b-table
          id="vendors-table"
          striped
          hover
          :items="shownVendors"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :current-page="paging.current"
          :per-page="paging.per"
          responsive="sm"
        >
          <template #cell(name)="data">
            {{ data.value }}
          </template>
          <template #cell(actions)="data">
            <div v-if="data.item.name != 'Unknown'">
              <b-button
                class="button"
                variant="danger"
                style="padding: 3px 6px"
                v-on:click="deleteVendor(data.item.id, data.index)"
              >
                <i class="fa fa-trash" />
              </b-button>
              <span>&ensp;</span>
              <b-button
                class="button"
                variant="danger"
                style="padding: 3px 6px"
                v-on:click="showEditVendorModal(data.item.id)"
              >
                <i class="fa fa-edit" />
              </b-button>
            </div>
            <span v-else>Cannot Edit or Remove</span>
          </template>
        </b-table>
      </FehTableWrapping>
    </div>
    <b-modal id="add-vendor-modal" title="Add Part Vendor" hide-footer>
      <AddVendorForm v-on:refresh="refresh" />
    </b-modal>
    <b-modal
      id="edit-vendor-modal"
      ref="edit-vendor-modal"
      title="Edit Part Vendor"
      hide-footer
    >
      <EditVendorForm :id="vendorId" v-on:refresh="refresh" />
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VendorsSearch from '../../components/vendors/VendorsSearch.vue';
import AddVendorForm from '../../components/vendors/AddVendorForm.vue';
import EditVendorForm from '../../components/vendors/EditVendorForm.vue';
import FehTableWrapping from '../../components/utils/FehTableWrapping.vue';
import api from '../../api/vendors';
import roles from '../../shared/roles';

@Component({
  components: {
    VendorsSearch,
    AddVendorForm,
    EditVendorForm,
    FehTableWrapping,
  },
})
export default class VendorsIndex extends Vue {
  vendors: Vendor[] = [];
  shownVendors: Vendor[] = [];

  hasMounted = false;
  paging = { per: 1, current: 1, total: 1 };
  pagingChange(incoming: Paging) {
    this.paging = incoming;
  }

  vendorId = '';

  sortBy = 'name';
  sortDesc = false;
  fields = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  update(shownVendors: Vendor[]) {
    this.shownVendors = shownVendors;
  }

  deleteVendor(id: string, idx: number) {
    api.deleteVendor(id).then((res) => {
      if (res.data.status == 'success') {
        this.vendors.splice(idx, 1);
      }
    });
  }

  showEditVendorModal(id: string) {
    this.vendorId = id;
    (this.$refs['edit-vendor-modal'] as Vue & { show: () => boolean }).show();
  }

  refresh() {
    api.getVendors().then((res) => {
      if (res.status) {
        this.vendors = res.data;
        this.shownVendors = res.data;
      }
    });
  }

  mounted() {
    if (roles.student) {
      this.$router.push('/forbidden');
      return;
    }
    this.refresh();
    this.hasMounted = true;
  }
}
</script>
