<template>
  <div>
    <b-alert variant="success" v-model="showAddSuccess" dismissible>
      Charge Added
    </b-alert>

    <b-alert variant="success" v-model="showEditSuccess" dismissible>
      Charge Edited
    </b-alert>

    <b-alert variant="success" v-model="showDeleteSuccess" dismissible>
      Charge Deleted
    </b-alert>

    <ChargeTeam
      v-if="showChargePage"
      :teamId="teamId"
      :addingNewCharge="addingNewCharge"
      :charge="editedCharge"
      v-on:add-success="chargeAddedSuccessfully"
      v-on:edit-success="chargeEditedSuccessfully"
      v-on:cancel="showChargePage = false"
    ></ChargeTeam>

    <div v-else class="mt-2">
      <FehTableWrapping :all="charges" v-on:pagingChange="pagingChange">
        <template v-slot:top-right>
          <b-button
            v-if="store"
            variant="danger"
            style="float: right"
            class="mb-2"
            @click="addChargeButtonClicked"
            >Add Charge</b-button
          >
        </template>
        <b-table
          id="charges-table"
          striped
          hover
          :items="charges"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :current-page="paging.current"
          :per-page="paging.per"
          responsive="sm"
        >
          <template #cell(createdAt)="data">
            {{ new Date(data.value).toLocaleString() }}
          </template>

          <template #cell(amount)="data">
            ${{ parseFloat(data.value).toFixed(2) }}
          </template>

          <template #cell(actions)="data">
            <div v-if="store">
              <b-button
                variant="danger"
                @click="editChargeButtonClicked(data.item)"
              >
                <i class="fa fa-edit" />
              </b-button>
              &nbsp;
              <b-button
                variant="danger"
                @click="deletedCharge = data.item"
                v-b-modal.delete-charge-modal
                ><i class="fa fa-trash"
              /></b-button>
            </div>
          </template>
        </b-table>
      </FehTableWrapping>
    </div>

    <b-modal id="delete-charge-modal" title="Delete Charge" hide-footer>
      <DeleteChargeForm
        :charge="deletedCharge"
        v-on:update="chargeDeletedSuccessfully"
      ></DeleteChargeForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DeleteChargeForm from './DeleteChargeForm.vue';
import ChargeTeam from './ChargeTeam.vue';
import FehTableWrapping from '../utils/FehTableWrapping.vue';

import roles from '../../shared/roles';
import charges from '../../api/charges';
@Component({
  components: { DeleteChargeForm, ChargeTeam, FehTableWrapping },
})
export default class Charges extends Vue {
  @Prop(String) teamId!: string;

  charges: Charge[] = [];

  showChargePage = false;
  addingNewCharge = false;
  editedCharge: Charge | null = null;
  deletedCharge: Charge | null = null;

  paging = { per: 1, current: 1, total: 1 };
  pagingChange(incoming: Paging) {
    this.paging = incoming;
  }

  sortBy = 'createdAt';
  sortDesc = true;
  fields = [
    { key: 'createdAt', label: 'Date', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
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
    this.loadCharges();
  }

  loadCharges() {
    charges.getAllChargesByTeamId(this.teamId).then((res) => {
      this.charges = res.data;
    });
  }

  update() {
    this.loadCharges();
    this.showChargePage = false;
    this.$emit('update');
  }

  chargeAddedSuccessfully() {
    this.showAddSuccess = true;
    this.update();
  }

  chargeEditedSuccessfully() {
    this.showEditSuccess = true;
    this.update();
  }

  chargeDeletedSuccessfully() {
    this.$bvModal.hide('delete-charge-modal');
    this.showDeleteSuccess = true;
    this.update();
  }

  addChargeButtonClicked() {
    this.addingNewCharge = true;
    this.showChargePage = true;
  }

  editChargeButtonClicked(charge: Charge) {
    this.addingNewCharge = false;
    this.editedCharge = charge;
    this.showChargePage = true;
  }
}
</script>
