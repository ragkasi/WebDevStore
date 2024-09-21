<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Part added to cart!
    </b-alert>
    <b-alert variant="secondary" show>
      <b>Important:</b> Make sure you have read the FEH Laser Cutting policy
      document.
    </b-alert>
    <p>
      Please use the following form to provide the Laser Cutting Team the
      details of your order. You will need to submit this form multiple times
      for different parts. Refer to the policy document for more details.
    </p>
    <hr />
    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-description"
        label-cols-md="2"
        label="Description:"
        label-for="input-description"
      >
        <b-form-textarea
          id="input-description"
          v-model="form.description"
          required
          placeholder="Provide a short description of your part and what it will be used for."
          rows="3"
          max-rows="3"
        ></b-form-textarea>
      </b-form-group>
      <b-form-group
        id="input-group-material-type"
        label="Material Type:"
        label-for="input-material-type"
      >
        <b-form-select
          id="input-material-type"
          v-model="form.materialType"
          :options="types"
          plain
          required
        ></b-form-select>
      </b-form-group>
      <b-form-group
        id="input-group-dxf"
        label=".DXF Drawing File:"
        label-for="input-dxf"
      >
        <b-form-file
          id="input-dxf"
          v-model="form.dxf"
          accept=".dxf"
          plain
          required
        ></b-form-file>
      </b-form-group>
      <b-form-group
        id="input-group-length"
        label="Laser Path Length (inches)"
        label-for="input-length"
      >
        <b-form-input
          id="input-length"
          v-model="form.length"
          required
          min="0"
          step=".01"
          :number="true"
          type="number"
          :state="validLengthArea"
        ></b-form-input
        ><b-form-invalid-feedback id="input-area-feedback">
          This path length is too small to enclose the area below.
        </b-form-invalid-feedback>
      </b-form-group>
      <small>Provided by SolidWorks</small>
      <b-form-group
        id="input-group-area"
        label="Area (inches^2)"
        label-for="input-area"
      >
        <b-form-input
          id="input-area"
          v-model="form.area"
          required
          min="0"
          step=".01"
          :number="true"
          type="number"
          :state="validLengthArea"
        ></b-form-input
        ><b-form-invalid-feedback id="input-area-feedback">
          This area is too large to be enclosed by the path length above.
        </b-form-invalid-feedback>
      </b-form-group>
      <small>Provided by SolidWorks</small>
      <b-form-group
        id="input-group-quantity"
        label="Part Quantity:"
        label-for="input-quantity"
      >
        <b-form-input
          id="input-quantity"
          v-model="form.quantity"
          required
          min="1"
          step="1"
          :number="true"
          type="number"
        ></b-form-input>
      </b-form-group>
      <hr />
      <b-button type="submit" variant="danger"> Add to cart </b-button>
    </b-form>
    <b-modal ref="badFileModal" ok-variant="danger"
      ><template #modal-title> File Validation Failed </template>Check that your
      files aren't empty.</b-modal
    >
  </div>
</template>

<script lang="ts">
import files from '@/api/files';
import { Component, Vue } from 'vue-property-decorator';
import { v4 } from 'uuid';
import { productMaterialTypes } from '@/utils/config';
import Store from '@/shared/store';
import roles from '@/shared/roles';
import { failToast } from '@/utils/genericUtils';

@Component({})
export default class LCAddProduct extends Vue {
  showSuccess = false;

  types = productMaterialTypes;

  form: {
    length: number;
    area: number;
    quantity: number;
    description: string;
    dxf: null | File;
    materialType: number;
  } = {
    length: 0,
    area: 0,
    quantity: 1,
    description: '',
    dxf: null,
    materialType: 0,
  };

  clearForm() {
    this.form = {
      length: 0,
      area: 0,
      quantity: 1,
      description: '',
      dxf: null,
      materialType: 0,
    };
  }

  badSubmitCount = 0;
  get validLengthArea() {
    // Only highlight the input box red-bad/green-good if a nonzero area is entered
    if (this.form.area == 0) {
      return null;
    }
    return this.form.area <= Math.pow(this.form.length, 2) / (4 * Math.PI);
  }

  async onSubmit(evt: Event) {
    evt.preventDefault();

    if (!this.form.dxf || !this.form.dxf.size) {
      (this.$refs['badFileModal'] as Vue & { show: () => boolean }).show();
      return;
    }

    if (!this.validLengthArea) {
      this.badSubmitCount++;
      failToast(this, 'Please fix issues before submitting!');
      if (this.badSubmitCount >= 10) {
        let wikiUrl =
          'https://en.wikipedia.org/wiki/Area#Relation_of_area_to_perimeter';
        window.open(wikiUrl, '_blank');
      }
      return;
    }

    const id = v4();

    const prefix =
      roles.teamName +
      '_Q' +
      this.form.quantity.toString() +
      '_M_' +
      this.types.find((elem) => elem.value == this.form.materialType)
        ?.fileText +
      '_';

    const reader = new FileReader();
    reader.onloadend = () => {
      Store.set(
        `${id}-dxf`,
        JSON.stringify({
          src: reader.result,
          filename: prefix + this.form.dxf?.name,
        }),
      );
    };
    reader.readAsDataURL(this.form.dxf);

    const res = await files.getPresignedUrl(id, {
      keyPrefix: 'services/laser/dxf/',
      contentType: 'application',
      filename: prefix + this.form.dxf.name,
      mimetype: 'application/dxf',
    });
    if (res.data?.result == 'success' && this.form.dxf) {
      await files.uploadFile(
        res.data.presignedUrl,
        res.data.presignedFields,
        this.form.dxf,
        'application/dxf',
      );
    }

    this.$store.dispatch('addProduct', {
      id: id,
      type: 1,
      data: {
        description: this.form.description,
        length: this.form.length,
        area: this.form.area,
        quantity: this.form.quantity,
        materialType: this.form.materialType,
      },
      files: [
        {
          id: res.data.fileId,
          filename: this.form.dxf.name,
          mimetype: 'application/dxf',
        },
      ],
    });
    this.clearForm();
    this.$router.push('/orders/cart').catch(() => {});
  }
}
</script>
