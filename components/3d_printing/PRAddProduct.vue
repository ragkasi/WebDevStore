<template>
  <div>
    <b-alert variant="success" v-model="showSuccess" dismissible>
      Part added to cart!
    </b-alert>
    <b-alert variant="secondary" show>
      <b>Important:</b> Make sure you have read the FEH 3D Printing policy
      document.
    </b-alert>
    <p>
      Please use the following form to provide the 3D Printing Team the details
      of your order. You will need to submit this form multiple times for
      different parts. Refer to the policy document for more details.
    </p>
    <p>
      Your current printing material allotment is
      <b
        >{{ filament.toFixed(2) }} grams ({{ pendingWeight.toFixed(2) }} in the
        cart).</b
      >
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
        id="input-group-stl"
        label=".STL Part File:"
        label-for="input-stl"
      >
        <b-form-file
          id="input-stl"
          v-model="form.stl"
          accept=".stl"
          plain
          required
        ></b-form-file>
      </b-form-group>
      <b-form-group
        id="input-group-sw"
        label="SolidWorks Part File:"
        label-for="input-sw"
      >
        <b-form-file
          id="input-sw"
          v-model="form.sw"
          accept=".sldprt"
          plain
          required
        ></b-form-file>
      </b-form-group>
      <b-form-group
        id="input-group-weight"
        label="Part Weight (grams):"
        label-for="input-weight"
      >
        <b-form-input
          id="input-weight"
          v-model="form.weight"
          required
          min="0"
          step=".01"
          :number="true"
          type="number"
        ></b-form-input>
      </b-form-group>
      <small>Provided by MakerBot software</small>
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
      <b-button :disabled="disabled" type="submit" variant="danger">
        Add to cart
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import files from '@/api/files';
import roles from '@/shared/roles';
import { Component, Vue } from 'vue-property-decorator';
import teams from '../../api/teams';
import { v4 } from 'uuid';
import Store from '@/shared/store';
import { failToast } from '@/utils/genericUtils';

@Component({})
export default class PRAddProduct extends Vue {
  showSuccess = false;

  filament = 0;

  form: {
    description: string;
    quantity: number;
    weight: number;
    stl: null | File;
    sw: null | File;
  } = {
    description: '',
    quantity: 1,
    weight: 0,
    stl: null,
    sw: null,
  };

  mounted() {
    teams.getFilament(roles.teamName).then((res) => {
      if (res.status === 402) {
        this.$router.push('/overdue');
      } else if (res.data.status == 'success') {
        this.filament = Number(res.data?.filament);
      }
    });
  }

  get disabled() {
    return (
      this.filament - Number(this.form.weight) * Number(this.form.quantity) < 0
    );
  }

  get pendingWeight() {
    return this.$store.state.cart.products
      .filter((elem: Product) => elem.type == 0)
      .reduce(
        (previousValue: number, currentValue: PrintedProduct) =>
          previousValue + currentValue.data.weight * currentValue.data.quantity,
        0,
      );
  }

  clearForm() {
    this.form = {
      description: '',
      quantity: 1,
      weight: 0,
      stl: null,
      sw: null,
    };
  }

  async onSubmit(evt: Event) {
    evt.preventDefault();

    if (
      !this.form.sw ||
      !this.form.sw.size ||
      !this.form.stl ||
      !this.form.stl.size
    ) {
      failToast(
        this,
        "File validation failed. Check that your files aren't empty",
      );
      return;
    }

    if (
      this.filament -
        this.pendingWeight -
        this.form.weight * this.form.quantity <
      0
    ) {
      failToast(this, 'Not enough filament left');
      return;
    }

    const id = v4();

    const prefix =
      roles.teamName +
      '_Q' +
      this.form.quantity.toString() +
      '_W' +
      this.form.weight.toString() +
      '_';

    const reader = new FileReader();
    reader.onloadend = () => {
      Store.set(
        `${id}-stl`,
        JSON.stringify({
          src: reader.result,
          filename: prefix + this.form.stl?.name,
        }),
      );
    };
    reader.readAsDataURL(this.form.stl);

    const reader2 = new FileReader();
    reader2.onloadend = () => {
      Store.set(
        `${id}-sw`,
        JSON.stringify({
          src: reader2.result,
          filename: prefix + this.form.sw?.name,
        }),
      );
    };
    reader2.readAsDataURL(this.form.sw);

    const res = await files.getPresignedUrl(id, {
      keyPrefix: 'services/3d/stl/',
      contentType: 'application',
      filename: prefix + this.form.stl.name,
      mimetype: 'application/sla',
    });

    if (res.data?.result == 'success' && this.form.stl) {
      files.uploadFile(
        res.data.presignedUrl,
        res.data.presignedFields,
        this.form.stl,
        'application/sla',
      );
    }

    const res2 = await files.getPresignedUrl(id, {
      keyPrefix: 'services/3d/sw/',
      contentType: 'application',
      filename: prefix + this.form.sw.name,
      mimetype: 'application/octet-stream',
    });

    if (res2.data?.result == 'success' && this.form.sw) {
      files.uploadFile(
        res2.data.presignedUrl,
        res2.data.presignedFields,
        this.form.sw,
        'application/octet-stream',
      );
    }

    this.$store.dispatch('addProduct', {
      id: id,
      type: 0,
      data: {
        description: this.form.description,
        quantity: this.form.quantity,
        weight: this.form.weight,
      },
      files: [
        {
          id: res.data.fileId,
          filename: this.form.stl.name,
          mimetype: 'application/sla',
        },
        {
          id: res2.data.fileId,
          filename: this.form.sw.name,
          mimetype: 'application/octet-stream',
        },
      ],
    });

    this.clearForm();
    this.$router.push('/orders/cart').catch(() => {});
  }
}
</script>
