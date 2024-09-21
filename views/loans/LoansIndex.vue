<template>
  <div>
    <h2>Loans</h2>
    <hr />
    <p>
      Items are available for loan at the store on a first come, first served
      basis. In addition to the tools shown below, parts can be checked out as
      long as they are returned in their original condition. Loans have a
      <strong>one hour limit</strong> and teams will be locked out of the store
      for overdue loans.
    </p>
    <hr />
    <div v-if="store || admin">
      <b-btn variant="danger" v-b-modal.loan-part-modal class="m-2"
        >Loan Parts</b-btn
      >
      <b-btn variant="danger" v-b-modal.return-modal class="m-2"
        >Return Item(s)</b-btn
      >

      <b-btn variant="danger" v-b-modal.renew-modal class="m-2"
        >Renew Item(s)</b-btn
      >
      <br />
      <br />
    </div>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Tools" active title-link-class="osu-link">
          <ToolSearch :tools="tools" v-on:update="updateTools"></ToolSearch>
          <CommonTools
            v-if="gotCommonTools"
            v-on:refresh="refreshTools"
            v-on:update="getCurrentLoans"
            :commonTools="commonTools"
          />
          <br />
          <div v-if="!isLoading" class="loader"></div>
          <ToolList
            v-else
            :tools="shownTools"
            v-on:refresh="refreshTools"
            v-on:update="getCurrentLoans"
          ></ToolList>
        </b-tab>
        <b-tab
          v-if="admin || store"
          title-link-class="osu-link"
          @click="getCurrentLoans"
        >
          <template #title>
            Current Loans
            <b-badge style="background-color: #ce0f3d">{{
              currentLoans.length
            }}</b-badge>
          </template>
          <CurrentLoans
            v-if="gotPastLoans && gotCurrentLoans"
            :currentLoans="currentLoans"
            :key="keyForCurrentLoans"
            v-on:update="currentLoansEmittedUpdate"
          ></CurrentLoans>
        </b-tab>
        <b-tab
          v-if="admin || store"
          title-link-class="osu-link"
          @click="getPastLoans"
        >
          <template #title>
            Past Loans
            <b-badge style="background-color: #ce0f3d">{{
              pastLoans.length
            }}</b-badge>
          </template>
          <PastLoans
            v-if="gotPastLoans && gotCurrentLoans"
            :pastLoans="pastLoans"
            :key="pastLoans.length"
          ></PastLoans>
        </b-tab>
        <b-tab
          v-if="admin || store"
          title-link-class="osu-link"
          @click="getLostLoans"
        >
          <template #title>
            Lost Loans
            <b-badge style="background-color: #ce0f3d">{{
              lostLoans.length
            }}</b-badge>
          </template>
          <LostLoans
            v-if="gotPastLoans && gotCurrentLoans && gotLostLoans"
            :lostLoans="lostLoans"
            :key="lostLoans.length"
            v-on:update="lostLoansEmittedUpdate"
          ></LostLoans>
        </b-tab>
      </b-tabs>
    </b-card>
    <b-modal id="loan-part-modal" title="Loan Part" hide-footer>
      <LoanPartForm
        :parts="parts"
        v-on:update="loanToolsEmittedUpdate"
      ></LoanPartForm>
    </b-modal>
    <b-modal id="return-modal" title="Return Tools" hide-footer>
      <ReturnForm
        v-on:update="returnToolsEmittedUpdate"
        :tools="shownTools"
      ></ReturnForm>
    </b-modal>

    <b-modal id="renew-modal" title="Renew Loans" hide-footer>
      <RenewForm
        v-on:update="renewToolsEmittedUpdate"
        :tools="shownTools"
      ></RenewForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import roles from '../../shared/roles';
