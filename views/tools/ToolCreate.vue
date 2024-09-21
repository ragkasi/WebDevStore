<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Tool submitted!
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error submitting tool! <b>{{ failureReason }}</b> Try again later.
    </b-alert>
    <h2>Add Tool</h2>
    <hr />
    <b-link href="/loans" class="bg-osu"> Back to Tools </b-link>
    <br />
    <br />
    <b-form @submit.prevent>
      <b-form-group id="input-tool-name" label="Name:" label-for="input-name">
        <b-form-input
          id="input-name"
          v-model="form.name"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-tool-key"
        label="Tool Key:"
        label-for="input-tool-key"
      >
        <b-form-input
          id="input-tool-key"
          v-model="form.toolKey"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-quantity"
        label="Quantity:"
        label-for="input-quantity"
      >
        <b-form-input
          id="input-quantity"
          v-model="form.quantity"
          :number="true"
          type="number"
          min="1"
          step="1"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group>
        <b-form-checkbox
          id="input-require-item-number"
          v-model="form.requireItemNumber"
          >Require Item Number Entry When Loaning Out</b-form-checkbox
        >
      </b-form-group>
      <b-form-group>
        <b-form-checkbox
          id="input-allow-multiple"
          v-model="form.allowMultipleLoans"
          >Allow multiple loans per team</b-form-checkbox
        >
      </b-form-group>
      <b-form-group>
        <b-form-checkbox id="input-make-shortcut" v-model="form.isCommon"
          >Make shortcut for this tool</b-form-checkbox
        >
      </b-form-group>
      <b-form-group
        id="input-group-preview-file"
        label="Upload an image file:"
        label-for="input-preview-file"
      >
        <b-form-file
          id="input-preview-file"
          v-model="form.previewFile"
          accept=".jpg, .jpeg, .png"
          plain
        ></b-form-file>
      </b-form-group>
      <br />
      <b-button @click="onSubmit" variant="danger"> Create tool </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import tools from '../../api/tools';
import files from '../../api/files';
import { StandardResponse } from '../../shared/requests';
import roles from '../../shared/roles';

@Component({})
export default class ToolCreate extends Vue {
  form: {
    name: string;
    toolKey: string;
    quantity: number;
    requireItemNumber: boolean;
    allowMultipleLoans: boolean;
    previewFile: null | File;
    isCommon: boolean;
  } = null as any;

  beforeMount() {
    this.clearForm();
  }

  mounted() {
    if (roles.student) {
      this.$router.push('/forbidden');
    }
  }

  showSuccess = false;

  failureReason = '';

  showFailure = false;

  clearForm() {
    this.form = {
      name: '',
      toolKey: '',
      quantity: 0,
      requireItemNumber: false,
      allowMultipleLoans: false,
      previewFile: null,
      isCommon: false,
    };
  }

  renderTriggered() {
    this.clearForm();
  }

  onSubmit() {
    tools
      .postTool(
        this.form.name.toUpperCase(),
        this.form.toolKey.toUpperCase(),
        this.form.quantity,
        this.form.requireItemNumber,
        this.form.allowMultipleLoans,
        this.form.isCommon,
        this.form.previewFile,
      )
      .then((data) => {
        if (data.data?.status == 'success') {
          let promises: Promise<StandardResponse>[] = [];
          if (this.form.previewFile) {
            promises.push(
              files.uploadFile(
                data.data.postImageUrl,
                data.data.postImageFields,
                this.form.previewFile,
              ),
            );
          }
          Promise.all(promises).then((values) => {
            this.showSuccess = values.every((item) => item.status);
            this.clearForm();
          });
        } else {
          this.showFailure = true;
          this.failureReason = data.data?.reason;
        }
      });
  }
}
</script>

<style scoped>
.bg-osu {
  color: #ce0f3d !important;
}
.main-content {
  padding-left: 200px;
  padding-right: 200px;
}
</style>
