<template>
  <div>
    <b-alert variant="success" v-model="showAddSuccess" dismissible>
      Suggested Charge Added
    </b-alert>

    <b-alert variant="success" v-model="showEditSuccess" dismissible>
      Suggested Charge Edited
    </b-alert>

    <b-alert variant="success" v-model="showDeleteSuccess" dismissible>
      Suggeseted Charge Deleted
    </b-alert>

    <h3>Suggested Charges</h3>

    <div>
      <div class="mt-2">
        <FehTableWrapping
          :all="suggestedCharges"
          :shown="shownSuggestedCharges"
          v-on:pagingChange="pagingChange"
        >
          <template v-slot:top-right>
            <div class="mb-2">
              <b-button
                v-if="store"
                variant="danger"
                style="float: right"
                v-b-modal.add-suggested-charge-modal
                >Add Suggested Charge</b-button
              >
              <div style="float: right">
                <ChargeSearch
                  v-on:update="update"
                  :charges="suggestedCharges"
                />
              </div>
            </div>
          </template>
          <b-table
            id="staff-table"
            striped
            hover
            :items="shownSuggestedCharges"
            :fields="fields"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :current-page="paging.current"
            :per-page="paging.per"
            responsive="sm"
          >
            <template #cell(amount)="data">
              ${{ parseFloat(data.value).toFixed(2) }}
            </template>

            <template #cell(actions)="data">
              <div v-if="store">
                <b-button
                  variant="danger"
                  @click="copyFromSuggestedCharge(data.item)"
                >
                  Copy
                </b-button>
                &nbsp;
                <b-button
                  variant="danger"
                  @click="editedSuggesteedCharge = data.item"
                  v-b-modal.edit-suggested-charge-modal
                >
                  <i class="fa fa-edit" />
                </b-button>
                &nbsp;
                <b-button
                  variant="danger"
                  @click="deletedSuggestedCharge = data.item"
                  v-b-modal.delete-suggested-charge-modal
                  ><i class="fa fa-trash"
                /></b-button>
              </div>
            </template>
          </b-table>
        </FehTableWrapping>
      </div>
    </div>

    <b-modal
      id="delete-suggested-charge-modal"
      title="Delete Charge"
      hide-footer
    >
      <DeleteSuggestedChargeForm
        :charge="deletedSuggestedCharge"
        v-on:update="suggestedChargeDeletedSuccessfully"
      ></DeleteSuggestedChargeForm>
    </b-modal>

    <b-modal
      id="add-suggested-charge-modal"
      title="Add Suggested Charge"
      hide-footer
    >
      <AddSuggestedChargeForm
        v-on:update="suggestedChargeAddedSuccessfully"
      ></AddSuggestedChargeForm>
    </b-modal>

    <b-modal
      id="edit-suggested-charge-modal"
      title="Update Suggested Charge"
      hide-footer
    >
      <EditSuggestedChargeForm
        v-on:update="suggestedChargeEditedSuccessfully"
        :suggestedCharge="editedSuggesteedCharge"
      ></EditSuggestedChargeForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DeleteSuggestedChargeForm from './DeleteSuggestedChargeForm.vue';
import AddSuggestedChargeForm from './AddSuggestedChargeForm.vue';
import EditSuggestedChargeForm from './EditSuggestedChargeForm.vue';
import ChargeSearch from './ChargeSearch.vue';
import FehTableWrapping from '../utils/FehTableWrapping.vue';

import roles from '../../shared/roles';
import charges from '../../api/charges';
@Component({
  components: {
    DeleteSuggestedChargeForm,
    AddSuggestedChargeForm,
    EditSuggestedChargeForm,
    ChargeSearch,
    FehTableWrapping,
  },
})
export default class SuggestedCharges extends Vue {
  suggestedCharges: Charge[] = [];
  shownSuggestedCharges: Charge[] = [];

  editedSuggesteedCharge: Charge | null = null;
  deletedSuggestedCharge: Charge | null = null;

  paging = { per: 1, current: 1, total: 1 };
  pagingChange(incoming: Paging) {
    this.paging = incoming;
  }

  sortBy = 'createdAt';
  sortDesc = true;
  fields = [
    { key: 'description', label: 'Description', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'actions', label: '' },
  ];

  showAddSuccess = false;
  showEditSuccess = false;
  showDeleteSuccess = false;

  get admin() {
    return roles.admin;
  }

  get store() {
    return roles.store;
  }

  mounted() {
    this.loadSuggestedCharges();
  }

  loadSuggestedCharges() {
    charges.getSuggestedCharges().then((res) => {
      this.suggestedCharges = res.data;
      this.update(this.suggestedCharges);
    });
  }

  update(charges: Charge[]) {
    this.shownSuggestedCharges = charges;
  }

  suggestedChargeAddedSuccessfully() {
    this.showAddSuccess = true;
    this.loadSuggestedCharges();
    this.$bvModal.hide('add-suggested-charge-modal');
  }

  suggestedChargeEditedSuccessfully() {
    this.$bvModal.hide('edit-suggested-charge-modal');
    this.showEditSuccess = true;
    this.loadSuggestedCharges();
  }

  suggestedChargeDeletedSuccessfully() {
    this.$bvModal.hide('delete-suggested-charge-modal');
    this.showDeleteSuccess = true;
    this.loadSuggestedCharges();
  }

  copyFromSuggestedCharge(charge: Charge) {
    this.$emit('copyFromSuggestedCharge', charge);
  }
}
</script>
