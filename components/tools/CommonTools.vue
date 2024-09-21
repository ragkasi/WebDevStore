<template>
  <div v-if="admin || store">
    <b-alert variant="success" v-model="showLoanSuccess" dismissible>
      Tool successfully loaned.
    </b-alert>
    <div
      v-for="tool in commonTools"
      :key="tool.id"
      class="flex-wrap flew-row justify-content-center d-inline"
    >
      <b-button
        variant="danger"
        class="small-button"
        v-b-modal="'loan-common-tool-modal-' + tool.id"
        >{{ tool.name }}
      </b-button>
      <span>&nbsp;</span>

      <b-modal
        :id="'loan-common-tool-modal-' + tool.id"
        title="Loan Tool"
        hide-footer
      >
        <LoanToolForm
          :name="tool.name"
          :id="tool.id"
          :requireItemNumber="tool.requireItemNumber"
          v-on:update="onLoanToolSuccess"
        ></LoanToolForm>
      </b-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import roles from '../../shared/roles';
import LoanToolForm from '../loans/LoanToolForm.vue';

@Component({ components: { LoanToolForm } })
export default class CommonTools extends Vue {
  @Prop(Array) commonTools!: Tool[];

  showLoanSuccess = false;

  get admin() {
    return roles.admin;
  }

  get store() {
    return roles.store;
  }

  onLoanToolSuccess(id: string) {
    this.$bvModal.hide(`loan-common-tool-modal-${id}`);
    this.showLoanSuccess = true;
    setTimeout(() => {
      this.update();
    }, 1000);
  }

  update() {
    this.$emit('update');
    this.$emit('refresh');
  }
}
</script>
<style scoped>
.small-button {
  padding: 3px;
  font-size: 12px;
}
</style>
