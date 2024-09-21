<template>
  <div>
    <h2>Parts</h2>
    <hr />
    <div class="mb-3" v-if="store || admin">
      <b-button variant="danger" to="/parts/create">Add Part</b-button>
      <span>&ensp;</span>
      <b-button variant="secondary" to="/categories"
        >Manage Categories</b-button
      >
      <span>&ensp;</span>
      <b-button variant="danger" to="/vendors">Manage Vendors</b-button>
      <span>&ensp;</span>
      <b-button variant="secondary" to="/parts/lowparts"
        >See Low Parts</b-button
      >
      <span>&ensp;</span>
      <vue-excel-xlsx
        class="btn btn-danger"
        :data="parts"
        :columns="columns"
        :file-name="'Inventory_Report(' + getDateTime() + ')'"
        :file-type="'xlsx'"
        :sheet-name="'sheetname'"
      >
        <i class="fa fa-download" /> Inventory Report
      </vue-excel-xlsx>
    </div>
    <hr />
    <PartSearch :parts="parts" v-on:update="update"></PartSearch>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error getting parts!
    </b-alert>
    <div v-if="!isLoading" class="loader"></div>
    <PartList v-else :parts="shownParts" v-on:update="refresh"></PartList>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '../../api/parts';

import PartList from '../../components/parts/PartList.vue';
import PartSearch from '../../components/parts/PartSearch.vue';
import roles from '../../shared/roles';

@Component({
  components: {
    PartList,
    PartSearch,
  },
})
export default class PartIndex extends Vue {
  showFailure = false;
  isLoading = false;

  parts: Part[] = [];

  shownParts: Part[] = null as any;

  columns = [
    {
      label: 'Part #',
      field: 'partKey',
    },
    {
      label: 'Part Name',
      field: 'name',
    },
    {
      label: 'Part Category',
      field: 'categoryName',
    },
    {
      label: 'Part Vendor',
      field: 'vendorName',
    },
    {
      label: 'Quantity',
      field: 'quantity',
    },
    {
      label: 'Price',
      field: 'price',
      dataFormat: (value: number) => {
        return Number(value).toLocaleString('us-US', {
          style: 'currency',
          currency: 'USD',
        });
      },
    },
  ];

  getDateTime() {
    const date = new Date();
    return (
      date.getFullYear() +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2) +
      ' ' +
      ('0' + date.getHours()).slice(-2) +
      '_' +
      ('0' + date.getMinutes()).slice(-2) +
      '_' +
      ('0' + date.getSeconds()).slice(-2)
    );
  }

  get admin() {
    return roles.admin;
  }

  get store() {
    return roles.store;
  }

  update(shownParts: Part[]) {
    this.shownParts = shownParts;
  }

  refresh() {
    this.isLoading = false;
    api.getParts().then((res) => {
      if (!res.success) {
        if (res.status === 402) {
          this.$router.push('/overdue');
        } else {
          this.showFailure = true;
        }
      } else {
        this.parts = res.data;
        const indices = Array.from(this.parts.keys());

        // Initial sorting of parts
        indices.sort((a, b) =>
          this.parts[a]?.name.localeCompare(this.parts[b]?.name),
        );
        this.parts = indices.map((i) => this.parts[i]);
        this.update(this.parts);
        this.isLoading = true;
      }
    });
  }

  mounted() {
    this.refresh();
  }
}
</script>

<style>
.loader {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #ce0f3d;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