import LoanPartForm from '../../components/loans/LoanPartForm.vue';
import ReturnForm from '../../components/loans/ReturnForm.vue';
import RenewForm from '../../components/loans/RenewForm.vue';
import ToolList from '../../components/tools/ToolList.vue';
import ToolSearch from '../../components/tools/ToolSearch.vue';
import CommonTools from '../../components/tools/CommonTools.vue';
import PastLoans from '../../components/loans/PastLoans.vue';
import CurrentLoans from '../../components/loans/CurrentLoans.vue';
import LostLoans from '../../components/loans/LostLoans.vue';

import tools from '../../api/tools';
import parts from '../../api/parts';
import loans from '../../api/loans';
import { successToast } from '../../utils/genericUtils';

@Component({
  components: {
    LoanPartForm,
    ReturnForm,
    RenewForm,
    ToolSearch,
    ToolList,
    CommonTools,
    PastLoans,
    CurrentLoans,
    LostLoans,
  },
})
export default class LoanIndex extends Vue {
  showFailure = false;

  isLoading = false;

  gotPastLoans = false;
  gotCurrentLoans = false;
  gotLostLoans = false;

  gotCommonTools = false;

  pastLoans: Loan[] = [];
  currentLoans: Loan[] = [];
  lostLoans: Loan[] = [];

  keyForCurrentLoans = 0;

  parts: Part[] = [];

  commonTools: Tool[] = [];

  tools: Tool[] = [];

  shownTools: Tool[] = null as any;

  get admin() {
    return roles.admin;
  }

  get store() {
    return roles.store;
  }

  updateTools(shownTools: Tool[]) {
    this.shownTools = shownTools;
  }

  refreshTools() {
    this.isLoading = false;
    tools.getTools().then((res) => {
      if (!res.success) {
        if (res.status === 402) {
          this.$router.push('/overdue');
        } else {
          this.showFailure = true;
        }
      } else {
        this.tools = res.data;
        this.shownTools = res.data;

        // Initial sorting of tools
        const indices = Array.from(this.tools.keys());
        indices.sort((a, b) =>
          this.tools[a]?.name.localeCompare(this.tools[b]?.name),
        );
        this.tools = indices.map((i) => this.tools[i]);

        this.updateTools(this.tools);
        this.isLoading = true;
      }
    });
  }

  getPastLoans() {
    loans.getPastLoans().then((res) => {
      this.pastLoans = res.data;
    });
  }

  getCurrentLoans() {
    loans.getCurrentLoans().then((res) => {
      this.currentLoans = res.data;
      this.keyForCurrentLoans += 1;
    });
  }

  getLostLoans() {
    loans.getLostLoans().then((res) => {
      this.lostLoans = res.data;
      this.gotLostLoans = true;
    });
  }

  mounted() {
    if (this.store || this.admin) {
      parts.getParts().then((res) => {
        this.parts = res.data;
      });

      tools.getCommonTools().then((res) => {
        this.commonTools = res.data;
        this.gotCommonTools = true;
      });

      loans.getPastLoans().then((res) => {
        this.pastLoans = res.data;
        this.gotPastLoans = true;
      });

      loans.getCurrentLoans().then((res) => {
        this.currentLoans = res.data;
        this.gotCurrentLoans = true;
      });

      this.getLostLoans();
    }
    this.refreshTools();
  }

  lostLoansEmittedUpdate() {
    this.getLostLoans();
    this.getPastLoans();
    this.refreshTools();
  }

  currentLoansEmittedUpdate() {
    this.getCurrentLoans();
    this.getLostLoans();
    this.refreshTools();
  }

  loanToolsEmittedUpdate() {
    successToast(this, 'Successfully loaned tool');
    this.getCurrentLoans();
    this.$bvModal.hide('loan-part-modal');
  }

  returnToolsEmittedUpdate() {
    this.$bvModal.hide('return-modal');

    successToast(this, 'Returned Tools');

    this.refreshTools();
    this.getPastLoans();
    this.getCurrentLoans();
  }

  renewToolsEmittedUpdate() {
    this.$bvModal.hide('renew-modal');
    successToast(this, 'Renewed Tools');
    this.getCurrentLoans();
  }
}
</script>
