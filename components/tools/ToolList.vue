<template>
  <div>
    <b-alert variant="success" v-model="showDeleteSuccess" dismissible>
      Tool successfully deleted.
    </b-alert>
    <b-alert variant="success" v-model="showLoanSuccess" dismissible>
      Tool successfully loaned.
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error deleting tool.
    </b-alert>

    <b-row>
      <b-col
        v-for="tool in tools"
        :key="tool.id"
        href="#"
        class="flex-wrap flew-row justify-content-center"
        md="6"
        lg="4"
        xl="3"
      >
        <div>
          <b-card
            border-variant="dark"
            class="mb-2 card"
            :img-src="tool.imgSrc"
            :img-alt="tool.name"
            img-height="250rem"
            img-width="auto"
            overlay
          >
            <b-button
              class="button"
              style="right: 45px"
              v-on:click="deletedTool = tool"
              v-b-modal.delete-tool-modal
              v-if="admin || store"
            >
              <i class="fa fa-trash" />
            </b-button>
            <b-button
              class="button"
              style="right: 10px"
              :to="'/loans/edit/' + tool.id"
              v-if="admin || store"
            >
              <i class="fa fa-edit" />
            </b-button>

            <div class="info" @click="imageClicked(tool)">
              <b-card-title style="font-size: 1.2rem">
                {{ tool.name }}
              </b-card-title>
            </div>

            <template #footer>
              <div style="float: left">
                <span style="font-size: 1rem; font-weight: bold">
                  {{ tool.numCheckedOut }} out of {{ tool.quantity }} checked
                  out
                </span>
              </div>
              <div>
                <b-button
                  v-if="admin || store"
                  class="osu-button"
                  v-b-modal="'loan-tool-modal-' + tool.id"
                  >Loan Tool</b-button
                >
              </div>
            </template>
          </b-card>
        </div>
        <b-modal
          :id="'loan-tool-modal-' + tool.id"
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
      </b-col>
    </b-row>

    <b-modal id="image-modal" :title="expandedToolName" hide-footer>
      <img :src="expandedToolSource" style="width: 100%" />
    </b-modal>

    <b-modal id="delete-tool-modal" title="Delete Tool" hide-footer>
      <DeleteToolForm
        :tool="deletedTool"
        v-on:update="onDeleteToolSuccess"
      ></DeleteToolForm>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import roles from '../../shared/roles';
import LoanToolForm from '../loans/LoanToolForm.vue';
import DeleteToolForm from './DeleteToolForm.vue';

@Component({
  components: { LoanToolForm, DeleteToolForm },
})
export default class ToolList extends Vue {
  @Prop(Array) tools!: Tool[];

  showDeleteSuccess = false;
  showLoanSuccess = false;

  showFailure = false;

  get admin() {
    return roles.admin;
  }

  get store() {
    return roles.store;
  }

  update() {
    this.$emit('update');
    this.$emit('refresh');
  }

  deletedTool: Tool | null = null;
  onDeleteToolSuccess() {
    this.$bvModal.hide('delete-tool-modal');
    this.showDeleteSuccess = true;
    setTimeout(() => {
      this.$emit('refresh');
    }, 500);
  }

  expandedToolName = '';
  expandedToolSource = '';
  imageClicked(tool: Tool) {
    this.expandedToolName = tool.name.toUpperCase();
    this.expandedToolSource = tool.imgSrc;
    this.$bvModal.show('image-modal');
  }

  onLoanToolSuccess(id: string) {
    this.$bvModal.hide(`loan-tool-modal-${id}`);
    this.showLoanSuccess = true;
    setTimeout(() => {
      this.update();
    }, 1000);
  }
}
</script>

<style scoped>
.padding-0 {
  padding-left: 0px;
  padding-right: 0px;
}

.button {
  position: absolute;
  top: 5px;
  width: 30px !important;
  height: 30px !important;
  background-color: rgba(206, 15, 61, 1);
  padding: 0%;
}

.button:hover {
  background-color: rgba(206, 15, 16, 1);
}

.info {
  vertical-align: text-bottom;
  position: absolute;
  bottom: 0;
  padding: 5px;
  margin: 0px;
  left: 0;
  width: 100%;
  background: rgba(206, 15, 61, 0.75);
  color: whitesmoke;
}

.info:hover {
  background-color: rgba(206, 15, 61, 0.9);
  cursor: pointer;
}

.card-footer {
  padding: 0.25rem 0.75rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.125);
}
.card-title {
  margin-bottom: 0;
}

.card:hover {
  box-shadow: 10px 5px 5px gray;
}

.osu-button {
  width: 100%;
  background-color: rgba(206, 15, 61, 0.9);
}

.osu-button:hover {
  width: 100%;
  background-color: rgba(206, 15, 61, 1);
}

.btn-secondary {
  padding: 3px;
}
</style>
