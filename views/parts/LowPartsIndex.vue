<template>
  <div>
    <h2>Low Parts</h2>
    <hr />
    <p>The following parts are running low.</p>
    <hr />
    <b-card no-body>
      <LowPartsTable
        v-if="gotLowParts && lowParts.length"
        :lowParts="lowParts"
      ></LowPartsTable>
      <p v-else-if="gotLowParts && lowParts.length == 0">
        <b>No parts under their reorder threshold.</b>
      </p>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import roles from '../../shared/roles';

import parts from '../../api/parts';
import LowPartsTable from '../../components/parts/LowPartsTable.vue';

@Component({
  components: { LowPartsTable },
})
export default class LowPartsIndex extends Vue {
  showFailure = false;

  isLoading = false;

  lowParts: Part[] = [];
  gotLowParts: boolean = false;

  get admin() {
    return roles.admin;
  }

  get store() {
    return roles.store;
  }

  mounted() {
    if (this.store || this.admin) {
      parts.getParts().then((res) => {
        this.lowParts = res.data?.filter(
          (elem: Part) => elem.quantity <= elem.reorderThreshold,
        );
        this.gotLowParts = true;
      });
    }
  }
}
</script>
