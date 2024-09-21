<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Part submitted!
    </b-alert>
    <b-alert variant="danger" v-model="showFailure" dismissible>
      Error submitting part! <b>{{ failureReason }}</b> Try again later.
    </b-alert>
    <h2>Add Part</h2>
    <hr />
    <b-link href="/parts" class="bg-osu"> Back to Parts </b-link>
    <br />
    <br />
    <b-form @submit.prevent v-if="hasMounted">
      <b-form-group
        id="input-part-name"
        label="Item Name:"
        label-for="input-name"
      >
        <b-form-input
          id="input-name"
          v-model="form.name"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-part-key"
        label="Part Key:"
        label-for="input-part-key"
      >
        <b-form-input id="input-part-key" v-model="form.partKey"></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-price"
        label="Price:"
        label-for="input-price"
      >
        <b-form-input
          id="input-price"
          v-model="form.price"
          :number="true"
          type="number"
          min="0.01"
          step="0.01"
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
          min="0"
          step="1"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-threshold"
        label="Reorder Threshold:"
        label-for="input-threshold"
      >
        <b-form-input
          id="input-threshold"
          v-model="form.reorderThreshold"
          type="number"
          :number="true"
          min="0"
          step="1"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-category"
        label="Category:"
        label-for="input-category"
      >
        <b-form-select
          id="input-category"
          v-model="form.category"
          :options="options"
        ></b-form-select>
      </b-form-group>
      <b-form-group
        id="input-group-vendor"
        label="Vendor:"
        label-for="input-vendor"
      >
        <b-form-select
          id="input-vendor"
          v-model="form.vendor"
          :options="vendorOptions"
        ></b-form-select>
      </b-form-group>
      <b-form-group>
        <b-form-checkbox id="input-purchasable" v-model="form.canPurchase"
          >Students can purchase</b-form-checkbox
        >
      </b-form-group>
      <b-form-group>
        <b-form-checkbox id="input-returnable" v-model="form.canReturn"
          >Students can return</b-form-checkbox
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

      <b-form-group
        id="input-group-files"
        label="Upload part attachment files:"
        label-for="input-files"
      >
        <b-form-file
          id="input-files"
          v-model="form.file"
          accept=".zip"
          plain
        ></b-form-file>
      </b-form-group>
      <br />
      <b-button @click="onSubmit" variant="danger"> Create part </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import parts from '../../api/parts';
import categories from '../../api/categories';
import vendors from '../../api/vendors';
import roles from '../../shared/roles';
import { StandardResponse } from '../../shared/requests';
import files from '@/api/files';

@Component({})
export default class PartsCreate extends Vue {
  options: { text: string; value: string }[] = [];
  vendorOptions: { text: string; value: string }[] = [];
  hasMounted = false;
  form: {
    name: string;
    partKey: string;
    price: number;
    quantity: number;
    reorderThreshold: number;
    category: string;
    vendor: string;
    canPurchase: boolean;
    canReturn: boolean;
    file: null | File;
    previewFile: null | File;
  } = null as any;

  mounted() {
    if (roles.student) {
      this.$router.push('/forbidden');
      return;
    }
    categories.getCategories().then((res) => {
      if (res.status) {
        res.data.forEach((cat: Category) => {
          this.options.push({ text: cat.name, value: cat.name });
        });
      }
    });
    vendors.getVendors().then((res) => {
      if (res.status) {
        res.data.forEach((ven: Vendor) => {
          this.vendorOptions.push({ text: ven.name, value: ven.name });
        });
      }
    });
    this.clearForm();
    this.hasMounted = true;
  }

  showSuccess = false;

  failureReason = '';

  showFailure = false;

  clearForm() {
    this.form = {
      name: '',
      partKey: '',
      price: 0.0,
      quantity: 0,
      reorderThreshold: 0,
      category: 'Uncategorized',
      vendor: 'Unknown',
      canPurchase: true,
      canReturn: true,
      file: null,
      previewFile: null,
    };
  }

  renderTriggered() {
    this.clearForm();
  }

  onSubmit() {
    parts
      .postPart(
        this.form.name,
        this.form.partKey.toUpperCase(),
        Number(Number(this.form.price).toFixed(2)),
        this.form.quantity,
        this.form.reorderThreshold,
        this.form.category,
        this.form.vendor,
        this.form.canPurchase,
        this.form.canReturn,
        this.form.file,
        this.form.previewFile,
      )
      .then((res) => {
        if (res.data?.status == 'success') {
          let promises: Promise<StandardResponse>[] = [];
          if (this.form.previewFile) {
            promises.push(
              files.uploadFile(
                res.data.postImageUrl,
                res.data.postImageFields,
                this.form.previewFile,
              ),
            );
          }

          if (this.form.file) {
            promises.push(
              files.uploadFile(
                res.data.postFileUrl,
                res.data.postFileFields,
                this.form.file,
                'application/octet-stream',
              ),
            );
          }
          Promise.all(promises).then((values) => {
            this.showSuccess = values.every((item) => item.status);
            this.clearForm();
          });
        } else {
          this.showFailure = true;
          this.failureReason = res.data?.reason;
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
