<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Tool Edited!
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error editing tool! <b>{{ failureReason }}</b> Try again later.
    </b-alert>
    <h2>Edit Tool</h2>
    <hr />
    <b-link href="/loans" class="bg-osu"> Back to Tools </b-link>
    <br />
    <br />
    <b-form @submit.prevent v-if="loading">
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
      <label v-if="oldPreviewImage"
        ><b>Current preview image:</b> {{ oldPreviewImage }}</label
      >
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
      <b-button type="submit" @click="onSubmit" variant="danger">
        Submit tool for editing
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import tools from '../../api/tools';
import files from '../../api/files';
import roles from '../../shared/roles';

@Component({})
export default class ToolEdit extends Vue {
  oldPreviewImage: string = null as any;
  id = '';
  form: {
    name: string;
    toolKey: string;
    quantity: number;
    requireItemNumber: boolean;
    allowMultipleLoans: boolean;
    isCommon: boolean;
    previewFile: null | File;
  } = null as any;
  loading = false;

  beforeMount() {
    this.id = this.$route.params.id;
    tools.getTool(this.id).then((res) => {
      if (res.data?.status === 'success') {
        const tool = res.data.tool;
        this.form = {
          name: tool.name,
          toolKey: tool.toolKey,
          quantity: tool.quantity,
          requireItemNumber: tool.requireItemNumber,
          allowMultipleLoans: tool.allowMultipleLoans,
          isCommon: tool.isCommonTool,
          previewFile: null,
        };
        this.oldPreviewImage = tool.previewImage?.filename ?? null;
        this.loading = true;
      } else {
        this.$router.push('/loans/edit').catch(() => {});
      }
    });
  }

  mounted() {
    if (roles.student) {
      this.$router.push('/forbidden');
    }
  }

  showSuccess = false;

  showFailure = false;

  failureReason = '';

  onSubmit() {
    tools
      .editTool(
        this.id,
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
          if (this.form.previewFile) {
            files.uploadFile(
              data.data.postImageUrl,
              data.data.postImageFields,
              this.form.previewFile,
            );
          }
          this.showSuccess = true;
          setTimeout(() => {
            this.$router.push('/loans').catch(() => {});
          }, 1000);
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
